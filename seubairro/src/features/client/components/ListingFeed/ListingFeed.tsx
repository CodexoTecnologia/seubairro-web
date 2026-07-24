'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocationContext } from '@/features/client/context/LocationContext'
import { useListingSearch } from '@/features/client/hooks/useListingSearch'
import { ListingsMap, type MapPoint } from '@/features/client/components/ListingsMap'
import {
  ListingViewToggle,
  type ListingView,
} from '@/features/client/components/ListingViewToggle'
import { ListingCard } from '@/design-system/patterns/ListingCard'
import { OpenNowBadge } from '@/features/business/components/OpenNowBadge'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { Button } from '@/design-system/primitives/Button'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import type { ListingSearchFilters } from '@/features/client/schemas/listing-search.schema'

type Props = {
  filters: ListingSearchFilters
  /** Quando fornecido, a visão é controlada pela página (que renderiza o toggle
      na própria barra) e a toolbar interna do feed não aparece. */
  view?: ListingView
  onResetFilters?: () => void
  onExpandDistance?: () => void
  onEnableSearchAll?: () => void
}

function formatPrice(price: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode || 'BRL',
    }).format(price)
  } catch {
    return `R$ ${price.toFixed(2)}`
  }
}

const hasValidCoords = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)

export function ListingFeed({
  filters,
  view: controlledView,
  onResetFilters,
  onExpandDistance,
  onEnableSearchAll,
}: Props) {
  const router = useRouter()
  const { coords } = useLocationContext()
  const { listings, isLoading, error, hasNext, loadMore } = useListingSearch(filters, coords)

  const [internalView, setInternalView] = useState<ListingView>('lista')
  const view = controlledView ?? internalView
  const isControlled = controlledView !== undefined

  const points: MapPoint[] = useMemo(
    () =>
      listings
        .filter((l) => hasValidCoords(l.businessLatitude, l.businessLongitude))
        .map((l) => ({
          id: l.listingId,
          lat: l.businessLatitude,
          lng: l.businessLongitude,
          title: l.title,
          priceLabel: formatPrice(l.price, l.currencyCode),
          onSelect: () => router.push(`/detalhes-anuncio?id=${l.listingId}`),
        })),
    [listings, router],
  )

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef(loadMore)
  useEffect(() => {
    loadMoreRef.current = loadMore
  })
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNext || view !== 'lista') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMoreRef.current()
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNext, view])

  const MAX_MAP_RESULTS = 300
  useEffect(() => {
    if (view !== 'mapa' || !hasNext || isLoading) return
    if (listings.length >= MAX_MAP_RESULTS) return
    loadMoreRef.current()
  }, [view, hasNext, isLoading, listings.length])

  if (error) {
    return <ErrorState title="Erro ao carregar o feed" description={error.message} retry={loadMore} />
  }

  const showSkeletons = isLoading && listings.length === 0
  const isEmpty = !isLoading && listings.length === 0

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
      {/* Toolbar interna: só quando a página não controla a visão. */}
      {!isControlled && (
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
            <i className="ri-sort-desc" aria-hidden />
            Ordenado por proximidade
          </span>
          {listings.length > 0 && <ListingViewToggle value={view} onChange={setInternalView} />}
        </div>
      )}

      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={280} className="rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        /* Empty State rico e interativo */
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-2xs gap-4 max-w-lg mx-auto my-6">
          <div className="size-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-3xl shrink-0">
            <i className="ri-search-eye-line" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-[var(--color-title)]">
              Nenhum anúncio encontrado perto de você
            </h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Não encontramos produtos ou serviços com os critérios selecionados no raio atual.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {onEnableSearchAll && (
              <Button
                type="button"
                size="sm"
                onClick={onEnableSearchAll}
                leftIcon={<i className="ri-global-line text-sm" />}
              >
                Buscar sem limite de distância
              </Button>
            )}
            {onExpandDistance && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExpandDistance}
                leftIcon={<i className="ri-map-pin-range-line text-sm" />}
              >
                Expandir raio para 20 km
              </Button>
            )}
            {onResetFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                leftIcon={<i className="ri-refresh-line text-sm" />}
              >
                Limpar busca e filtros
              </Button>
            )}
          </div>
        </div>
      ) : view === 'mapa' ? (
        <div className="h-[60vh] min-h-[400px] max-h-[640px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
          {points.length > 0 ? (
            <ListingsMap points={points} userCoords={coords} interactive />
          ) : (
            <div className="size-full flex items-center justify-center bg-[var(--color-page)] text-sm text-[var(--color-muted)] p-4 text-center">
              Os anúncios aparecem no mapa quando têm endereço cadastrado.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((item) => (
            <ListingCard
              key={item.listingId}
              title={item.title}
              price={item.price}
              thumbnailUrl={item.coverImageUrl}
              distanceMeters={item.distanceInKm * 1000}
              href={`/detalhes-anuncio?id=${item.listingId}`}
              openSlot={<OpenNowBadge slug={item.businessSlug} />}
            />
          ))}
        </div>
      )}

      {view === 'lista' && hasNext && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-4 text-[var(--color-muted)]"
          aria-hidden
        >
          {isLoading && <i className="ri-loader-4-line animate-spin text-xl" />}
        </div>
      )}
    </div>
  )
}
