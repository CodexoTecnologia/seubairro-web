import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  context?: 'business' | 'client'
  navbar?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export const PageShell = ({ context, navbar, footer, children, className }: Props) => (
  <div
    data-context={context}
    className={cn('min-h-dvh flex flex-col bg-[var(--color-page)]', className)}
  >
    {navbar}
    <div className="flex flex-1 w-full">{children}</div>
    {footer}
  </div>
)
