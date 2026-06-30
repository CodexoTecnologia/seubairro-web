'use client'

import { cn } from '@/lib/utils/cn'

type ChipItem = { value: string; label: string; icon?: string }

type Props = {
  items: ChipItem[]
  selected: string[]
  onChange: (selected: string[]) => void
  /** true: seleção múltipla (toggle no array). false: seleção única (substitui). */
  multi: boolean
  ariaLabel: string
  className?: string
}

export function FilterChips({ items, selected, onChange, multi, ariaLabel, className }: Props) {
  const toggle = (value: string) => {
    if (multi) {
      onChange(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
      )
    } else {
      onChange(selected.includes(value) ? [] : [value])
    }
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => {
        const isSelected = selected.includes(item.value)
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(item.value)}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              isSelected
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-body)] border border-[var(--color-border-default)] hover:bg-[var(--color-page)]',
            )}
          >
            {item.icon && <i className={item.icon} aria-hidden />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
