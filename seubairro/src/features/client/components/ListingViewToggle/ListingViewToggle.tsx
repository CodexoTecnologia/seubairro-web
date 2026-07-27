'use client'

import { cn } from '@/lib/utils/cn'

export type ListingView = 'lista' | 'mapa'

type Props = {
  value: ListingView
  onChange: (view: ListingView) => void
}

const OPTIONS = [
  { key: 'lista', icon: 'ri-layout-grid-line', label: 'Lista' },
  { key: 'mapa', icon: 'ri-map-2-line', label: 'Mapa' },
] as const

export function ListingViewToggle({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Alternar visualização"
      className="inline-flex rounded-lg border border-[var(--color-border-default)] p-0.5 bg-[var(--color-surface)]"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          aria-pressed={value === opt.key}
          title={opt.label}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === opt.key
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-body)] hover:bg-[var(--color-page)]',
          )}
        >
          <i className={opt.icon} aria-hidden />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
