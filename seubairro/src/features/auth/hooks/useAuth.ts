'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserService, UserResponse } from '@/lib/api/services/UserService'
import type { UserLoginRequest } from '@/lib/api/dtos/Request/client/UserLoginRequest'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import { RoleHelper, AppRole } from '@/lib/api/helper/RoleHelper'

type AuthState = {
  user: UserResponse | null
  loading: boolean
  isAuthenticated: boolean
  roles: AppRole[]
}

/** Resposta esperada do /api/Auth/login — string OU { token }. Backend é inconsistente. */
type LoginResponse = string | { token?: string }

type LoginResult = { success: boolean; message: string }

const EMPTY: AuthState = { user: null, loading: false, isAuthenticated: false, roles: [] }

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    roles: [],
  })

  const loadUser = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      if (!authService.isAuthenticated()) {
        setState(EMPTY)
        return
      }
      const user = await UserService.getCurrentUser()
      setState({
        user,
        loading: false,
        isAuthenticated: true,
        roles: RoleHelper.getRoles(),
      })
    } catch (error) {
      console.error('[useAuth] Erro ao carregar usuário:', error)
      authService.logout()
      setState(EMPTY)
    }
  }, [])

  // Padrão canônico de "fetch on mount" — o setState mora dentro do loadUser,
  // não diretamente no effect (escape válido da regra).
  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (credentials: UserLoginRequest): Promise<LoginResult> => {
    try {
      await authService.login<UserLoginRequest, LoginResponse>(credentials)
      await loadUser()
      return { success: true, message: '' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setState(EMPTY)
    }
  }

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    roles: state.roles,
    login,
    logout,
    refreshUser: loadUser,
  }
}
