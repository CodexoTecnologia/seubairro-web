import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export const EmptyState = ({ icon, title, description, action, className }: Props) => (
  <div
    role="status"
    className={cn(
      'flex flex-col items-center justify-center text-center gap-3 py-10 px-6',
      'text-[var(--color-body)]',
      className,
    )}
  >
    {icon && (
      <div className="text-4xl text-[var(--color-muted)]" aria-hidden>
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-[var(--color-title)]">{title}</h3>
    {description && (
      <p className="text-sm max-w-prose text-[var(--color-muted)]">{description}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
