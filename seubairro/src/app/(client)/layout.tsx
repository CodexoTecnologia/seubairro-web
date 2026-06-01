'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppNavbar from '@/features/shared/components/layout/navbar'
import Footer from '@/features/shared/components/layout/footer'
import { AuthGuard } from '@/features/shared/components'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROLE_ENTREPENEUR } from '@/lib/api/helper/RoleHelper'
import { PageShell, DashboardShell } from '@/design-system/layout'
import { cn } from '@/lib/utils/cn'

const BOTTOM_NAV = [
  { href: '/dashboard-client', icon: 'ri-home-5-line', label: 'Início' },
  { href: '/busca', icon: 'ri-search-line', label: 'Buscar' },
  { href: '/favoritos', icon: 'ri-heart-3-line', label: 'Favoritos' },
  { href: '/perfil', icon: 'ri-user-line', label: 'Perfil' },
]

function ClientBottomNav() {
  const pathname = usePathname() ?? ''
  return (
    <ul className="grid grid-cols-4 h-16" role="list">
      {BOTTOM_NAV.map((it) => {
        const active = pathname.startsWith(it.href)
        return (
          <li key={it.label}>
            <Link
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'h-full flex flex-col items-center justify-center gap-0.5 text-xs transition-colors',
                active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] active:bg-[var(--color-page)]',
              )}
            >
              <i className={`${it.icon} text-xl`} aria-hidden />
              <span>{it.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </AuthGuard>
  )
}

function ClientLayoutInner({ children }: { children: ReactNode }) {
  const { roles } = useAuthContext()
  const context = roles.includes(ROLE_ENTREPENEUR) ? 'business' : 'client'

  return (
    <PageShell context={context} navbar={<AppNavbar />} footer={<Footer />}>
      <DashboardShell bottomNav={<ClientBottomNav />}>{children}</DashboardShell>
    </PageShell>
  )
}
