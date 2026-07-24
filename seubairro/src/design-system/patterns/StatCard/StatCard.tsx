import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Tone = 'neutral' | 'primary' | 'success' | 'warning'

type Props = {
  /** O que o número mede (ex.: "Pedidos pendentes"). */
  label: string
  /** Valor headline. String já formatada — o card não formata. */
  value: string
  /** Contexto curto sob o valor (ex.: "de 12 no total"). */
  hint?: string
  icon: ReactNode
  /** Tom do chip do ícone. O VALOR fica sempre em tinta de texto. */
  tone?: Tone
  className?: string
}

const ICON_TONES: Record<Tone, string> = {
  neutral: 'bg-[var(--color-page)] text-[var(--color-muted)]',
  primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]',
}

/**
 * Stat tile para KPI rows de dashboard. O valor usa tinta de título (nunca a
 * cor da série/tom) — cor fica restrita ao chip do ícone, com rótulo textual
 * sempre presente, então o estado nunca é comunicado só por cor.
 */
export function StatCard({ label, value, hint, icon, tone = 'neutral', className }: Props) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-[var(--radius-card)]',
        'bg-[var(--color-surface)] border border-[var(--color-border-default)]',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-10 shrink-0 rounded-lg flex items-center justify-center text-xl',
          ICON_TONES[tone],
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-[var(--color-muted)] truncate">{label}</span>
        <span data-numeric className="text-2xl font-bold leading-tight text-[var(--color-title)]">
          {value}
        </span>
        {hint && <span className="text-xs text-[var(--color-muted)] truncate">{hint}</span>}
      </div>
    </div>
  )
}
