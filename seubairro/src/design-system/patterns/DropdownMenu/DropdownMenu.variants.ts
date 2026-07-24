import { cva } from 'class-variance-authority'

export const dropdownMenuContent = cva(
  [
    'z-50 min-w-[220px] p-1.5',
    'rounded-[var(--radius-card)] bg-[var(--color-surface)]',
    'border border-[var(--color-border-default)] shadow-[var(--shadow-elevated)]',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
  ].join(' '),
)

export const dropdownMenuItem = cva(
  [
    'flex items-center gap-3 w-full px-3 py-2 min-h-11',
    'rounded-lg text-sm font-medium cursor-pointer select-none outline-none',
    'transition-colors',
    'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
  ].join(' '),
  {
    variants: {
      intent: {
        default: [
          'text-[var(--color-body)]',
          'data-[highlighted]:bg-[var(--color-page)] data-[highlighted]:text-[var(--color-primary)]',
        ].join(' '),
        danger: [
          'text-[var(--color-danger)]',
          'data-[highlighted]:bg-[var(--color-danger-bg)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  },
)
