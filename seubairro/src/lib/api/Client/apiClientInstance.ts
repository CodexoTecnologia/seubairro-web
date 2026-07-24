import { ApiClient } from './ApiClient';

export const apiClient = new ApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7112',
    timeout: 30000,
    defaultHeaders: { 'Content-Type': 'application/json' },
    acceptLanguage: 'pt-BR',
    onUnauthorized: async () => {
        if (typeof window !== 'undefined') {
            const current = window.location.pathname + window.location.search;
            const redirect = encodeURIComponent(current);
            window.location.href = `/login?redirect=${redirect}`;
        }
    }
});

export const setAuthToken = (token: string | null) => apiClient.setBearerToken(token);
export const getAuthToken = () => apiClient.getBearerToken();
export const clearAuthToken = () => apiClient.setBearerToken(null);

export * from './ApiClient';
export * from './ApiClientError';