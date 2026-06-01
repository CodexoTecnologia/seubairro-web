import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  sidebar?: ReactNode
  bottomNav?: ReactNode
  children: ReactNode
  className?: string
}

export const DashboardShell = ({ sidebar, bottomNav, children, className }: Props) => (
  <div className={cn('flex flex-1 w-full', className)}>
    {sidebar && <aside className="hidden md:block shrink-0">{sidebar}</aside>}
    <main
      className={cn(
        'flex-1 min-w-0 p-4 md:p-6 md:pb-6',
        bottomNav && 'pb-[calc(env(safe-area-inset-bottom)+5rem)]',
      )}
    >
      {children}
    </main>
    {bottomNav && (
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--color-border-default)] bg-[var(--color-surface)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {bottomNav}
      </nav>
    )}
  </div>
)
