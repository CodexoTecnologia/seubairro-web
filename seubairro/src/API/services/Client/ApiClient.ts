import { ApiClientError, NetworkError, TimeoutError } from './ApiClientError';
export interface ApiClientConfig {
    baseUrl: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    getAuthToken?: () => string | null | Promise<string | null>;
    onUnauthorized?: () => void | Promise<void>;
}
export interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean | undefined | null>;
    requiresAuth?: boolean;
    timeout?: number;
}
export class ApiClient {
    private config: Required<Omit<ApiClientConfig, 'getAuthToken' | 'onUnauthorized'>> &
        Pick<ApiClientConfig, 'getAuthToken' | 'onUnauthorized'>;
    constructor(config: ApiClientConfig) {
        this.config = {
            baseUrl: config.baseUrl.replace(/\/$/, ''),
            timeout: config.timeout ?? 30000,
            defaultHeaders: config.defaultHeaders ?? {
                'Content-Type': 'application/json',
            },
            getAuthToken: config.getAuthToken,
            onUnauthorized: config.onUnauthorized,
        };
    }
    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
        const url = new URL(`${this.config.baseUrl}${endpoint}`);
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
            ...options.headers,
        };
        if (options.requiresAuth !== false && this.config.getAuthToken) {
            const token = await this.config.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }
    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401 && this.config.onUnauthorized) {
            await this.config.onUnauthorized();
        }
        if (response.status === 204) {
            return null as T;
        }
        let data: unknown;
        try {
            data = await response.json();
        } catch {
            const text = await response.text();
            data = text;
        }
        if (!response.ok) {
            const errorResponse: { success: false; error: { statusCode: number; message: string } } = {
                success: false,
                error: {
                    statusCode: response.status,
                    message: typeof data === 'string' ? data : 'Erro desconhecido',
                },
            };
            if (typeof data === 'object' && data !== null && 'error' in data) {
                Object.assign(errorResponse, data);
            }
            throw new ApiClientError(errorResponse);
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
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body !== undefined ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                ...options,
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
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>('GET', endpoint, options);
    }
    async post<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('POST', endpoint, options, body);
    }
    async put<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('PUT', endpoint, options, body);
    }
    async patch<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<T> {
        return this.request<T>('PATCH', endpoint, options, body);
    }
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>('DELETE', endpoint, options);
    }
}

