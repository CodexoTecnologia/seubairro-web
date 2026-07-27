'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OrderService } from '@/lib/api/services/OrderService'
import { ChatService } from '@/lib/api/services/ChatService'
import type { PublicListingDetailResponse, OrderResponse } from '@/lib/api/dtos/Response/index'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'

type Props = {
  isOpen: boolean
  listing: PublicListingDetailResponse
  onClose: () => void
  onOrderCreated?: (order: OrderResponse) => void
}

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export function HireServiceModal({ isOpen, listing, onClose, onOrderCreated }: Props) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const unitPrice = listing.price ?? 0
  const totalPrice = unitPrice * quantity
  const primaryImage = listing.images?.find((img) => img.isCover)?.url ?? listing.images?.[0]?.url ?? null

  const handleCreateOrderAndOpenChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const createdOrder = await OrderService.create({
        shippingAddressSnapshot: 'A combinar no chat',
        items: [
          {
            listingId: listing.listingId,
            quantity,
          },
        ],
      })

      if (onOrderCreated) onOrderCreated(createdOrder)

      const conv = await ChatService.startConversation({
        businessId: listing.business.businessId,
      })

      try {
        await ChatService.sendMessage(
          conv.id,
          `📋 Ordem de Serviço #${createdOrder.id} gerada! Contratação: ${quantity}x "${listing.title}" (Total: ${formatCurrency(totalPrice, listing.currencyCode)}). Podemos combinar os detalhes por aqui.`,
        )
      } catch {
        // se a mensagem automatica falhar, redireciona assim mesmo
      }

      onClose()
      router.push(`/mensagens?conversationId=${conv.id}&orderId=${createdOrder.id}`)
    } catch (err) {
      setError(
        resolveApiErrorMessage(
          err,
          {
            CannotBuyOwnListing: 'Você não pode contratar um anúncio da sua própria empresa.',
            SameBusiness: 'Você não pode contratar um anúncio da sua própria empresa.',
            Conflict: 'Já existe um pedido idêntico em andamento ou houve um conflito.',
          },
          'Não foi possível gerar a Ordem de Serviço. Tente novamente em instantes.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <Card
        padding="lg"
        className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-2xl rounded-2xl flex flex-col gap-5"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold">
              <i className="ri-shopping-bag-3-line text-xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-title)]">
                Solicitar Ordem de Serviço
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                {listing.business.businessName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-page)] hover:text-[var(--color-title)] transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Resumo do Anúncio */}
        <div className="flex gap-3 p-3 rounded-xl bg-[var(--color-page)] border border-[var(--color-border-default)]">
          <div className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-input)] border border-[var(--color-border-default)] flex items-center justify-center">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={listing.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <i className="ri-image-line text-xl text-[var(--color-muted)]" />
            )}
          </div>
          <div className="flex flex-col justify-between min-w-0">
            <h3 className="text-sm font-bold text-[var(--color-title)] line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-xs text-[var(--color-muted)] line-clamp-1">
              {listing.business.businessName}
            </span>
            <span className="text-sm font-extrabold text-[var(--color-primary)]">
              {formatCurrency(unitPrice, listing.currencyCode)}
            </span>
          </div>
        </div>

        {/* Formulário de Quantidade */}
        <form onSubmit={handleCreateOrderAndOpenChat} className="flex flex-col gap-4">
          {/* Seletor de Quantidade */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)]">
            <span className="text-xs font-semibold text-[var(--color-title)]">
              Quantidade / Atendimentos
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="size-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-default)] font-bold text-sm text-[var(--color-title)] flex items-center justify-center hover:bg-[var(--color-page)] active:scale-95 transition-all"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm text-[var(--color-title)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="size-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-default)] font-bold text-sm text-[var(--color-title)] flex items-center justify-center hover:bg-[var(--color-page)] active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-sm">
            <span className="font-semibold text-[var(--color-title)]">Total da Ordem:</span>
            <span className="text-lg font-black text-[var(--color-primary)]">
              {formatCurrency(totalPrice, listing.currencyCode)}
            </span>
          </div>

          <p className="text-[11px] text-[var(--color-muted)] leading-tight text-center bg-[var(--color-page)] p-2.5 rounded-lg border border-[var(--color-border-default)]">
            💬 Ao gerar a Ordem de Serviço, você será redirecionado ao <strong>Chat com o vendedor</strong> para alinhar os detalhes e efetuar o pagamento.
          </p>

          {error && (
            <p role="alert" className="text-xs text-[var(--color-danger)] font-medium p-2.5 rounded-lg bg-[var(--color-danger-bg)]">
              {error}
            </p>
          )}

          {/* Botão de Ação */}
          <div className="pt-2 border-t border-[var(--color-border-default)]">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold text-sm shadow-md"
              rightIcon={<i className="ri-chat-3-line" />}
            >
              {isSubmitting ? 'Gerando e abrindo chat...' : 'Gerar Ordem & Ir para o Chat'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
