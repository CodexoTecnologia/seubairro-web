'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Modal } from '@/design-system/patterns/Modal'
import { StatusBadge } from '@/design-system/patterns/StatusBadge'
import {
  OrderStatusEnum,
  getNextOrderStatuses,
  getOrderStatusLabel,
  getOrderStatusTone,
} from '@/lib/api/enums/OrderStatusEnum'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'

/** Verbo da ação — diferente do rótulo do status resultante. */
const ACTION_LABELS: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.AwaitingPayment]: 'Aguardar pagamento',
  [OrderStatusEnum.Pending]: 'Reabrir',
  [OrderStatusEnum.Accepted]: 'Aceitar',
  [OrderStatusEnum.InProgress]: 'Iniciar preparo',
  [OrderStatusEnum.Ready]: 'Marcar como pronto',
  [OrderStatusEnum.Completed]: 'Concluir',
  [OrderStatusEnum.Rejected]: 'Recusar',
  [OrderStatusEnum.Cancelled]: 'Cancelar',
}

const ACTION_DESCRIPTIONS: Partial<Record<OrderStatusEnum, string>> = {
  [OrderStatusEnum.Accepted]: 'O cliente será avisado de que você aceitou o pedido.',
  [OrderStatusEnum.InProgress]: 'Informe ao cliente que o pedido entrou em preparo.',
  [OrderStatusEnum.Ready]: 'Avise que o pedido está pronto para retirada ou entrega.',
  [OrderStatusEnum.Completed]: 'Conclui o pedido. Esta ação não pode ser desfeita.',
  [OrderStatusEnum.Rejected]: 'Recusa o pedido. Esta ação não pode ser desfeita.',
  [OrderStatusEnum.Cancelled]: 'Cancela o pedido. Esta ação não pode ser desfeita.',
}

/** Transições em que uma justificativa ajuda o cliente a entender a decisão. */
const NEEDS_REASON: readonly OrderStatusEnum[] = [
  OrderStatusEnum.Rejected,
  OrderStatusEnum.Cancelled,
]

const DESTRUCTIVE: readonly OrderStatusEnum[] = [
  OrderStatusEnum.Rejected,
  OrderStatusEnum.Cancelled,
]

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type ActionProps = {
  order: OrderResponse
  next: OrderStatusEnum
  onConfirm: (next: OrderStatusEnum, reason?: string) => Promise<void>
}

function OrderAction({ order, next, onConfirm }: ActionProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDestructive = DESTRUCTIVE.includes(next)
  const asksReason = NEEDS_REASON.includes(next)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onConfirm(next, asksReason && reason.trim() ? reason.trim() : undefined)
      setOpen(false)
      setReason('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o pedido.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setError(null)
      }}
      trigger={
        <Button variant={isDestructive ? 'outline' : 'primary'} size="sm">
          {ACTION_LABELS[next]}
        </Button>
      }
      title={`${ACTION_LABELS[next]} o pedido #${order.id}?`}
      description={ACTION_DESCRIPTIONS[next]}
      footer={
        <>
          <Modal.Close asChild>
            <Button variant="ghost" size="sm">
              Voltar
            </Button>
          </Modal.Close>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            isLoading={isSubmitting}
            onClick={handleConfirm}
          >
            {ACTION_LABELS[next]}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {asksReason && (
          <Input
            label="Motivo (opcional)"
            hint="O cliente verá esta justificativa."
            value={reason}
            maxLength={280}
            onChange={(event) => setReason(event.target.value)}
            fullWidth
          />
        )}
        {error && (
          <p role="alert" className="text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}

type Props = {
  order: OrderResponse
  onUpdateStatus: (id: number, next: OrderStatusEnum, reason?: string) => Promise<unknown>
}

export function OrderManageCard({ order, onUpdateStatus }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const nextStatuses = getNextOrderStatuses(order.status, 'business')

  const handleConfirm = async (next: OrderStatusEnum, reason?: string) => {
    await onUpdateStatus(order.id, next, reason)
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <strong className="text-[var(--color-title)]">Pedido #{order.id}</strong>
          <StatusBadge tone={getOrderStatusTone(order.status)}>
            {getOrderStatusLabel(order.status)}
          </StatusBadge>
        </div>
        <span className="text-sm text-[var(--color-muted)]">{formatDate(order.createdAt)}</span>
      </div>

      {order.customerName && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="text-[var(--color-body)]">
            <i className="ri-user-line align-middle mr-1" aria-hidden />
            {order.customerName}
          </span>
          {order.customerPhone && (
            <a
              href={`tel:${order.customerPhone}`}
              className="text-[var(--color-primary)] hover:underline"
            >
              <i className="ri-phone-line align-middle mr-1" aria-hidden />
              {order.customerPhone}
            </a>
          )}
          {order.buyerAverageRating !== null && (
            <span className="text-[var(--color-muted)]">
              <i className="ri-star-fill align-middle mr-1 text-[var(--color-warning)]" aria-hidden />
              {order.buyerAverageRating.toFixed(1)}
              <span className="sr-only"> de nota média do comprador</span>
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]">
          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
        </span>
        <strong className="text-lg text-[var(--color-title)]">
          {formatCurrency(order.totalValue, order.currencyCode)}
        </strong>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 border-t border-[var(--color-border-default)] pt-4">
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                {item.listingImageUrl ? (
                  <Image
                    src={item.listingImageUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <span
                    className="size-10 rounded-md bg-[var(--color-page)] flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <i className="ri-image-line text-[var(--color-muted)]" />
                  </span>
                )}
                <span className="flex-1 text-[var(--color-body)]">
                  {item.quantity}× {item.listingTitle}
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
          {order.cancelReason && (
            <p className="text-xs text-[var(--color-muted)]">
              <i className="ri-information-line align-middle mr-1" aria-hidden />
              Motivo: {order.cancelReason}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Ocultar itens' : 'Ver itens'}
        </Button>
        {nextStatuses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {nextStatuses.map((next) => (
              <OrderAction key={next} order={order} next={next} onConfirm={handleConfirm} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
