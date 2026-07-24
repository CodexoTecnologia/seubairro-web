'use client'

import { useEffect, useState } from 'react'
import { DiscoveryService } from '@/lib/api/services/DiscoveryService'
import type { PublicListingNearbyResponse, PagedResult } from '@/lib/api/dtos/Response/index'
import type { ListingSearchRequest } from '@/lib/api/dtos/Request/index'
import type { ListingSearchFilters } from '../schemas/listing-search.schema'
import type { Coords } from '../context/LocationContext'

const PAGE_SIZE = 20

function toRequest(filters: ListingSearchFilters, coords: Coords, page: number): ListingSearchRequest {
  return {
    latitude: coords.lat,
    longitude: coords.lng,
    listingCategoryId: filters.listingCategoryId,
    nicheIds: filters.nicheIds.length ? filters.nicheIds : undefined,
    query: filters.query,
    // "Buscar todos" ignora o raio: envia SearchAll e omite MaxDistanceKm.
    maxDistanceKm: filters.searchAll ? undefined : filters.maxDistanceKm,
    searchAll: filters.searchAll || undefined,
    openNow: filters.openNow || undefined,
    page,
    pageSize: PAGE_SIZE,
  }
}

export function useListingSearch(filters: ListingSearchFilters, coords: Coords | null) {
  const [listings, setListings] = useState<PublicListingNearbyResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const filtersKey = JSON.stringify(filters)
  const lat = coords?.lat ?? null
  const lng = coords?.lng ?? null

  // Reset + primeira página quando filtros ou coords mudam.
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (lat == null || lng == null) {
        setListings([])
        setTotal(0)
        setPage(1)
        setHasNext(false)
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const res: PagedResult<PublicListingNearbyResponse> = await DiscoveryService.searchListings(
          toRequest(filters, { lat, lng }, 1),
        )
        if (cancelled) return
        setListings(res.items)
        setTotal(res.total)
        setPage(1)
        setHasNext(res.hasNext)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro na busca'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // filtersKey resume o conteúdo de `filters`; lat/lng resumem `coords`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, lat, lng])

  const loadMore = async () => {
    if (lat == null || lng == null || isLoading || !hasNext) return
    const nextPage = page + 1
    setIsLoading(true)
    try {
      const res = await DiscoveryService.searchListings(toRequest(filters, { lat, lng }, nextPage))
      setListings((prev) => [...prev, ...res.items])
      setTotal(res.total)
      setPage(nextPage)
      setHasNext(res.hasNext)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar mais'))
    } finally {
      setIsLoading(false)
    }
  }

  return { listings, total, page, isLoading, error, hasNext, loadMore }
}
