import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  [
    'block w-full rounded-lg border bg-[var(--color-input)] text-[var(--color-title)]',
    'placeholder:text-[var(--color-muted)]',
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
    'disabled:opacity-60 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      // Mobile-first: text-base evita zoom automático do Safari iOS em campos focados (<16px).
      size: {
        sm: 'h-9 px-2.5 text-base md:text-sm',
        md: 'h-11 px-3 text-base md:text-sm',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: 'border-[var(--color-border-default)]',
        error: 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
      },
    },
    defaultVariants: { size: 'md', state: 'default' },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
