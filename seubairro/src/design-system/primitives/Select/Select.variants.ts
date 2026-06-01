import { cva, type VariantProps } from 'class-variance-authority'

export const selectVariants = cva(
  [
    'block w-full rounded-lg border bg-[var(--color-input)] text-[var(--color-title)]',
    'transition-colors appearance-none',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
    'disabled:opacity-60 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-9 px-2.5 pr-8 text-base md:text-sm',
        md: 'h-11 px-3 pr-9 text-base md:text-sm',
        lg: 'h-12 px-4 pr-10 text-base',
      },
      state: {
        default: 'border-[var(--color-border-default)]',
        error: 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
      },
    },
    defaultVariants: { size: 'md', state: 'default' },
  },
)

export type SelectVariants = VariantProps<typeof selectVariants>
