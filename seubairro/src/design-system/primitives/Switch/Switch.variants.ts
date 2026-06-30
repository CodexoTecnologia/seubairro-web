import { cva, type VariantProps } from 'class-variance-authority'

export const switchVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-full transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const switchThumbVariants = cva(
  ['pointer-events-none inline-block rounded-full bg-white shadow transition-transform'],
  {
    variants: {
      size: {
        sm: 'size-4 translate-x-0.5 data-[checked=true]:translate-x-[18px]',
        md: 'size-5 translate-x-0.5 data-[checked=true]:translate-x-[22px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type SwitchVariants = VariantProps<typeof switchVariants>
