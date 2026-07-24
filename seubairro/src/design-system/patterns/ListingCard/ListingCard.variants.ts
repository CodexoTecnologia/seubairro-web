import { cva, type VariantProps } from 'class-variance-authority'

export const listingCardVariants = cva(
  [
    'group flex bg-[var(--color-surface)] border border-[var(--color-border-default)]',
    'rounded-[var(--radius-card)] overflow-hidden transition-shadow',
    'hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
  ],
  {
    variants: {
      layout: {
        vertical: 'flex-col',
        horizontal: 'flex-row items-stretch',
      },
      emphasis: {
        default: '',
        featured: 'ring-2 ring-[var(--color-primary)]',
      },
    },
    defaultVariants: { layout: 'vertical', emphasis: 'default' },
  },
)

export type ListingCardVariants = VariantProps<typeof listingCardVariants>
