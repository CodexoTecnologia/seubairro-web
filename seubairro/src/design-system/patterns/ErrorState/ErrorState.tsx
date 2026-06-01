import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/design-system/primitives/Button'

type Props = {
  icon?: ReactNode
  title?: string
  description?: string
  retry?: () => void
  retryLabel?: string
  className?: string
}

export const ErrorState = ({
  icon,
  title = 'Algo deu errado',
  description = 'Tente novamente em alguns instantes.',
  retry,
  retryLabel = 'Tentar novamente',
  className,
}: Props) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col items-center justify-center text-center gap-3 py-10 px-6',
      className,
    )}
  >
    <div className="text-4xl text-[var(--color-danger)]" aria-hidden>
      {icon ?? <i className="ri-error-warning-line" />}
    </div>
    <h3 className="text-base font-semibold text-[var(--color-title)]">{title}</h3>
    <p className="text-sm max-w-prose text-[var(--color-muted)]">{description}</p>
    {retry && (
      <Button variant="outline" size="sm" onClick={retry}>
        {retryLabel}
      </Button>
    )}
  </div>
)
