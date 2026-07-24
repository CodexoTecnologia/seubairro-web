'use client'

import { useCallback, useState } from 'react'
import { CepService, sanitizeCep } from '@/lib/api/services/CepService'
import type { CepAddress } from '@/lib/api/dtos/Response/index'

/**
 * Encapsula a consulta de CEP para os formulários de endereço: gerencia
 * `isLoading`/`error` e devolve o endereço normalizado. Ignora entradas que
 * ainda não têm 8 dígitos (retorna `null` sem tocar no estado de erro).
 */
export function useCepLookup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async (cep: string): Promise<CepAddress | null> => {
    const digits = sanitizeCep(cep)
    if (digits.length !== 8) {
      setError(null)
      return null
    }
    setIsLoading(true)
    setError(null)
    try {
      return await CepService.lookup(digits)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar o CEP.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { lookup, isLoading, error }
}
