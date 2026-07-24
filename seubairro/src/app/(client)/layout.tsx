import type { ReactNode } from 'react'
import AppNavbar from '@/features/shared/components/layout/navbar'
import AppFooter from '@/features/shared/components/layout/app-footer'
import { AuthGuard } from '@/features/shared/components'
import { ROLE_CUSTOMER } from '@/lib/api/helper/RoleHelper'
import { LocationProvider } from '@/features/client/context/LocationContext'
import { ClientSidebar } from '@/features/client/components/ClientSidebar'
import { ClientBottomNav } from '@/features/client/components/ClientBottomNav'
import { NavbarLocationChip } from '@/features/client/components/NavbarLocationChip'
import { PageShell, DashboardShell, ShellSkeleton } from '@/design-system/layout'
import ClientLoading from './loading'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard
      requiredRole={ROLE_CUSTOMER}
      fallback={
        <ShellSkeleton sidebar bottomNav>
          <ClientLoading />
        </ShellSkeleton>
      }
    >
      {/* Provider acima do PageShell: o chip de localização vive na navbar. */}
      <LocationProvider>
        <PageShell
          context="client"
          navbar={<AppNavbar context="client" slot={<NavbarLocationChip />} />}
          footer={<AppFooter context="client" className="hidden md:block" />}
        >
          <DashboardShell sidebar={<ClientSidebar />} bottomNav={<ClientBottomNav />}>
            {children}
          </DashboardShell>
        </PageShell>
      </LocationProvider>
    </AuthGuard>
  )
}
