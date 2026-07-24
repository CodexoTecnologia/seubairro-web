'use client'

import { useCategoryTree } from '@/features/client/hooks/useCategoryTree'
import { useNiches } from '@/features/client/hooks/useNiches'
import { FilterChips } from '@/design-system/patterns/FilterChips'
import { Slider } from '@/design-system/primitives/Slider'
import { Switch } from '@/design-system/primitives/Switch'
import { CategoryTypeEnum } from '@/lib/api/enums/CategoryTypeEnum'
import type { ListingSearchFilters } from '@/features/client/schemas/listing-search.schema'

const DISTANCE_OPTIONS = [1, 2, 5, 10, 20] as const

type Props = {
  filters: ListingSearchFilters
  onChange: (filters: ListingSearchFilters) => void
}

const TYPE_ITEMS = [
  { value: 'all', label: 'Tudo' },
  { value: 'product', label: 'Produtos' },
  { value: 'service', label: 'Serviços' },
]

export function ListingFilters({ filters, onChange }: Props) {
  const { categories } = useCategoryTree()
  const { niches } = useNiches()

  const categoryItems = categories
    .filter((c) => c.isActive)
    .filter((c) => {
      if (filters.type === 'product') {
        return c.categoryType === CategoryTypeEnum.Produtos || c.categoryType === CategoryTypeEnum.Ambos
      }
      if (filters.type === 'service') {
        return c.categoryType === CategoryTypeEnum.Servicos || c.categoryType === CategoryTypeEnum.Ambos
      }
      return true
    })
    .map((c) => ({ value: c.id, label: c.name ?? 'Categoria' }))

  const nicheItems = niches.map((n) => ({ value: n.id, label: n.name }))
  const distanceIndex = Math.max(0, DISTANCE_OPTIONS.indexOf(filters.maxDistanceKm))

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Tipo de Anúncio</h3>
        <FilterChips
          ariaLabel="Tipo de anúncio"
          multi={false}
          items={TYPE_ITEMS}
          selected={[filters.type]}
          onChange={(sel) =>
            onChange({
              ...filters,
              type: (sel[0] as ListingSearchFilters['type']) ?? 'all',
              listingCategoryId: undefined,
            })
          }
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Categoria</h3>
        {categoryItems.length > 0 ? (
          <FilterChips
            ariaLabel="Categoria"
            multi={false}
            items={categoryItems}
            selected={filters.listingCategoryId ? [filters.listingCategoryId] : []}
            onChange={(sel) => onChange({ ...filters, listingCategoryId: sel[0] })}
          />
        ) : (
          <p className="text-xs text-[var(--color-muted)]">Nenhuma categoria disponível.</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Nichos</h3>
        {nicheItems.length > 0 ? (
          <FilterChips
            ariaLabel="Nichos"
            multi
            items={nicheItems}
            selected={filters.nicheIds}
            onChange={(sel) => onChange({ ...filters, nicheIds: sel })}
          />
        ) : (
          <p className="text-xs text-[var(--color-muted)]">Nenhum nicho disponível.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Slider
          label="Raio de Distância"
          min={0}
          max={DISTANCE_OPTIONS.length - 1}
          step={1}
          value={distanceIndex}
          disabled={filters.searchAll}
          valueFormatter={(i) => (filters.searchAll ? 'Todos' : `${DISTANCE_OPTIONS[i]} km`)}
          onChange={(i) => onChange({ ...filters, maxDistanceKm: DISTANCE_OPTIONS[i] })}
        />
        <Switch
          label="Buscar todos, sem limite de distância"
          checked={filters.searchAll}
          onChange={(v) => onChange({ ...filters, searchAll: v })}
        />
      </section>

      <section className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Aberto Agora</h3>
        <Switch
          label="Mostrar só abertos"
          checked={filters.openNow}
          onChange={(v) => onChange({ ...filters, openNow: v })}
        />
      </section>
    </div>
  )
}
