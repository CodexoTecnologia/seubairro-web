'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { RoleHelper, type AppRole } from '@/lib/api/helper/RoleHelper'
import { Spinner } from '@/design-system/primitives/Spinner'

type Props = {
  children: ReactNode
  redirectTo?: string
  /** Role exigida pela rota; sem ela o usuário volta para o workspace que possui. */
  requiredRole?: AppRole
  /** Renderizado enquanto sessão/roles carregam (ex.: ShellSkeleton). Default: spinner. */
  fallback?: ReactNode
}

export const AuthGuard = ({
  children,
  redirectTo = '/cadastro',
  requiredRole,
  fallback,
}: Props) => {
  const { isAuthenticated, loading, roles } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  const missingRole = Boolean(requiredRole && !roles.includes(requiredRole))

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || '/')
      router.replace(`${redirectTo}?redirect=${redirect}`)
      return
    }
    if (missingRole) {
      // Token sem nenhuma role reconhecível é tratado como sessão inutilizável
      // (evita loop de redirect entre dashboards).
      router.replace(roles.length > 0 ? RoleHelper.getRedirectPath() : redirectTo)
    }
  }, [loading, isAuthenticated, missingRole, roles.length, pathname, router, redirectTo])

  if (loading || !isAuthenticated || missingRole) {
    return (
      fallback ?? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex items-center justify-center min-h-[60vh] gap-2 text-[var(--color-muted)]"
        >
          <Spinner size="sm" />
          <span>Carregando…</span>
        </div>
      )
    )
  }

  return <>{children}</>
}
