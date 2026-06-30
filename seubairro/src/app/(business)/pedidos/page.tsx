'use client'

import { useState } from 'react'
import { usePublicProfileLink, useBusinessOrders } from '@/features/business/hooks'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { cn } from '@/lib/utils/cn'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  pago: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  completed: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  concluido: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  cancelled: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  cancelado: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
}

function statusClass(status: string) {
  return STATUS_STYLE[status.toLowerCase()] ?? 'bg-[var(--color-page)] text-[var(--color-warning)]'
}

export default function PedidosPage() {
  const { businessId, status: profileStatus } = usePublicProfileLink()
  const { orders, isLoading, error, cancelOrder } = useBusinessOrders(businessId)

  const [expanded, setExpanded] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState<number | null>(null)

  const handleCancel = async (order: OrderResponse) => {
    if (!window.confirm(`Cancelar o pedido #${order.id}? Esta ação não pode ser desfeita.`)) return
    setCancelling(order.id)
    try {
      await cancelOrder(order.id)
    } catch (err) {
      console.error('[pedidos] cancelar falhou:', err)
      window.alert('Não foi possível cancelar o pedido. Tente novamente.')
    } finally {
      setCancelling(null)
    }
  }

  const loading = profileStatus === 'idle' || profileStatus === 'loading' || (Boolean(businessId) && isLoading)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Pedidos</h1>
        <p className="text-[var(--color-muted)] mt-1">Acompanhe e gerencie os pedidos do seu negócio.</p>
      </header>

      {profileStatus === 'error' && (
        <ErrorState title="Não foi possível identificar seu negócio" />
      )}

      {profileStatus === 'ready' && !businessId && (
        <EmptyState
          icon={<i className="ri-store-line" />}
          title="Nenhum negócio encontrado"
          description="Crie seu negócio para começar a receber pedidos."
        />
      )}

      {error && <ErrorState title="Erro ao carregar pedidos" description={error.message} />}

      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton variant="rect" height={96} />
          <Skeleton variant="rect" height={96} />
          <Skeleton variant="rect" height={96} />
        </div>
      )}

      {!loading && !error && businessId && orders.length === 0 && (
        <EmptyState
          icon={<i className="ri-inbox-line" />}
          title="Nenhum pedido por enquanto"
          description="Quando alguém comprar um anúncio seu, o pedido aparece aqui."
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id
            return (
              <li key={order.id}>
                <Card padding="lg" className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <strong className="text-[var(--color-title)]">Pedido #{order.id}</strong>
                      <span
                        className={cn(
                          'text-xs px-2 py-1 rounded-full font-semibold capitalize',
                          statusClass(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-[var(--color-muted)]">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </span>
                    <strong className="text-lg text-[var(--color-title)]">
                      {formatCurrency(order.totalValue, order.currencyCode)}
                    </strong>
                  </div>

                  {isOpen && (
                    <div className="flex flex-col gap-3 border-t border-[var(--color-border-default)] pt-4">
                      <ul className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-[var(--color-body)]">
                              {item.quantity}× anúncio{' '}
                              <span className="text-[var(--color-muted)]">{item.listingId.slice(0, 8)}…</span>
                            </span>
                            <span className="text-[var(--color-title)]">
                              {formatCurrency(item.subTotal, order.currencyCode)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {order.shippingAddressSnapshot && (
                        <p className="text-xs text-[var(--color-muted)]">
                          <i className="ri-map-pin-line align-middle mr-1" aria-hidden />
                          {order.shippingAddressSnapshot}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? 'Ocultar itens' : 'Ver itens'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={cancelling === order.id}
                      onClick={() => handleCancel(order)}
                      leftIcon={<i className="ri-close-circle-line" />}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
