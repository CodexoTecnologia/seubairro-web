'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserService, UserResponse } from '@/API/services/UserService';
import type { UserLoginRequest } from '@/API/dtos/Request/UserLoginRequest';

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
            const user = await UserService.getCurrentUser();
            setState({
                user,
                loading: false,
                isAuthenticated: true,
            });
        } catch (error) {
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
            await UserService.login(credentials);
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
            await UserService.logout();
            setState({
                user: null,
                loading: false,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
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