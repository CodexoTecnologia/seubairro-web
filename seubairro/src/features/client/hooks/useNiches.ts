'use client'

import { useEffect, useState } from 'react'
import { NicheService } from '@/lib/api/services/NicheService'
import type { NicheResponse } from '@/lib/api/dtos/Response/index'

// Cache de sessão compartilhado — nichos são lista global que muda pouco.
let cache: NicheResponse[] | null = null

export function useNiches() {
  const [niches, setNiches] = useState<NicheResponse[]>(cache ?? [])
  const [isLoading, setIsLoading] = useState(!cache)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    NicheService.getAll()
      .then((data) => {
        cache = data
        if (!cancelled) setNiches(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar nichos'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { niches, isLoading, error }
}
