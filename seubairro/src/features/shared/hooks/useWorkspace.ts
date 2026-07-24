'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import {
  DASHBOARD_BY_ROLE,
  ROLE_BY_WORKSPACE,
  WORKSPACE_BY_ROLE,
  type AppRole,
  type Workspace,
} from '@/lib/api/helper/RoleHelper'

/**
 * Deriva os workspaces disponíveis das roles do usuário e centraliza a troca e adição de perfil.
 */
export function useWorkspace() {
  const { roles, refreshUser } = useAuthContext()
  const router = useRouter()

  const availableWorkspaces: Workspace[] = (roles as AppRole[]).map((role) => WORKSPACE_BY_ROLE[role])
  const canSwitch = availableWorkspaces.length > 1

  const switchWorkspace = useCallback(
    (target: Workspace) => {
      const role = ROLE_BY_WORKSPACE[target]
      if (!roles.includes(role)) return
      router.push(DASHBOARD_BY_ROLE[role])
    },
    [roles, router],
  )

  const activateCustomerRole = useCallback(async () => {
    try {
      await authService.addCustomer()
      await refreshUser()
      router.push('/dashboard-client')
    } catch (err) {
      console.error('[useWorkspace] Erro ao ativar perfil de cliente:', err)
      try {
        await authService.refreshToken()
        await refreshUser()
        router.push('/dashboard-client')
      } catch (refreshErr) {
        console.error('[useWorkspace] Erro ao renovar token:', refreshErr)
      }
    }
  }, [refreshUser, router])

  const activateEntrepreneurRole = useCallback(async () => {
    try {
      await authService.addEntrepreneur()
      await refreshUser()
      router.push('/minha-empresa')
    } catch (err) {
      console.error('[useWorkspace] Erro ao ativar perfil de empreendedor:', err)
      try {
        await authService.refreshToken()
        await refreshUser()
        router.push('/minha-empresa')
      } catch (refreshErr) {
        console.error('[useWorkspace] Erro ao renovar token:', refreshErr)
      }
    }
  }, [refreshUser, router])

  return { availableWorkspaces, canSwitch, switchWorkspace, activateCustomerRole, activateEntrepreneurRole }
}
