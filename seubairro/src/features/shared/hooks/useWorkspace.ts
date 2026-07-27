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
    } catch {
      // Perfil pode já existir: tenta renovar o token para pegar a nova role.
      try {
        await authService.refreshToken()
        await refreshUser()
        router.push('/dashboard-client')
      } catch {
        // Sem renovação o usuário permanece no perfil atual.
      }
    }
  }, [refreshUser, router])

  const activateEntrepreneurRole = useCallback(async () => {
    try {
      await authService.addEntrepreneur()
      await refreshUser()
      router.push('/minha-empresa')
    } catch {
      // Perfil pode já existir: tenta renovar o token para pegar a nova role.
      try {
        await authService.refreshToken()
        await refreshUser()
        router.push('/minha-empresa')
      } catch {
        // Sem renovação o usuário permanece no perfil atual.
      }
    }
  }, [refreshUser, router])

  return { availableWorkspaces, canSwitch, switchWorkspace, activateCustomerRole, activateEntrepreneurRole }
}
