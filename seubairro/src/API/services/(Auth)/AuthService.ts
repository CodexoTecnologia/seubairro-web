import { IAuthService } from '../../Interfaces/(Auth)/IAuthService';
import { ITokenService } from '../../Interfaces/(Auth)/ITokenService';
import { JwtHelper } from '../../helper/JwtHelper';
import { apiClient } from '../../Client/apiClientInstance';
import { LocalStorageService } from './LocalStorageService';

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
                '/api/User/login',
                credentials,
                { requiresAuth: false }
            );

            let token: string | null = null;

            if (response && typeof response === 'object') {
                const respConfig = response as any;
                token = respConfig.token || respConfig.accessToken || respConfig.data?.token;
            }

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
        try {
            await apiClient.post('/api/User/logout', {}, { requiresAuth: true });
        } catch (error) {
            console.error('Erro ao fazer logout no servidor', error);
        } finally {
            this.setToken(null);
        }
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
