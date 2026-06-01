'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/design-system/primitives/Button'
import { cn } from '@/lib/utils/cn'

const TYPES = [
  { key: 'all', label: 'Todos' },
  { key: 'products', label: 'Produtos' },
  { key: 'services', label: 'Serviços' },
] as const

const ALL_CATEGORIES = [
  { key: 'alimentacao', label: 'Alimentação' },
  { key: 'servicos', label: 'Serviços' },
  { key: 'varejo', label: 'Varejo' },
  { key: 'beleza', label: 'Beleza' },
  { key: 'educacao', label: 'Educação' },
  { key: 'saude', label: 'Saúde' },
]

const VIEW_OPTIONS = [
  { key: 'list', label: 'Lista', icon: 'ri-list-check' },
  { key: 'grid', label: 'Grade', icon: 'ri-grid-fill' },
  { key: 'map', label: 'Mapa', icon: 'ri-map-2-line' },
] as const

type TypeKey = (typeof TYPES)[number]['key']
type ViewKey = (typeof VIEW_OPTIONS)[number]['key']

export default function FiltrosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [type, setType] = useState<TypeKey>(
    (searchParams.get('type') as TypeKey | null) ?? 'all',
  )
  const initialCats = (searchParams.get('categories') ?? '')
    .split(',')
    .filter(Boolean)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCats)
  const [viewMode, setViewMode] = useState<ViewKey>(
    (searchParams.get('view') as ViewKey | null) ?? 'list',
  )

  const toggle = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )

  const handleApply = () => {
    const params = new URLSearchParams()
    if (type !== 'all') params.set('type', type)
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','))
    if (viewMode !== 'list') params.set('view', viewMode)
    const qs = params.toString()
    router.push(`/dashboard-client${qs ? `?${qs}` : ''}`)
  }

  const reset = () => {
    setType('all')
    setSelectedCategories([])
    setViewMode('list')
  }

  return (
    <div
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 6rem)' }}
    >
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Filtros</h1>
      </header>

      <section className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Tipo de Anúncio
        </span>
        <div role="radiogroup" aria-label="Tipo de anúncio" className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const active = type === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setType(t.key)}
                className={cn(
                  'h-11 rounded-full text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-page)] text-[var(--color-body)] hover:bg-[var(--color-border-default)] active:bg-[var(--color-border-default)]',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Categorias
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const checked = selectedCategories.includes(cat.key)
            return (
              <label
                key={cat.key}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 min-h-11 rounded-lg border cursor-pointer transition-colors',
                  checked
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border-default)] bg-[var(--color-surface)] hover:bg-[var(--color-page)]',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(cat.key)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm">{cat.label}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Visualização
        </span>
        <div role="radiogroup" aria-label="Modo de visualização" className="grid grid-cols-3 gap-2">
          {VIEW_OPTIONS.map((v) => {
            const active = viewMode === v.key
            return (
              <button
                key={v.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setViewMode(v.key)}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 min-h-11 rounded-lg border transition-colors text-sm',
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                    : 'border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-page)]',
                )}
              >
                <i className={`${v.icon} text-xl`} aria-hidden />
                <span>{v.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div
        className="fixed bottom-0 left-0 right-0 md:static md:mt-4 bg-[var(--color-surface)] md:bg-transparent border-t md:border-0 border-[var(--color-border-default)] p-4 md:p-0 flex gap-3 z-30"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        <Button variant="outline" fullWidth onClick={reset}>
          Limpar
        </Button>
        <Button fullWidth onClick={handleApply}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}
