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

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        isAuthenticated: false,
    });

    const loadUser = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true }));

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

    const login = async (credentials: UserLoginRequest) => {
        try {
            const response = await authService.login<UserLoginRequest, any>(credentials);
            await loadUser();

            return { success: true, message: '' };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Erro ao fazer login',
            };
        }
    };

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