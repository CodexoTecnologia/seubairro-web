'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserService, UserResponse } from '@/API/services/UserService';
import type { UserLoginRequest } from '@/API/dtos/Request/UserLoginRequest';
import { authService } from '@/API/services/(Auth)/AuthInstance';

interface AuthState {
    user: UserResponse | null;
    loading: boolean;
    isAuthenticated: boolean;
}

/**
 * Hook de autenticação que utiliza o AuthManager (padrão Bridge).
 * 
 * O AuthManager permite trocar facilmente a estratégia de autenticação
 * (JWT, OAuth, etc.) sem modificar este hook.
 */
export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        isAuthenticated: false,
    });

    const loadUser = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true }));

            // Verifica se está autenticado antes de carregar o usuário
            if (!authService.isAuthenticated()) {
                setState({
                    user: null,
                    loading: false,
                    isAuthenticated: false,
                });
                return;
            }

            const user = await UserService.getCurrentUser();
            setState({
                user,
                loading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            // Se falhar ao carregar o usuário, limpa a autenticação
            authService.logout();
            setState({
                user: null,
                loading: false,
                isAuthenticated: false,
            });
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    /**
     * Realiza o login usando o AuthManager.
     * O token JWT é gerenciado automaticamente pela estratégia configurada.
     */
    const login = async (credentials: UserLoginRequest) => {
        try {
            // Usa o AuthManager para autenticar (padrão Bridge)
            const response = await authService.login<UserLoginRequest, any>(credentials);

            // Carrega os dados do usuário após o login
            await loadUser();

            return { success: true, message: '' };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Erro ao fazer login',
            };
        }
    };

    /**
     * Realiza o logout usando o AuthManager.
     * O token JWT é removido automaticamente.
     */
    const logout = async () => {
        try {
            await authService.logout();
            setState({
                user: null,
                loading: false,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, limpa o estado local
            setState({
                user: null,
                loading: false,
                isAuthenticated: false,
            });
        }
    };

    return {
        user: state.user,
        loading: state.loading,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
        refreshUser: loadUser,
    };
}