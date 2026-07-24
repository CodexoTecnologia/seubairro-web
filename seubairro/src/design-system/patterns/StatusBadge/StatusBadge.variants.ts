import { cva, type VariantProps } from 'class-variance-authority'

export const statusBadgeVariants = cva(
  [
    'inline-flex items-center gap-1.5 shrink-0',
    'rounded-full px-2.5 py-1',
    'text-xs font-semibold leading-none',
  ],
  {
    variants: {
      // Texto sempre no tom `-fg`: o tom sólido sobre o tint reprova o contraste
      // mínimo para o texto pequeno do chip.
      tone: {
        neutral: 'bg-[var(--color-page)] text-[var(--color-muted)]',
        info: 'bg-[var(--color-info-bg)] text-[var(--color-info-fg)]',
        warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]',
        success: 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)]',
        danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type StatusBadgeVariants = VariantProps<typeof statusBadgeVariants>
