'use client'

import { useEffect, useState } from 'react'
import { CategoryService } from '@/lib/api/services/CategoryService'
import type { CategoryResponse } from '@/lib/api/dtos/Response/index'

// Cache de sessão compartilhado entre montagens — categorias mudam pouco.
let cache: CategoryResponse[] | null = null

export function useCategoryTree() {
  const [categories, setCategories] = useState<CategoryResponse[]>(cache ?? [])
  const [isLoading, setIsLoading] = useState(!cache)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    CategoryService.getAll()
      .then((data) => {
        cache = data
        if (!cancelled) setCategories(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar categorias'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { categories, isLoading, error }
}
