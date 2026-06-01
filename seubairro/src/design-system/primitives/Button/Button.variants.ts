import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold whitespace-nowrap',
    'rounded-lg transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-[0.98] motion-safe:transition-transform',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]',
        secondary:
          'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-hover)]',
        outline:
          'bg-transparent border border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-input)] active:bg-[var(--color-border-default)]',
        ghost:
          'bg-transparent text-[var(--color-body)] hover:bg-[var(--color-input)] active:bg-[var(--color-border-default)]',
        danger:
          'bg-[var(--color-danger)] text-white hover:opacity-90 active:opacity-80',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
