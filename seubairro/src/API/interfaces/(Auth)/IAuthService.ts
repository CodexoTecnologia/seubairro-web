export interface IAuthService {
    login<TCredentials, TResponse>(
        credentials: TCredentials
    ): Promise<TResponse>;
    logout(): Promise<void>;
    resetPassword(email: string, newPassword: string): Promise<void>;
    getToken(): string | null;
    setToken(token: string | null): void;
    isAuthenticated(): boolean;
}