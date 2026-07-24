'use client'

import { useEffect, useState } from 'react'
import { ListingQuestionService } from '@/lib/api/services/ListingQuestionService'
import type { ListingQuestionResponse } from '@/lib/api/dtos/Response/index'

export function useListingQuestions(listingId: string | null) {
  const [questions, setQuestions] = useState<ListingQuestionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!listingId) return
    let cancelled = false
    ListingQuestionService.getByListing(listingId)
      .then((res) => {
        if (!cancelled) setQuestions(res.items)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar perguntas'))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [listingId])

  const answerQuestion = async (id: string, answerText: string) => {
    const updated = await ListingQuestionService.answer(id, { answerText })
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)))
    return updated
  }

  return { questions, isLoading, error, answerQuestion }
}
