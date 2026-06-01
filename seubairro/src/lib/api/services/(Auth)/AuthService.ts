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

/*
 * Service de autenticação que implementa a lógica de JWT e utiliza o padrão Bridge para o armazenamento.
 * Abstração: Lógica de Autenticação (JWT, validação, chamadas API)
 * Implementação (Bridge): ITokenService (LocalStorage, Cookies, Memory)
 */
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
            } else {
                console.error('[AuthService.login] Token ausente ou inválido na resposta.');
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

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        return !JwtHelper.isExpired(token);
    }
}
