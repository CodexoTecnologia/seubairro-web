import { ApiClient } from './ApiClient';

export const apiClient = new ApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7112',
    timeout: 30000,
    defaultHeaders: { 'Content-Type': 'application/json' },
    onUnauthorized: async () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/pages/login';
        }
    }
});

export const setAuthToken = (token: string | null) => apiClient.setBearerToken(token);
export const getAuthToken = () => apiClient.getBearerToken();
export const clearAuthToken = () => apiClient.setBearerToken(null);

export * from './ApiClient';
export * from './ApiClientError';