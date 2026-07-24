'use client'

import { useEffect, useState } from 'react'
import {
  BusinessService,
  type BusinessResponse,
} from '@/lib/api/services/BusinessService'
import type {
  BusinessAddressResponse,
  BusinessNicheResponse,
  BusinessOperationResponse,
} from '@/lib/api/dtos/Response/index'
import { useAuthContext } from '@/features/auth/context/AuthContext'

/**
 * Etapa de configuração ainda pendente da empresa:
 *  - `'business'`: o dono não tem nenhum negócio vinculado.
 *  - `'address'`: o negócio existe mas ainda não tem endereço cadastrado
 *    (sem endereço, os anúncios não aparecem nas buscas).
 *  - `null`: tudo pronto.
 */
export type BusinessSetupStep = 'business' | 'address' | null

type Result = {
  loading: boolean
  error: string | null
  business: BusinessResponse | null
  address: BusinessAddressResponse | null
  niches: BusinessNicheResponse[]
  operations: BusinessOperationResponse[]
  /** Primeira etapa pendente, ou `null` quando a empresa está pronta. */
  step: BusinessSetupStep
}

/**
 * Carrega a visão completa da empresa do dono logado numa só chamada e deriva
 * qual etapa de configuração ainda falta. Usado pelo dashboard para bloquear o
 * uso enquanto empresa e endereço não estiverem criados.
 */
export function useBusinessSetup(): Result {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<BusinessResponse | null>(null)
  const [address, setAddress] = useState<BusinessAddressResponse | null>(null)
  const [niches, setNiches] = useState<BusinessNicheResponse[]>([])
  const [operations, setOperations] = useState<BusinessOperationResponse[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user?.id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const overview = await BusinessService.getOwnerOverview(user.id)
        if (cancelled) return
        setBusiness(overview?.business ?? null)
        setAddress(overview?.address ?? null)
        setNiches(overview?.niches ?? [])
        setOperations(overview?.operations ?? [])
        setError(null)
      } catch (err) {
        console.error('[useBusinessSetup] Erro:', err)
        if (!cancelled) setError('Falha ao carregar os dados da empresa.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, isAuthenticated, authLoading])

  const step: BusinessSetupStep = loading
    ? null
    : !business
      ? 'business'
      : !address
        ? 'address'
        : null

  return { loading, error, business, address, niches, operations, step }
}
