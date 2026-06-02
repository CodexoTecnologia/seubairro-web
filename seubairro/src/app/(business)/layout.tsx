'use client'

import type { ReactNode } from 'react'
import AppNavbar from '@/features/shared/components/layout/navbar'
import Footer from '@/features/shared/components/layout/footer'
import { BusinessSidebar } from '@/features/shared/components/layout/sidebar'
import { AuthGuard } from '@/features/shared/components'
import { PageShell, DashboardShell } from '@/design-system/layout'

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <PageShell context="business" navbar={<AppNavbar />} footer={<Footer />}>
        <DashboardShell sidebar={<BusinessSidebar />}>{children}</DashboardShell>
      </PageShell>
    </AuthGuard>
  )
}
