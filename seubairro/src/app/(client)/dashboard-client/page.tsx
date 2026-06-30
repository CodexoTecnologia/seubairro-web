'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCategoryTree } from '@/features/client/hooks/useCategoryTree'
import { GeolocationGate } from '@/features/client/components/GeolocationGate'
import { ListingFeed } from '@/features/client/components/ListingFeed'
import {
  parseSearchParams,
  serializeFilters,
  type ListingSearchFilters,
} from '@/features/client/schemas/listing-search.schema'
import { CategoryTypeEnum } from '@/lib/api/enums/CategoryTypeEnum'
import { cn } from '@/lib/utils/cn'

const TYPES = [
  { key: 'all', label: 'Tudo' },
  { key: 'product', label: 'Produtos' },
  { key: 'service', label: 'Serviços' },
] as const

export default function ClientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )
  const { categories } = useCategoryTree()

  const update = (patch: Partial<ListingSearchFilters>) => {
    const qs = serializeFilters({ ...filters, ...patch }).toString()
    router.replace(qs ? `/dashboard-client?${qs}` : '/dashboard-client')
  }

  const visibleCategories = categories.filter((c) => {
    if (!c.isActive) return false
    if (filters.type === 'product') {
      return c.categoryType === CategoryTypeEnum.Produtos || c.categoryType === CategoryTypeEnum.Ambos
    }
    if (filters.type === 'service') {
      return c.categoryType === CategoryTypeEnum.Servicos || c.categoryType === CategoryTypeEnum.Ambos
    }
    return true
  })

  const chip = (selected: boolean) =>
    cn(
      'inline-flex shrink-0 items-center gap-1.5 h-11 px-4 rounded-full text-xs font-medium transition-colors',
      selected
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-[var(--color-page)] text-[var(--color-body)] hover:bg-[var(--color-border-default)]',
    )

  return (
    <GeolocationGate>
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-default)] -mx-4 md:-mx-6 px-4 md:px-6 py-4 flex flex-col gap-3 sticky top-[var(--nav-height)] z-20">
          <div role="tablist" aria-label="Tipo de anúncio" className="flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={filters.type === t.key}
                onClick={() => update({ type: t.key, listingCategoryId: undefined })}
                className={cn(
                  'flex-1 h-11 rounded-full text-sm font-medium transition-colors',
                  filters.type === t.key
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-page)] text-[var(--color-body)] hover:bg-[var(--color-border-default)]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tablist" aria-label="Categoria" className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            <button
              type="button"
              role="tab"
              aria-selected={!filters.listingCategoryId}
              onClick={() => update({ listingCategoryId: undefined })}
              className={chip(!filters.listingCategoryId)}
            >
              <i className="ri-apps-2-line" aria-hidden />
              Todas
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filters.listingCategoryId === c.id}
                onClick={() => update({ listingCategoryId: c.id })}
                className={chip(filters.listingCategoryId === c.id)}
              >
                {c.name}
              </button>
            ))}
            <Link
              href={`/filtros?${serializeFilters(filters).toString()}`}
              className={cn(chip(false), 'border border-[var(--color-border-default)]')}
            >
              <i className="ri-equalizer-line" aria-hidden />
              Filtros
            </Link>
          </div>
        </div>

        <section>
          <h3 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide mb-3">
            Perto de você
          </h3>
          <ListingFeed filters={filters} />
        </section>
      </div>
    </GeolocationGate>
  )
}
