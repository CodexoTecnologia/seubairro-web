import type { ReactNode } from 'react'
import AppNavbar from '@/features/shared/components/layout/navbar'
import Footer from '@/features/shared/components/layout/footer'
import { PageShell } from '@/design-system/layout'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell context="client" navbar={<AppNavbar />} footer={<Footer />}>
      <main className="flex-1 w-full">{children}</main>
    </PageShell>
  )
}
