import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva(
  ['rounded-[var(--radius-card)] bg-[var(--color-surface)] text-[var(--color-body)]'],
  {
    variants: {
      variant: {
        default: 'border border-[var(--color-border-default)]',
        elevated: 'shadow-[var(--shadow-soft)]',
        outlined: 'border border-[var(--color-border-default)] bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
      },
    },
    defaultVariants: { variant: 'default', padding: 'md' },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
