'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

/**
 * Campo de busca padronizado. Não faz debounce internamente — o caller controla,
 * porque alguns contextos querem submit imediato. Enter dispara `onSubmit`,
 * Esc limpa o valor.
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar...',
  autoFocus,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit?.(value)
    } else if (e.key === 'Escape') {
      onChange('')
    }
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <i className="ri-search-line absolute left-3 text-[var(--color-muted)]" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-10 pl-10 pr-10 rounded-full bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:border-transparent"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute right-3 size-6 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-page)] hover:text-[var(--color-body)] transition-colors"
        >
          <i className="ri-close-line" aria-hidden />
        </button>
      )}
    </div>
  )
}
