'use client'

import { useEffect, useState } from 'react'
import { ListingReviewService } from '@/lib/api/services/ListingReviewService'
import type { ListingReviewResponse } from '@/lib/api/dtos/Response/index'

export function useListingReviews(listingId: string | null) {
  const [reviews, setReviews] = useState<ListingReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!listingId) return
    let cancelled = false
    ListingReviewService.getByListing(listingId)
      .then((res) => {
        if (!cancelled) setReviews(res.items)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [listingId])

  const count = reviews.length
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0

  return { reviews, isLoading, error, average, count }
}
