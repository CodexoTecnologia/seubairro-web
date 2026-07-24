'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PaymentService } from '@/lib/api/services/PaymentService'
import { OrderService } from '@/lib/api/services/OrderService'
import { PaymentMethodEnum } from '@/lib/api/enums/PaymentEnums'
import { OrderStatusEnum } from '@/lib/api/enums/OrderStatusEnum'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { Input } from '@/design-system/primitives/Input'
import { cn } from '@/lib/utils/cn'

type Props = {
  isOpen: boolean
  order: OrderResponse | null
  onClose: () => void
  onPaymentSuccess?: () => void
}

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export function OrderPaymentModal({ isOpen, order, onClose, onPaymentSuccess }: Props) {
  const router = useRouter()
  const [method, setMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.Pix)
  const [copiedPix, setCopiedPix] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paidSuccess, setPaidSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Card form values
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  if (!isOpen || !order) return null

  const mockPixCode = `00020126580014br.gov.bcb.pix0136${order.id}-seubairro-pix-key520400005303986540${order.totalValue.toFixed(2)}5802BR5925SEUBAIRRO PAGAMENTOS6009SAO PAULO62070503***6304`

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixCode)
    setCopiedPix(true)
    setTimeout(() => setCopiedPix(false), 3000)
  }

  const handleConfirmPayment = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Gera cobrança via PaymentService
      await PaymentService.create(order.id, method)

      // 2. Conclui e finaliza o pedido (OrderStatusEnum.Completed)
      try {
        await OrderService.updateStatus(order.id, OrderStatusEnum.Completed)
      } catch {
        // Se o status já transicionou ou backend fez via webhook, ok
      }

      setPaidSuccess(true)
      if (onPaymentSuccess) onPaymentSuccess()
    } catch (err) {
      console.error('[OrderPaymentModal] Erro ao processar pagamento:', err)
      setError(
        resolveApiErrorMessage(
          err,
          {},
          'Não foi possível concluir a Ordem de Pagamento. Tente novamente.',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <Card
        padding="lg"
        className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-2xl rounded-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {paidSuccess ? (
          <div className="flex flex-col items-center text-center gap-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center text-3xl font-bold shadow-xs">
              <i className="ri-checkbox-circle-fill" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-[var(--color-title)]">
                Pagamento Concluído com Sucesso!
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                Ordem de Serviço #{order.id} paga e enviada para a empresa{' '}
                <strong className="text-[var(--color-title)]">{order.sellerBusinessName}</strong>.
              </p>
            </div>

            <div className="w-full p-3 rounded-xl bg-[var(--color-page)] border border-[var(--color-border-default)] text-xs flex flex-col gap-1">
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Número da Ordem:</span>
                <span className="font-bold text-[var(--color-title)]">#{order.id}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Valor Pago:</span>
                <span className="font-bold text-[var(--color-primary)]">
                  {formatCurrency(order.totalValue, order.currencyCode)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-2 font-bold"
              onClick={() => {
                onClose()
                router.push('/meus-pedidos')
              }}
            >
              Ver Meus Pedidos & Acompanhar
            </Button>
          </div>
        ) : (
          <>
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold">
                  <i className="ri-secure-payment-line text-xl" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--color-title)]">
                    Ordem de Pagamento
                  </h2>
                  <p className="text-xs text-[var(--color-muted)]">
                    Ordem de Serviço #{order.id}
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

            {/* Resumo dos Valores */}
            <div className="p-3.5 rounded-xl bg-[var(--color-page)] border border-[var(--color-border-default)] flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[var(--color-muted)]">Vendedor:</span>
                <span className="font-bold text-[var(--color-title)]">{order.sellerBusinessName}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[var(--color-muted)]">Total a Pagar:</span>
                <span className="text-base font-extrabold text-[var(--color-primary)]">
                  {formatCurrency(order.totalValue, order.currencyCode)}
                </span>
              </div>
            </div>

            {/* Seleção do Método de Pagamento */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[var(--color-title)]">
                Forma de Pagamento
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod(PaymentMethodEnum.Pix)}
                  className={cn(
                    'p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer',
                    method === PaymentMethodEnum.Pix
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-2xs'
                      : 'border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-body)] hover:bg-[var(--color-page)]',
                  )}
                >
                  <i className="ri-qr-code-line text-base" />
                  <span>PIX (Instantâneo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod(PaymentMethodEnum.CreditCard)}
                  className={cn(
                    'p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer',
                    method === PaymentMethodEnum.CreditCard
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-2xs'
                      : 'border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-body)] hover:bg-[var(--color-page)]',
                  )}
                >
                  <i className="ri-bank-card-line text-base" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* Conteúdo Específico do Método */}
            {method === PaymentMethodEnum.Pix && (
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[var(--color-page)] border border-[var(--color-border-default)] text-center">
                <div className="size-36 bg-white p-2 rounded-xl border border-[var(--color-border-default)] shadow-xs flex items-center justify-center">
                  {/* Visual QR Code Mock */}
                  <div className="size-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white text-[9px] font-mono">
                    <div className="flex justify-between w-full">
                      <div className="size-6 bg-white rounded-xs" />
                      <div className="size-6 bg-white rounded-xs" />
                    </div>
                    <span>PIX SEUBAIRRO</span>
                    <div className="flex justify-between w-full">
                      <div className="size-6 bg-white rounded-xs" />
                      <div className="size-6 bg-emerald-400 rounded-xs" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-muted)]">
                  Escaneie o QR Code acima no app do seu banco ou copie o código abaixo.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPix}
                  className="w-full text-xs font-bold"
                  leftIcon={<i className={copiedPix ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line'} />}
                >
                  {copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix'}
                </Button>
              </div>
            )}

            {method === PaymentMethodEnum.CreditCard && (
              <div className="flex flex-col gap-3 p-3 rounded-xl bg-[var(--color-page)] border border-[var(--color-border-default)]">
                <Input
                  label="Número do Cartão"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
                <Input
                  label="Nome Impresso no Cartão"
                  placeholder="NOME SOBRENOME"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Validade (MM/AA)"
                    placeholder="12/28"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    maxLength={5}
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="text-xs text-[var(--color-danger)] font-medium p-2.5 rounded-lg bg-[var(--color-danger-bg)]">
                {error}
              </p>
            )}

            {/* Ação de Conclusão */}
            <div className="pt-2 border-t border-[var(--color-border-default)]">
              <Button
                type="button"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleConfirmPayment}
                className="w-full font-bold text-sm"
                leftIcon={<i className="ri-check-double-line" />}
              >
                {isSubmitting ? 'Confirmando Pagamento...' : 'Concluir Pagamento'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
