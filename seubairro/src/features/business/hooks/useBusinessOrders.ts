'use client'

import { useCallback, useEffect, useState } from 'react'
import { OrderService } from '@/lib/api/services/OrderService'
import { OrderStatusEnum } from '@/lib/api/enums/OrderStatusEnum'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'

const PAGE_SIZE = 50

type Loaded = { key: string; orders: OrderResponse[] }
type Failed = { key: string; error: Error }

export function useBusinessOrders(businessId: string | null, status?: OrderStatusEnum) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failed, setFailed] = useState<Failed | null>(null)

  // A chave identifica a requisição atual (negócio + filtro). Carregamento e erro
  // são derivados dela, evitando setState síncrono no corpo do efeito e mantendo
  // o skeleton a cada troca de filtro.
  const requestKey = businessId ? `${businessId}:${status ?? 'all'}` : null

  useEffect(() => {
    if (!businessId || !requestKey) return
    let cancelled = false
    OrderService.getByBusiness(businessId, { status, pageSize: PAGE_SIZE })
      .then((page) => {
        if (!cancelled) setLoaded({ key: requestKey, orders: page.items })
      })
      .catch((err) => {
        if (cancelled) return
        setFailed({
          key: requestKey,
          error: err instanceof Error ? err : new Error('Erro ao carregar pedidos'),
        })
      })
    return () => {
      cancelled = true
    }
  }, [businessId, status, requestKey])

  const orders = loaded?.key === requestKey ? loaded.orders : []
  const error = failed?.key === requestKey ? failed.error : null
  const isLoading = requestKey !== null && loaded?.key !== requestKey && !error

  /**
   * A transição é validada no servidor; o pedido atualizado volta na resposta e
   * substitui o item na lista (nunca some — cancelado continua visível).
   */
  const updateStatus = useCallback(
    async (id: number, next: OrderStatusEnum, reason?: string) => {
      const updated = await OrderService.updateStatus(id, next, reason)
      setLoaded((previous) =>
        previous
          ? {
              ...previous,
              orders: previous.orders.map((order) => (order.id === updated.id ? updated : order)),
            }
          : previous,
      )
      return updated
    },
    [],
  )

  const cancelOrder = useCallback(
    (id: number, reason?: string) => updateStatus(id, OrderStatusEnum.Cancelled, reason),
    [updateStatus],
  )

  return { orders, isLoading, error, updateStatus, cancelOrder }
}
