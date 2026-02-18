import { authService } from '../services/(Auth)/AuthInstance';

export const getAuthToken = () => authService.getToken();
export const setAuthToken = (token: string | null) => authService.setToken(token);
export const clearAuthToken = () => authService.setToken(null);
export const isAuthenticated = () => authService.isAuthenticated();