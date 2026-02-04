import { ApiClient } from './ApiClient';
let authToken: string | null = null;
export const setAuthToken = (token: string | null): void => {
    authToken = token;
};
export const getAuthToken = (): string | null => {
    return authToken;
};
export const clearAuthToken = (): void => {
    authToken = null;
};
export const apiClient = new ApiClient({
    baseUrl: process.env.API_BASE_URL!,
    timeout: 30000,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    getAuthToken: () => getAuthToken(),
    onUnauthorized: async () => {
        clearAuthToken();
        console.warn('Sessão expirada. Usuário foi desautenticado.');
    },
});

