'use client'

import { useEffect, useRef } from 'react'
import { useLocationContext } from '@/features/client/context/LocationContext'
import { useListingSearch } from '@/features/client/hooks/useListingSearch'
import { ListingCard } from '@/design-system/patterns/ListingCard'
import { OpenNowBadge } from '@/features/business/components/OpenNowBadge'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import type { ListingSearchFilters } from '@/features/client/schemas/listing-search.schema'

type Props = { filters: ListingSearchFilters }

export function ListingFeed({ filters }: Props) {
  const { coords } = useLocationContext()
  const { listings, isLoading, error, hasNext, loadMore } = useListingSearch(filters, coords)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef(loadMore)
  useEffect(() => {
    loadMoreRef.current = loadMore
  })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNext) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMoreRef.current()
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNext])

  if (isLoading && listings.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={240} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState title="Erro ao carregar o feed" description={error.message} retry={loadMore} />
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={<i className="ri-search-2-line" />}
        title="Nenhum resultado encontrado"
        description="Tente ampliar o raio de distância ou remover alguns filtros."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      {hasNext && (
        <div ref={sentinelRef} className="flex justify-center py-4 text-[var(--color-muted)]" aria-hidden>
          {isLoading && <i className="ri-loader-4-line animate-spin text-xl" />}
        </div>
      )}
    </div>
  )
}
