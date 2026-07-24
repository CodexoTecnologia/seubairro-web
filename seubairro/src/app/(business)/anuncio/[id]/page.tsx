'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ListingService, type ListingResponse } from '@/lib/api/services/ListingService'
import { useListingQuestions, useListingReviews } from '@/features/business/hooks'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { StatusBadge } from '@/design-system/patterns/StatusBadge'
import type { ListingQuestionResponse } from '@/lib/api/dtos/Response/index'

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value)
  return (
    <span className="inline-flex items-center gap-0.5 text-[var(--color-warning)]" aria-label={`${value.toFixed(1)} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < rounded ? 'ri-star-fill' : 'ri-star-line'} aria-hidden />
      ))}
    </span>
  )
}

function QuestionItem({
  question,
  onAnswer,
}: {
  question: ListingQuestionResponse
  onAnswer: (id: string, answerText: string) => Promise<unknown>
}) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const answered = Boolean(question.answerText)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await onAnswer(question.id, text.trim())
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar resposta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <i className="ri-question-line text-lg text-[var(--color-primary)] mt-0.5" aria-hidden />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-body)]">{question.questionText}</p>
          <span className="text-xs text-[var(--color-muted)]">{formatDateTime(question.createdAt)}</span>
        </div>
      </div>

      {answered ? (
        <div className="flex items-start gap-2 pl-1 border-l-2 border-[var(--color-primary)] ml-2">
          <i className="ri-reply-line text-lg text-[var(--color-success)] mt-0.5 ml-2" aria-hidden />
          <p className="text-sm text-[var(--color-body)] flex-1">{question.answerText}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua resposta..."
            rows={2}
            maxLength={500}
            className="rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          {error && (
            <p role="alert" className="text-xs text-[var(--color-danger)]">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" size="sm" isLoading={submitting} disabled={!text.trim()}>
              Responder
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}

export default function AnuncioGestaoPage() {
  const params = useParams()
  const listingId =
    typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null

  const [listing, setListing] = useState<ListingResponse | null>(null)
  const [listingLoading, setListingLoading] = useState(true)
  const [listingError, setListingError] = useState<string | null>(null)

  useEffect(() => {
    if (!listingId) return
    let cancelled = false
    ListingService.getById(listingId)
      .then((data) => {
        if (!cancelled) setListing(data)
      })
      .catch((err) => {
        if (!cancelled) setListingError(err instanceof Error ? err.message : 'Erro ao carregar anúncio.')
      })
      .finally(() => {
        if (!cancelled) setListingLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [listingId])

  const { questions, isLoading: questionsLoading, error: questionsError, answerQuestion } =
    useListingQuestions(listingId)
  const { reviews, isLoading: reviewsLoading, error: reviewsError, average, count } =
    useListingReviews(listingId)

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <Link
        href="/listar-anuncio"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <i className="ri-arrow-left-line" aria-hidden />
        Voltar para Meus Anúncios
      </Link>

      {listingLoading && <Skeleton variant="rect" height={120} />}
      {listingError && <ErrorState title="Não foi possível carregar o anúncio" description={listingError} />}

      {listing && (
        <Card padding="lg" className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-page-title text-[var(--color-title)] text-balance">{listing.title}</h1>
            <StatusBadge tone={listing.isActive ? 'success' : 'neutral'}>
              {listing.isActive ? 'Ativo' : 'Inativo'}
            </StatusBadge>
          </div>
          <strong className="text-lg text-[var(--color-primary)]">
            {formatCurrency(listing.price, listing.currencyCode ?? 'BRL')}
          </strong>
          {listing.description && (
            <p className="text-sm text-[var(--color-muted)]">{listing.description}</p>
          )}
          <div className="flex justify-end pt-2">
            <Link href={`/anuncio/${listing.id}/editar`}>
              <Button variant="outline" size="sm" leftIcon={<i className="ri-pencil-line" />}>
                Editar anúncio
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[var(--color-title)]">Perguntas</h2>
        {questionsLoading && <Skeleton variant="rect" height={80} />}
        {questionsError && <ErrorState title="Erro ao carregar perguntas" description={questionsError.message} />}
        {!questionsLoading && !questionsError && questions.length === 0 && (
          <EmptyState
            icon={<i className="ri-chat-3-line" />}
            title="Nenhuma pergunta ainda"
            description="Quando um cliente perguntar sobre este anúncio, aparece aqui para você responder."
          />
        )}
        {questions.length > 0 && (
          <div className="flex flex-col gap-3">
            {questions.map((q) => (
              <QuestionItem key={q.id} question={q} onAnswer={answerQuestion} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-title)]">Avaliações</h2>
          {count > 0 && (
            <div className="flex items-center gap-2">
              <Stars value={average} />
              <span className="text-sm text-[var(--color-muted)]">
                {average.toFixed(1)} ({count})
              </span>
            </div>
          )}
        </div>
        {reviewsLoading && <Skeleton variant="rect" height={80} />}
        {reviewsError && <ErrorState title="Erro ao carregar avaliações" description={reviewsError.message} />}
        {!reviewsLoading && !reviewsError && reviews.length === 0 && (
          <EmptyState
            icon={<i className="ri-star-line" />}
            title="Nenhuma avaliação ainda"
            description="As avaliações dos clientes sobre este anúncio aparecem aqui."
          />
        )}
        {reviews.length > 0 && (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <Card key={r.id} padding="md" className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Stars value={r.rating} />
                  <span className="text-xs text-[var(--color-muted)]">{formatDateTime(r.createdAt)}</span>
                </div>
                {r.comment && <p className="text-sm text-[var(--color-body)]">{r.comment}</p>}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
