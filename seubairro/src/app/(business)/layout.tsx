import type { ReactNode } from 'react'
import Link from 'next/link'
import AppNavbar from '@/features/shared/components/layout/navbar'
import AppFooter from '@/features/shared/components/layout/app-footer'
import { Button } from '@/design-system/primitives/Button'
import { BusinessSidebar } from '@/features/business/components/BusinessSidebar'
import { BusinessBottomNav } from '@/features/business/components/BusinessBottomNav'
import { AuthGuard } from '@/features/shared/components'
import { ROLE_ENTREPENEUR } from '@/lib/api/helper/RoleHelper'
import { PageShell, DashboardShell, ShellSkeleton } from '@/design-system/layout'
import BusinessLoading from './loading'

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard
      requiredRole={ROLE_ENTREPENEUR}
      fallback={
        <ShellSkeleton sidebar bottomNav>
          <BusinessLoading />
        </ShellSkeleton>
      }
    >
      <PageShell
        context="business"
        navbar={
          <AppNavbar
            context="business"
            slot={
              <Link href="/criar-anuncio" className="hidden sm:block">
                <Button size="sm" leftIcon={<i className="ri-add-line" />}>
                  Criar anúncio
                </Button>
              </Link>
            }
          />
        }
        footer={<AppFooter context="business" className="hidden md:block" />}
      >
        <DashboardShell sidebar={<BusinessSidebar />} bottomNav={<BusinessBottomNav />}>
          {children}
        </DashboardShell>
      </PageShell>
    </AuthGuard>
  )
}
