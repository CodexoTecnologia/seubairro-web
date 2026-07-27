interface IAuthService {
    login<TCredentials, TResponse>(credentials: TCredentials): Promise<TResponse>;
    logout(): Promise<void>;
    resetPassword(oldPassword: string, newPassword: string): Promise<void>;
    getToken(): string | null;
    setToken(token: string | null): void;
    isAuthenticated(): boolean;
}

interface ITokenService {
    save(token: string): void;
    get(): string | null;
    remove(): void;
}
import { JwtHelper } from '../../helper/JwtHelper';
import { apiClient } from '../../Client/apiClientInstance';

export class AuthService implements IAuthService {
    private tokenService: ITokenService;

    constructor(tokenService: ITokenService) {
        this.tokenService = tokenService;

        const token = this.tokenService.get();
        if (token) {
            apiClient.setBearerToken(token);
        }
    }

    async login<TCredentials, TResponse>(
        credentials: TCredentials
    ): Promise<TResponse> {
        try {
            const response = await apiClient.post<TResponse, TCredentials>(
                '/api/Auth/login',
                credentials,
                { requiresAuth: false }
            );

            const r = response as unknown as { token?: string };
            const token = typeof response === 'string' ? response : r?.token ?? null;

            if (token && JwtHelper.isValidFormat(token)) {
                this.setToken(token);
            }

            return response;
        } catch (error) {
            this.tokenService.remove();
            throw error;
        }
    }

    async logout(): Promise<void> {
        this.setToken(null);
    }

    async resetPassword(oldPassword: string, newPassword: string): Promise<void> {
        await apiClient.post('/api/Auth/reset-password', { oldPassword, newPassword }, {
            requiresAuth: true,
        });
    }

    getToken(): string | null {
        return this.tokenService.get();
    }

    setToken(token: string | null): void {
        if (token) {
            this.tokenService.save(token);
        } else {
            this.tokenService.remove();
        }

        apiClient.setBearerToken(token);
    }

    async addCustomer(): Promise<string | null> {
        let response: any;
        try {
            response = await apiClient.post<{ token: string; expiration: string }>(
                '/api/user/roles/add-customer',
                undefined,
                { requiresAuth: true }
            );
        } catch (err: any) {
            if (err?.error?.statusCode === 404 || err?.error?.statusCode === 405 || err?.statusCode === 404 || err?.statusCode === 405) {
                response = await apiClient.post<{ token: string; expiration: string }>(
                    '/api/User/roles/add-customer',
                    undefined,
                    { requiresAuth: true }
                );
            } else {
                throw err;
            }
        }

        const r = response as unknown as { token?: string };
        const token = typeof response === 'string' ? response : r?.token ?? null;

        if (token && JwtHelper.isValidFormat(token)) {
            this.setToken(token);
            return token;
        }
        return null;
    }

    async refreshToken(): Promise<string | null> {
        const response = await apiClient.post<{ token: string; expiration: string }>(
            '/api/auth/refresh-token',
            undefined,
            { requiresAuth: true }
        );

        const r = response as unknown as { token?: string };
        const token = typeof response === 'string' ? response : r?.token ?? null;

        if (token && JwtHelper.isValidFormat(token)) {
            this.setToken(token);
            return token;
        }
        return null;
    }

    async addEntrepreneur(): Promise<string | null> {
        let response: any;
        try {
            response = await apiClient.post<{ token: string; expiration: string }>(
                '/api/user/roles/add-entrepreneur',
                undefined,
                { requiresAuth: true }
            );
        } catch (err: any) {
            if (err?.error?.statusCode === 404 || err?.error?.statusCode === 405 || err?.statusCode === 404 || err?.statusCode === 405) {
                response = await apiClient.post<{ token: string; expiration: string }>(
                    '/api/User/roles/add-entrepreneur',
                    undefined,
                    { requiresAuth: true }
                );
            } else {
                throw err;
            }
        }

        const r = response as unknown as { token?: string };
        const token = typeof response === 'string' ? response : r?.token ?? null;

        if (token && JwtHelper.isValidFormat(token)) {
            this.setToken(token);
            return token;
        }
        return null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        return !JwtHelper.isExpired(token);
    }
}
