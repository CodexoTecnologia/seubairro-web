'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrderService } from '@/lib/api/services/OrderService'
import { ChatService } from '@/lib/api/services/ChatService'
import { OrderStatusEnum } from '@/lib/api/enums/OrderStatusEnum'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { OrderPaymentModal } from '@/features/client/components/OrderPaymentModal/OrderPaymentModal'
import { CreateServiceReviewModal } from '@/features/client/components/CreateServiceReviewModal/CreateServiceReviewModal'
import { cn } from '@/lib/utils/cn'

type FilterTab = 'all' | 'pending' | 'active' | 'completed' | 'cancelled'

const STATUS_MAP: Record<
  OrderStatusEnum,
  { label: string; tone: 'warning' | 'info' | 'success' | 'danger' | 'neutral' }
> = {
  [OrderStatusEnum.AwaitingPayment]: { label: 'Aguardando Pagamento', tone: 'warning' },
  [OrderStatusEnum.Pending]: { label: 'Pendente', tone: 'warning' },
  [OrderStatusEnum.Accepted]: { label: 'Aceito / Em Andamento', tone: 'info' },
  [OrderStatusEnum.InProgress]: { label: 'Em Atendimento', tone: 'info' },
  [OrderStatusEnum.Ready]: { label: 'Pronto para Retirada / Execução', tone: 'info' },
  [OrderStatusEnum.Completed]: { label: 'Concluído', tone: 'success' },
  [OrderStatusEnum.Rejected]: { label: 'Recusado', tone: 'danger' },
  [OrderStatusEnum.Cancelled]: { label: 'Cancelado', tone: 'danger' },
}

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function formatDate(isoString: string) {
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export default function MeusPedidosClientePage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState<OrderResponse | null>(null)
  const [reviewOrder, setReviewOrder] = useState<OrderResponse | null>(null)
  const [chatLoadingId, setChatLoadingId] = useState<number | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await OrderService.getMine({ pageSize: 50 })
      setOrders(res.items ?? [])
    } catch {
      setError('Não foi possível carregar suas Ordens de Serviço.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStartChat = async (order: OrderResponse) => {
    setChatLoadingId(order.id)
    try {
      const conv = await ChatService.startConversation({
        businessId: order.sellerBusinessId,
      })
      router.push(`/mensagens?conversationId=${conv.id}`)
    } catch {
      router.push('/mensagens')
    } finally {
      setChatLoadingId(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filterTab === 'pending') {
      return (
        order.status === OrderStatusEnum.AwaitingPayment || order.status === OrderStatusEnum.Pending
      )
    }
    if (filterTab === 'active') {
      return (
        order.status === OrderStatusEnum.Accepted ||
        order.status === OrderStatusEnum.InProgress ||
        order.status === OrderStatusEnum.Ready
      )
    }
    if (filterTab === 'completed') {
      return order.status === OrderStatusEnum.Completed
    }
    if (filterTab === 'cancelled') {
      return (
        order.status === OrderStatusEnum.Cancelled || order.status === OrderStatusEnum.Rejected
      )
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6">
      <PageHeader
        eyebrow="Histórico de Contratações"
        title="Meus Pedidos & Ordens de Serviço"
        description="Acompanhe o status das suas contratações, realize pagamentos, converse com as empresas e avalie os serviços concluídos."
      />

      {/* Navegação por Abas de Filtro */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--color-border-default)] scrollbar-none">
        {[
          { id: 'all', label: 'Todos os Pedidos', icon: 'ri-list-check' },
          { id: 'pending', label: 'Aguardando Pagamento', icon: 'ri-time-line' },
          { id: 'active', label: 'Em Andamento', icon: 'ri-loader-4-line' },
          { id: 'completed', label: 'Concluídos', icon: 'ri-checkbox-circle-line' },
          { id: 'cancelled', label: 'Cancelados', icon: 'ri-close-circle-line' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterTab(tab.id as FilterTab)}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer',
              filterTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-page)] hover:text-[var(--color-title)]',
            )}
          >
            <i className={`${tab.icon} text-sm`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={160} className="rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Falha ao carregar" description={error} />
      ) : filteredOrders.length === 0 ? (
        <Card padding="lg" className="flex flex-col items-center justify-center text-center gap-3 py-12 border-dashed border-[var(--color-border-default)]">
          <div className="size-16 rounded-full bg-[var(--color-page)] flex items-center justify-center text-[var(--color-muted)] text-3xl">
            <i className="ri-shopping-bag-line" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-bold text-[var(--color-title)]">
              Nenhuma ordem de serviço encontrada
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              {filterTab === 'all'
                ? 'Você ainda não contratou nenhum serviço ou produto nos estabelecimentos do bairro.'
                : 'Nenhum pedido encontrado com este status no momento.'}
            </p>
          </div>
          <Link href="/dashboard-client" className="mt-2">
            <Button size="sm" rightIcon={<i className="ri-search-line" />}>
              Explorar Serviços do Bairro
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? {
              label: order.status,
              tone: 'neutral',
            }

            const canPay =
              order.status === OrderStatusEnum.AwaitingPayment ||
              order.status === OrderStatusEnum.Pending
            const canReview = order.status === OrderStatusEnum.Completed

            return (
              <Card
                key={order.id}
                padding="lg"
                className="flex flex-col gap-4 shadow-2xs border border-[var(--color-border-default)] hover:border-[var(--color-primary)]/40 transition-all bg-[var(--color-surface)]"
              >
                {/* Cabeçalho do Cartão de Pedido */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-default)]">
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 rounded-xl overflow-hidden bg-[var(--color-input)] border border-[var(--color-border-default)] flex items-center justify-center shrink-0">
                      {order.sellerBusinessLogoUrl ? (
                        <Image
                          src={order.sellerBusinessLogoUrl}
                          alt={order.sellerBusinessName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <i className="ri-store-3-line text-lg text-[var(--color-primary)]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-[var(--color-title)] flex items-center gap-2">
                        <span>{order.sellerBusinessName}</span>
                        {order.sellerBusinessSlug && (
                          <Link
                            href={`/negocio/${order.sellerBusinessSlug}`}
                            className="text-[11px] font-normal text-[var(--color-primary)] hover:underline"
                          >
                            Ver Loja
                          </Link>
                        )}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)]">
                        Ordem #{order.id} &bull; {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5',
                      statusInfo.tone === 'warning' && 'bg-amber-500/10 text-amber-600',
                      statusInfo.tone === 'info' && 'bg-blue-500/10 text-blue-600',
                      statusInfo.tone === 'success' && 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
                      statusInfo.tone === 'danger' && 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
                      statusInfo.tone === 'neutral' && 'bg-[var(--color-page)] text-[var(--color-muted)]',
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        statusInfo.tone === 'warning' && 'bg-amber-500 animate-pulse',
                        statusInfo.tone === 'info' && 'bg-blue-500',
                        statusInfo.tone === 'success' && 'bg-[var(--color-success)]',
                        statusInfo.tone === 'danger' && 'bg-[var(--color-danger)]',
                        statusInfo.tone === 'neutral' && 'bg-[var(--color-muted)]',
                      )}
                    />
                    {statusInfo.label}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div className="flex flex-col gap-2">
                  {(order.items ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[var(--color-page)] border border-[var(--color-border-default)]/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-[var(--color-primary)] shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="font-semibold text-[var(--color-title)] truncate">
                          {item.listingTitle}
                        </span>
                      </div>
                      <span className="font-bold text-[var(--color-title)] shrink-0">
                        {formatCurrency(item.subTotal, order.currencyCode)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rodapé do Cartão com Ações */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-default)]">
                  <div className="flex flex-col text-xs">
                    <span className="text-[var(--color-muted)]">Valor Total:</span>
                    <span className="text-base font-extrabold text-[var(--color-primary)]">
                      {formatCurrency(order.totalValue, order.currencyCode)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Botão de Chat */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      isLoading={chatLoadingId === order.id}
                      onClick={() => handleStartChat(order)}
                      className="text-xs font-semibold"
                      leftIcon={<i className="ri-chat-3-line text-sm text-[var(--color-primary)]" />}
                    >
                      Falar no Chat
                    </Button>

                    {/* Botão de Pagamento se pendente */}
                    {canPay && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setSelectedPaymentOrder(order)}
                        className="text-xs font-bold"
                        leftIcon={<i className="ri-bank-card-line" />}
                      >
                        Pagar Agora
                      </Button>
                    )}

                    {/* Botão de Avaliação se concluído */}
                    {canReview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewOrder(order)}
                        className="text-xs font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                        leftIcon={<i className="ri-star-line text-amber-500" />}
                      >
                        Avaliar Serviço
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modais */}
      <OrderPaymentModal
        isOpen={!!selectedPaymentOrder}
        order={selectedPaymentOrder}
        onClose={() => setSelectedPaymentOrder(null)}
        onPaymentSuccess={fetchOrders}
      />

      {reviewOrder && (
        <CreateServiceReviewModal
          isOpen={!!reviewOrder}
          orderId={reviewOrder.id}
          sellerBusinessName={reviewOrder.sellerBusinessName}
          onClose={() => setReviewOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  )
}
