'use client'

import { useEffect, useState } from 'react'
import { BusinessOperationService } from '@/lib/api/services/BusinessOperationService'
import type { BusinessOperationStatusResponse } from '@/lib/api/dtos/Response/business/BusinessOperationStatusResponse'

type Status = 'idle' | 'loading' | 'ready' | 'error'

type Result = {
  status: Status
  data: BusinessOperationStatusResponse | null
  isOpenNow: boolean
}

const DEFAULT_POLL_MS = 60_000

/**
 * Consulta o status "aberto agora" para o negócio autenticado.
 * Renova periodicamente para refletir abertura/fechamento sem refresh manual.
 */
export const useBusinessOpenStatus = (
  businessId: string | null | undefined,
  pollIntervalMs: number = DEFAULT_POLL_MS,
): Result => {
  const [data, setData] = useState<BusinessOperationStatusResponse | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (!businessId) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')

    const load = async () => {
      try {
        const result = await BusinessOperationService.getStatus(businessId)
        if (cancelled) return
        setData(result)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        console.error('[useBusinessOpenStatus] failed:', err)
        setStatus('error')
      }
    }

    load()
    const interval = window.setInterval(load, pollIntervalMs)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [businessId, pollIntervalMs])

  return {
    status,
    data,
    isOpenNow: data?.isOpenNow ?? false,
  }
}
