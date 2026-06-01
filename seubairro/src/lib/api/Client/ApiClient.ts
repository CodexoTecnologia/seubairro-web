import { ApiClientError, ApiErrorResponse, NetworkError, TimeoutError } from './ApiClientError';

export interface ApiClientConfig {
    baseUrl: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    acceptLanguage?: string;
    onUnauthorized?: () => void | Promise<void>;
}

export interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean | undefined | null>;
    requiresAuth?: boolean;
    timeout?: number;
}

export class ApiClient {
    private token: string | null = null;
    private config: Required<Omit<ApiClientConfig, 'onUnauthorized'>> &
        Pick<ApiClientConfig, 'onUnauthorized'>;

    constructor(config: ApiClientConfig) {
        this.config = {
            baseUrl: config.baseUrl,
            timeout: config.timeout ?? 30000,
            defaultHeaders: config.defaultHeaders ?? {
                'Content-Type': 'application/json',
            },
            acceptLanguage: config.acceptLanguage ?? 'pt-BR',
            onUnauthorized: config.onUnauthorized,
        };
    }

    setBearerToken(token: string | null) {
        this.token = token;
    }

    getBearerToken(): string | null {
        return this.token;
    }

    setAcceptLanguage(language: string) {
        this.config.acceptLanguage = language;
    }

    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
        const fullPath = `${this.config.baseUrl || ''}${endpoint}`;
        let url: URL;
        try {
            url = new URL(fullPath);
        } catch {
            if (typeof window !== 'undefined') {
                url = new URL(fullPath, window.location.origin);
            } else {
                url = new URL(fullPath, 'http://localhost');
            }
        }

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        return url.toString();
    }

    private async buildHeaders(options: RequestOptions): Promise<Record<string, string>> {
        const headers: Record<string, string> = {
            ...this.config.defaultHeaders,
            'Accept-Language': this.config.acceptLanguage,
            ...options.headers,
        };

        if (options.requiresAuth && this.token) {
            if (this.token.startsWith('Bearer ')) {
                headers['Authorization'] = this.token;
            } else {
                headers['Authorization'] = `Bearer ${this.token}`;
            }
        }

        return headers;
    }

    private buildErrorResponse(status: number, data: unknown): ApiErrorResponse {
        if (
            data &&
            typeof data === 'object' &&
            'error' in (data as Record<string, unknown>) &&
            (data as { error: unknown }).error &&
            typeof (data as { error: unknown }).error === 'object'
        ) {
            const raw = (data as { error: Record<string, unknown> }).error;
            return {
                success: false,
                error: {
                    code: (raw.code as string) || 'InternalServerError',
                    message: (raw.message as string) || 'Erro desconhecido',
                    details: Array.isArray(raw.details) ? (raw.details as string[]) : null,
                    statusCode: status,
                },
            };
        }

        return {
            success: false,
            error: {
                code: 'InternalServerError',
                message: typeof data === 'string' && data ? data : 'Erro desconhecido',
                details: null,
                statusCode: status,
            },
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401 && this.config.onUnauthorized) {
            await this.config.onUnauthorized();
        }

        if (response.status === 204) {
            return null as T;
        }

        const clonedResponse = response.clone();
        let data: unknown;

        try {
            data = await response.json();
        } catch {
            try {
                data = await clonedResponse.text();
            } catch {
                data = 'Erro ao processar resposta';
            }
        }

        if (!response.ok) {
            throw new ApiClientError(this.buildErrorResponse(response.status, data));
        }

        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            if ('success' in obj) {
                if (obj.success === false) {
                    throw new ApiClientError(this.buildErrorResponse(response.status, data));
                }
                if ('data' in obj) {
                    return obj.data as T;
                }
            }
        }

        return data as T;
    }

    private async request<T>(
        method: string,
        endpoint: string,
        options: RequestOptions = {},
        body?: unknown
    ): Promise<T> {
        const url = this.buildUrl(endpoint, options.params);
        const headers = await this.buildHeaders(options);
        const timeout = options.timeout ?? this.config.timeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Cookies só viajam em chamadas autenticadas. Em endpoints anônimos
        // (cadastro, login) `omit` evita que um cookie antigo identifique a
        // sessão e o backend rejeite por "já autenticado" (403).
        const credentials: RequestCredentials =
            options.credentials ?? (options.requiresAuth ? 'include' : 'omit');

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body !== undefined ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                ...options,
                credentials,
            });

            clearTimeout(timeoutId);
            return await this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new TimeoutError();
            }
            if (error instanceof TypeError) {
                console.error('ApiClient NetworkError:', error);
                throw new NetworkError();
            }
            throw error;
        }
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>('GET', endpoint, options);
    }

    async postForm<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint, options?.params);
        const headers = await this.buildHeaders({ ...options, headers: {} });
        delete headers['Content-Type'];

        if (options?.requiresAuth && this.token) {
            headers['Authorization'] = this.token.startsWith('Bearer ')
                ? this.token
                : `Bearer ${this.token}`;
        }

        const timeout = options?.timeout ?? this.config.timeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
                signal: controller.signal,
                credentials: options?.credentials ?? (options?.requiresAuth ? 'include' : 'omit'),
            });
            clearTimeout(timeoutId);
            return await this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new TimeoutError();
            }
            if (error instanceof TypeError) {
                throw new NetworkError();
            }
            throw error;
        }
    }

    async post<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('POST', endpoint, options, body);
    }

    async put<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('PUT', endpoint, options, body);
    }

    async putForm<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint, options?.params);
        const headers = await this.buildHeaders({ ...options, headers: {} });
        delete headers['Content-Type'];

        if (options?.requiresAuth && this.token) {
            headers['Authorization'] = this.token.startsWith('Bearer ')
                ? this.token
                : `Bearer ${this.token}`;
        }

        const timeout = options?.timeout ?? this.config.timeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: formData,
                signal: controller.signal,
                credentials: options?.credentials ?? (options?.requiresAuth ? 'include' : 'omit'),
            });
            clearTimeout(timeoutId);
            return await this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new TimeoutError();
            }
            if (error instanceof TypeError) {
                throw new NetworkError();
            }
            throw error;
        }
    }

    async patch<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('PATCH', endpoint, options, body);
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>('DELETE', endpoint, options);
    }
}
