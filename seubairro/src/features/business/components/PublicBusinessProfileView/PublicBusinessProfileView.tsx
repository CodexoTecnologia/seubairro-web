'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  PublicBusinessService,
  isBusinessOpenNow,
  type PublicBusinessResponse,
  type PublicListingResponse,
} from '@/lib/api/services/PublicBusinessService'
import type { BusinessOperationStatusResponse } from '@/lib/api/dtos/Response/business/BusinessOperationStatusResponse'
import { OrderService } from '@/lib/api/services/OrderService'
import { OrderStatusEnum } from '@/lib/api/enums/OrderStatusEnum'
import { ChatService } from '@/lib/api/services/ChatService'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { ContactAction } from '@/design-system/patterns/ContactAction'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { BusinessMapPreview } from '@/features/business/components/BusinessMapPreview'
import { cn } from '@/lib/utils/cn'

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_LABELS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

type Props = {
  slug: string
  business: PublicBusinessResponse
  listings: PublicListingResponse[]
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function PublicBusinessProfileView({ slug, business, listings }: Props) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthContext()
  const [status, setStatus] = useState<BusinessOperationStatusResponse | null>(null)
  const [hasCompletedOrder, setHasCompletedOrder] = useState<boolean | null>(null)
  const [startingChat, setStartingChat] = useState(false)

  const currentDayOfWeek = new Date().getDay()

  useEffect(() => {
    let cancelled = false
    PublicBusinessService.getStatusBySlug(slug)
      .then((data) => {
        if (!cancelled) setStatus(data)
      })
      .catch((err) => {
        console.error('[PublicBusinessProfileView] status fetch failed:', err)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  // Verifica a regra de negócio: Cliente só pode mandar mensagem se tiver Ordem de Serviço / Pedido CONCLUÍDO
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !business?.id) {
      setHasCompletedOrder(false)
      return
    }

    let cancelled = false
    OrderService.getMine({ status: OrderStatusEnum.Completed })
      .then((result) => {
        if (cancelled) return
        const items = Array.isArray(result?.items) ? result.items : []
        const hasCompleted = items.some((o) => o.sellerBusinessId === business.id)
        setHasCompletedOrder(hasCompleted)
      })
      .catch((err) => {
        console.error('[PublicBusinessProfileView] Erro ao verificar ordens de serviço:', err)
        if (!cancelled) setHasCompletedOrder(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user?.id, business?.id])

  const handleStartChat = async () => {
    if (!business?.id || startingChat) return
    setStartingChat(true)
    try {
      await ChatService.startConversation({ businessId: business.id })
      router.push('/mensagens')
    } catch (err) {
      console.error('[PublicBusinessProfileView] erro ao iniciar chat:', err)
    } finally {
      setStartingChat(false)
    }
  }

  // Backend é a fonte da verdade; fallback client-side enquanto carrega
  const open = status
    ? status.isOpenNow
    : isBusinessOpenNow(business.operatingHours, business.isClosed)
  const principalNiche =
    business.niches?.find((n) => n.isPrincipal) ?? business.niches?.[0] ?? null

  const addressLine = business.address
    ? [
        business.address.street,
        business.address.number,
        business.address.complement,
        business.address.neighborhood,
        business.address.city,
        business.address.state,
      ]
        .filter(Boolean)
        .join(', ')
    : null

  const orderedHours = [...(business.operatingHours ?? [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.daysWeek) - DAY_ORDER.indexOf(b.daysWeek),
  )

  const handleAuthRequired = (action: string) => {
    router.push(`/login?redirect=/negocio/${slug}&action=${action}`)
  }

  const hasCoords = Boolean(business.address?.latitude && business.address?.longitude)

  const showClosedBanner = status ? !status.isOpenNow && business.isClosed : business.isClosed
  const closedUntilDate = business.closedUntil ? new Date(business.closedUntil) : null
  const closedUntilLabel =
    closedUntilDate && !Number.isNaN(closedUntilDate.getTime())
      ? closedUntilDate.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null

  return (
    <div data-context="business" className="bg-[var(--color-page)] min-h-screen pb-16">
      {/* Hero Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
        {/* Cover Banner */}
        <div className="relative w-full h-56 md:h-80 xl:h-96 rounded-2xl overflow-hidden bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900 shadow-md">
          {business.coverImageUrl ? (
            <Image
              src={business.coverImageUrl}
              alt={`Capa de ${business.businessName ?? 'negócio'}`}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 to-blue-600/30 flex items-center justify-center">
              <i className="ri-store-2-line text-6xl text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Profile Card Overlay */}
        <div className="relative -mt-16 md:-mt-20 z-10 mx-2 md:mx-6 p-5 md:p-7 bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-xl rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Logo Avatar */}
          <div className="relative size-24 md:size-28 rounded-2xl overflow-hidden ring-4 ring-[var(--color-surface)] shadow-lg shrink-0 bg-[var(--color-input)] flex items-center justify-center">
            {business.logoUrl ? (
              <Image
                src={business.logoUrl}
                alt={`Logo de ${business.businessName ?? 'negócio'}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <i className="ri-store-3-line text-4xl text-[var(--color-primary)]" />
            )}
          </div>

          {/* Header Info */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {principalNiche && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <i className="ri-price-tag-3-line text-xs" />
                  {principalNiche.nicheName}
                </span>
              )}
              {business.niches && business.niches.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {business.niches
                    .filter((n) => !n.isPrincipal)
                    .map((n) => (
                      <span
                        key={n.id}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-input)] text-[var(--color-muted)] font-medium"
                      >
                        {n.nicheName}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {business.businessName && (
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-title)] tracking-tight">
                {business.businessName}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
              {/* Rating */}
              {business.rating ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-700 font-medium text-xs md:text-sm">
                  <i className="ri-star-fill text-amber-500 text-base" />
                  <strong className="text-[var(--color-title)] font-bold">
                    {business.rating.average.toFixed(1)}
                  </strong>
                  <span className="text-[var(--color-muted)] font-normal">
                    ({business.rating.count} avaliações)
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
                  <i className="ri-star-line text-amber-400" /> Sem avaliações ainda
                </span>
              )}

              {/* Status Badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold transition-all',
                  open
                    ? 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)] border border-[var(--color-success)]/20 shadow-xs'
                    : 'bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)] border border-[var(--color-danger)]/20',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    open ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]',
                  )}
                />
                {open ? 'Aberto Agora' : 'Fechado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <main className="flex flex-col gap-6">
          {/* Banner de Fechamento Temporário */}
          {showClosedBanner && (
            <div
              role="status"
              className="flex items-start gap-3.5 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 shadow-xs"
            >
              <i className="ri-alarm-warning-line text-2xl text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 min-w-0">
                <strong className="text-sm font-semibold text-amber-900">
                  Estabelecimento Fechado Temporariamente
                </strong>
                {business.closedReason && (
                  <p className="text-sm text-[var(--color-body)] whitespace-pre-line break-words">
                    {business.closedReason}
                  </p>
                )}
                {closedUntilLabel && (
                  <span className="text-xs font-medium text-amber-800/80 mt-1">
                    Previsão de reabertura: <strong>{closedUntilLabel}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Card: Sobre o Negócio */}
          {business.description && (
            <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <i className="ri-information-line text-lg" />
                </div>
                <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                  Sobre o Estabelecimento
                </h2>
              </div>
              <p className="text-[var(--color-body)] leading-relaxed text-sm md:text-base whitespace-pre-line">
                {business.description}
              </p>
            </Card>
          )}

          {/* Card: Destaques & Anúncios */}
          <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <i className="ri-shopping-bag-3-line text-lg" />
                </div>
                <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                  Produtos & Destaques
                </h2>
              </div>
              {listings.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-input)] text-[var(--color-muted)]">
                  {listings.length} {listings.length === 1 ? 'item' : 'itens'}
                </span>
              )}
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((l) => (
                  <article
                    key={l.id}
                    className="group relative flex flex-col rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-[var(--duration-base)]"
                  >
                    <div className="relative w-full aspect-square bg-[var(--color-input)] overflow-hidden">
                      {l.imageUrl ? (
                        <Image
                          src={l.imageUrl}
                          alt={l.title ?? 'Produto'}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
                          <i className="ri-image-line text-3xl" />
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                      {l.title && (
                        <h3 className="font-semibold text-sm text-[var(--color-title)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                          {l.title}
                        </h3>
                      )}
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="text-base font-extrabold text-[var(--color-primary)]">
                          {formatPrice(l.price)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<i className="ri-shopping-bag-3-line text-3xl" />}
                title="Nenhum produto em destaque"
                description="Este estabelecimento ainda não publicou anúncios no catálogo público."
              />
            )}
          </Card>

          {/* Card: Localização e Mapa */}
          {hasCoords && (
            <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <i className="ri-map-pin-line text-lg" />
                </div>
                <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                  Localização no Mapa
                </h2>
              </div>
              <div className="rounded-xl overflow-hidden border border-[var(--color-border-default)] shadow-xs">
                <div className="aspect-[2/1] w-full">
                  <BusinessMapPreview
                    lat={business.address!.latitude!}
                    lng={business.address!.longitude!}
                    name={business.businessName ?? undefined}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Card: Avaliações */}
          <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)] text-center">
            <div className="flex items-center justify-center gap-2 border-b border-[var(--color-border-default)] pb-3">
              <i className="ri-star-smile-line text-xl text-amber-500" />
              <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                Avaliações dos Clientes
              </h2>
            </div>
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="flex items-center gap-1 text-2xl text-amber-400">
                <i className="ri-star-fill" />
                <i className="ri-star-fill" />
                <i className="ri-star-fill" />
                <i className="ri-star-fill" />
                <i className="ri-star-half-fill" />
              </div>
              <p className="text-sm text-[var(--color-muted)] max-w-md">
                As opiniões e notas detalhadas de clientes que já compraram aqui estarão disponíveis em breve.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                leftIcon={<i className="ri-star-line" />}
                onClick={() => handleAuthRequired('avaliar')}
              >
                Deixar uma Avaliação
              </Button>
            </div>
          </Card>
        </main>

        {/* Sidebar Lateral */}
        <aside className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">
          {/* Card: Falar com a Loja */}
          <Card padding="lg" className="flex flex-col gap-4 shadow-md border-[var(--color-border-default)]">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
              <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <i className="ri-message-3-line text-lg" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                Falar com o Negócio
              </h2>
            </div>

            {/* Regra do Chat com Ordem Concluída */}
            {isAuthenticated ? (
              hasCompletedOrder ? (
                <Button
                  type="button"
                  onClick={handleStartChat}
                  isLoading={startingChat}
                  className="w-full shadow-primary py-3 font-bold"
                  leftIcon={<i className="ri-chat-1-line text-lg" />}
                >
                  Enviar Mensagem Direta
                </Button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <i className="ri-lock-2-line text-[var(--color-primary)] text-sm" /> Chat Restrito
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O envio de mensagens fica disponível após concluir um pedido ou ordem de serviço com este estabelecimento.
                  </p>
                </div>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAuthRequired('mensagem')}
                className="w-full"
                leftIcon={<i className="ri-user-shared-line" />}
              >
                Entrar para Enviar Mensagem
              </Button>
            )}

            {/* Outros Canais de Contato */}
            <div className="flex flex-col gap-2.5 pt-1">
              {business.publicPhone && (
                <ContactAction
                  channel="whatsapp"
                  target={`55${business.publicPhone}`}
                  message="Olá! Vi seu perfil no SeuBairro e gostaria de tirar uma dúvida."
                  fullWidth
                />
              )}
              {business.publicPhone && (
                <ContactAction channel="phone" target={`55${business.publicPhone}`} fullWidth />
              )}
              <ContactAction
                channel="share"
                target={typeof window !== 'undefined' ? window.location.href : `/negocio/${slug}`}
                fullWidth
              />
            </div>
          </Card>

          {/* Card: Informações & Horários */}
          {(addressLine || orderedHours.length > 0 || business.instagramUrl) && (
            <Card padding="lg" className="flex flex-col gap-5 shadow-sm border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <i className="ri-[var(--color-primary)] ri-information-fill text-lg" />
                </div>
                <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                  Informações Úteis
                </h2>
              </div>

              {/* Endereço */}
              {addressLine && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-[var(--color-input)] flex items-center justify-center text-[var(--color-primary)] shrink-0 mt-0.5">
                    <i className="ri-map-pin-2-fill text-base" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong className="text-xs font-bold text-[var(--color-title)] uppercase tracking-wide">
                      Endereço
                    </strong>
                    <p className="text-sm text-[var(--color-body)] leading-snug">{addressLine}</p>
                    {business.address?.zipCode && (
                      <span className="text-xs text-[var(--color-muted)]">
                        CEP: {business.address.zipCode}
                      </span>
                    )}
                    <a
                      href={
                        hasCoords
                          ? `https://www.google.com/maps?q=${business.address!.latitude},${business.address!.longitude}`
                          : `https://www.google.com/maps/search/${encodeURIComponent(addressLine)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-semibold mt-1"
                    >
                      <i className="ri-external-link-line" />
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* Horários */}
              {orderedHours.length > 0 && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-[var(--color-input)] flex items-center justify-center text-[var(--color-primary)] shrink-0 mt-0.5">
                    <i className="ri-time-fill text-base" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <strong className="text-xs font-bold text-[var(--color-title)] uppercase tracking-wide">
                      Horário de Funcionamento
                    </strong>
                    <ul className="flex flex-col gap-1 text-xs">
                      {orderedHours.map((h) => {
                        const isToday = h.daysWeek === currentDayOfWeek
                        return (
                          <li
                            key={h.daysWeek}
                            className={cn(
                              'flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors',
                              isToday
                                ? 'bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                                : 'text-[var(--color-body)]',
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {h.dayName || DAY_LABELS[h.daysWeek]}
                              {isToday && (
                                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-[var(--color-primary)] text-white ml-1">
                                  Hoje
                                </span>
                              )}
                            </span>
                            <span className="font-semibold text-right">
                              {h.openTime && h.closeTime
                                ? `${h.openTime} – ${h.closeTime}`
                                : 'Fechado'}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )}

              {/* Instagram */}
              {business.instagramUrl && (
                <div className="flex gap-3 pt-1 border-t border-[var(--color-border-default)]">
                  <div className="size-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 shrink-0">
                    <i className="ri-instagram-line text-lg" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <strong className="text-xs font-bold text-[var(--color-title)] uppercase tracking-wide">
                      Instagram
                    </strong>
                    <a
                      href={business.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-pink-600 hover:underline truncate"
                    >
                      {business.instagramUrl
                        .replace('https://instagram.com/', '@')
                        .replace('https://www.instagram.com/', '@')}
                    </a>
                  </div>
                </div>
              )}
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

