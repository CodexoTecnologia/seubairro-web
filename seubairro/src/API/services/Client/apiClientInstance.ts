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
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7112',
    timeout: 30000,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    getAuthToken: () => getAuthToken(),
    onUnauthorized: async () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
});
