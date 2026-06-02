'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Spinner } from '@/design-system/primitives/Spinner'

type Props = {
  children: ReactNode
  redirectTo?: string
}

export const AuthGuard = ({ children, redirectTo = '/cadastro' }: Props) => {
  const { isAuthenticated, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || '/')
      router.replace(`${redirectTo}?redirect=${redirect}`)
    }
  }, [loading, isAuthenticated, pathname, router, redirectTo])

  if (loading || !isAuthenticated) {
    return (
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
  }

  return <>{children}</>
}
