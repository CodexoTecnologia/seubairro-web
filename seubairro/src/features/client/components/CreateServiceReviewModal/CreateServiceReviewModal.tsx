'use client'

import { useState } from 'react'
import { BuyerReviewService } from '@/lib/api/services/BuyerReviewService'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

type Props = {
  isOpen: boolean
  orderId: number
  sellerBusinessName: string
  onClose: () => void
  onSuccess: () => void
}

export function CreateServiceReviewModal({
  isOpen,
  orderId,
  sellerBusinessName,
  onClose,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const activeStars = hoverRating ?? rating

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      setError('Por favor, escreva um comentário sobre o atendimento.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await BuyerReviewService.create({
        orderId,
        rating,
        comment: comment.trim(),
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error('[CreateServiceReviewModal] Erro ao criar avaliação:', err)
      setError(
        resolveApiErrorMessage(
          err,
          {
            RoleAlreadyAssigned: 'Este pedido já possui uma avaliação enviada.',
          },
          'Não foi possível enviar sua avaliação. Tente novamente em instantes.',
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
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <i className="ri-star-line text-xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-title)]">
                Avaliar Atendimento
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                Ordem de Serviço #{orderId}
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

        <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
          <p className="text-xs text-[var(--color-body)] text-center">
            Como foi a sua experiência com a empresa{' '}
            <strong className="text-[var(--color-title)]">{sellerBusinessName}</strong>?
          </p>

          {/* Seletor Interativo de Estrelas */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <i
                    className={cn(
                      starIndex <= activeStars
                        ? 'ri-star-fill text-amber-400'
                        : 'ri-star-line text-slate-300',
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600">
              {activeStars === 5 && 'Excelente! (5/5)'}
              {activeStars === 4 && 'Muito Bom! (4/5)'}
              {activeStars === 3 && 'Bom (3/5)'}
              {activeStars === 2 && 'Regular (2/5)'}
              {activeStars === 1 && 'Ruim (1/5)'}
            </span>
          </div>

          {/* Comentário */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-comment" className="text-xs font-semibold text-[var(--color-title)]">
              Seu Comentário ou Avaliação
            </label>
            <textarea
              id="review-comment"
              rows={4}
              placeholder="Conte aos vizinhos o que você achou da qualidade do serviço, pontualidade e atendimento..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-[var(--color-danger)] font-medium p-2.5 rounded-lg bg-[var(--color-danger-bg)]">
              {error}
            </p>
          )}

          {/* Botão de Envio */}
          <div className="pt-2 border-t border-[var(--color-border-default)] flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="font-bold bg-amber-500 hover:bg-amber-600 text-white"
              leftIcon={<i className="ri-send-plane-line" />}
            >
              Enviar Avaliação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
