import type { ReactNode } from 'react'
import AppNavbar from '@/features/shared/components/layout/navbar'
import { MarketingFooter } from '@/features/marketing/components'
import { PageShell } from '@/design-system/layout'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell context="client" navbar={<AppNavbar context="public" />} footer={<MarketingFooter />}>
      <main className="flex-1 w-full">{children}</main>
    </PageShell>
  )
}
