'use client'

import { cn } from '@/lib/utils/cn'

type Props = {
  onClick?: () => void
  label?: string
  className?: string
}

const BackButton = ({ onClick, label = 'Voltar', className }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
      'text-sm font-medium text-[var(--color-body)]',
      'bg-[var(--color-page)] hover:bg-[var(--color-border-default)] transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
      className,
    )}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M7.82843 11L13.1924 5.63604L11.7782 4.22183L3.99999 12L11.7782 19.7782L13.1924 18.364L7.82843 13H20V11H7.82843Z" />
    </svg>
    <span>{label}</span>
  </button>
)

export default BackButton
