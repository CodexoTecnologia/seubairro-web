'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { SearchBar } from '@/design-system/patterns/SearchBar'
import { GeolocationGate } from '@/features/client/components/GeolocationGate'
import { ListingFeed } from '@/features/client/components/ListingFeed'
import { ListingFiltersDrawer } from '@/features/client/components/ListingFiltersDrawer'
import {
  ListingViewToggle,
  type ListingView,
} from '@/features/client/components/ListingViewToggle'
import {
  parseSearchParams,
  serializeFilters,
  type ListingSearchFilters,
} from '@/features/client/schemas/listing-search.schema'

export default function ClientDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<ListingView>('lista')

  const filters = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )

  const [textQuery, setTextQuery] = useState(filters.query ?? '')

  useEffect(() => {
    setTextQuery(filters.query ?? '')
  }, [filters.query])

  const activeCount = useMemo(
    () =>
      [
        filters.type !== 'all',
        Boolean(filters.listingCategoryId),
        filters.nicheIds.length > 0,
        filters.searchAll || filters.maxDistanceKm !== 5,
        filters.openNow,
      ].filter(Boolean).length,
    [filters],
  )

  const applyFilters = (next: ListingSearchFilters) => {
    const qs = serializeFilters(next).toString()
    router.replace(qs ? `/dashboard-client?${qs}` : '/dashboard-client')
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((filters.query ?? '') !== textQuery.trim()) {
        applyFilters({ ...filters, query: textQuery.trim() || undefined })
      }
    }, 350)
    return () => clearTimeout(handle)
  }, [textQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetAllFilters = () => {
    setTextQuery('')
    router.replace('/dashboard-client')
  }

  return (
    <GeolocationGate>
      <div className="flex flex-col gap-5 w-full">
        <PageHeader srOnlyTitle title="Início — anúncios perto de você" />

        {/* Barra Superior Integrada com Título, Busca e Gaveta de Filtros */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-default)] -mx-4 md:-mx-6 px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-[var(--nav-height)] z-20 shadow-xs">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[var(--color-title)] shrink-0">
              Perto de você
            </h2>

            {/* Campo de Busca Integrado */}
            <div className="flex-1 min-w-0">
              <SearchBar
                value={textQuery}
                onChange={setTextQuery}
                onSubmit={(q) => applyFilters({ ...filters, query: q.trim() || undefined })}
                placeholder="Buscar produtos, serviços ou lojas no bairro..."
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <ListingViewToggle value={view} onChange={setView} />
            <ListingFiltersDrawer filters={filters} onApply={applyFilters} activeCount={activeCount} />
          </div>
        </div>

        {/* Badges de Filtros Ativos (quando aplicados via gaveta lateral ou busca) */}
        {(filters.query ||
          filters.searchAll ||
          filters.maxDistanceKm !== 5 ||
          filters.openNow ||
          filters.type !== 'all' ||
          filters.listingCategoryId) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[var(--color-muted)] font-medium">Filtros ativos:</span>

            {filters.query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold">
                &ldquo;{filters.query}&rdquo;
                <button type="button" onClick={() => setTextQuery('')} className="hover:opacity-75">
                  <i className="ri-close-line" />
                </button>
              </span>
            )}

            {filters.searchAll && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold">
                Busca Global
                <button
                  type="button"
                  onClick={() => applyFilters({ ...filters, searchAll: false })}
                  className="hover:opacity-75"
                >
                  <i className="ri-close-line" />
                </button>
              </span>
            )}

            {filters.maxDistanceKm !== 5 && !filters.searchAll && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold">
                Raio: {filters.maxDistanceKm} km
                <button
                  type="button"
                  onClick={() => applyFilters({ ...filters, maxDistanceKm: 5 })}
                  className="hover:opacity-75"
                >
                  <i className="ri-close-line" />
                </button>
              </span>
            )}

            {filters.openNow && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-success)] font-semibold">
                Aberto Agora
                <button
                  type="button"
                  onClick={() => applyFilters({ ...filters, openNow: false })}
                  className="hover:opacity-75"
                >
                  <i className="ri-close-line" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[var(--color-primary)] hover:underline font-semibold ml-1"
            >
              Limpar todos
            </button>
          </div>
        )}

        <ListingFeed
          filters={filters}
          view={view}
          onResetFilters={resetAllFilters}
          onExpandDistance={() => applyFilters({ ...filters, maxDistanceKm: 20 })}
          onEnableSearchAll={() => applyFilters({ ...filters, searchAll: true })}
        />
      </div>
    </GeolocationGate>
  )
}
