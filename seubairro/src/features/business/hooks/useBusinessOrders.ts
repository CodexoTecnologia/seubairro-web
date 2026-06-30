'use client'

import { useCallback, useEffect, useState } from 'react'
import { OrderService } from '@/lib/api/services/OrderService'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'

export function useBusinessOrders(businessId: string | null) {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!businessId) return
    let cancelled = false
    OrderService.getByBusiness(businessId)
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar pedidos'))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [businessId])

  const cancelOrder = useCallback(async (id: number) => {
    await OrderService.cancel(id)
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }, [])

  return { orders, isLoading, error, cancelOrder }
}
