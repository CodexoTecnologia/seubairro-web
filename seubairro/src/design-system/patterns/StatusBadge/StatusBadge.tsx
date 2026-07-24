import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { statusBadgeVariants, type StatusBadgeVariants } from './StatusBadge.variants'

type Props = StatusBadgeVariants & {
  /** Rótulo textual — o status nunca é comunicado só pela cor. */
  children: ReactNode
  /** Ícone opcional à esquerda do rótulo. */
  icon?: ReactNode
  className?: string
}

/**
 * Chip de status agnóstico de domínio. O mapeamento de um status de negócio
 * para o `tone` é responsabilidade de quem consome (ex.: `getOrderStatusTone`).
 */
export function StatusBadge({ children, icon, tone, className }: Props) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  )
}
