import { cva, type VariantProps } from 'class-variance-authority'

export const sliderVariants = cva(
  [
    'w-full cursor-pointer rounded',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: { sm: 'h-4', md: 'h-5' },
      color: {
        primary: 'accent-[var(--color-primary)]',
        neutral: 'accent-[var(--color-muted)]',
      },
    },
    defaultVariants: { size: 'md', color: 'primary' },
  },
)

export type SliderVariants = VariantProps<typeof sliderVariants>
