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
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { ContactAction } from '@/design-system/patterns/ContactAction'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { BusinessMapPreview } from '@/features/business/components/BusinessMapPreview'
import { cn } from '@/lib/utils/cn'

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

type Props = {
  slug: string
  business: PublicBusinessResponse
  listings: PublicListingResponse[]
}

export default function PublicBusinessProfileView({ slug, business, listings }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<BusinessOperationStatusResponse | null>(null)

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

  // Backend é a fonte da verdade (timezone do servidor + ClosedUntil); fallback client-side
  // serve só enquanto a primeira resposta ainda não chegou.
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

  // Backend faz auto-reset implícito quando ClosedUntil passa (na leitura), então
  // confiamos no `isClosed` que veio. Status endpoint complementa quando chega.
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
    <div data-context="business" className="bg-[var(--color-page)] min-h-screen">
      {business.coverImageUrl && (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[var(--color-input)] overflow-hidden">
          <Image
            src={business.coverImageUrl}
            alt={`Capa de ${business.businessName ?? 'negócio'}`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <main className="flex flex-col gap-6">
          {showClosedBanner && (
            <div
              role="status"
              className="flex items-start gap-3 p-4 rounded-[var(--radius-card)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-bg)]"
            >
              <i className="ri-pause-circle-line text-2xl text-[var(--color-danger)] shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <strong className="text-sm text-[var(--color-danger)]">
                  Fechado temporariamente
                </strong>
                {business.closedReason && (
                  <p className="text-sm text-[var(--color-body)] whitespace-pre-line break-words">
                    {business.closedReason}
                  </p>
                )}
                {closedUntilLabel && (
                  <span className="text-xs text-[var(--color-muted)]">
                    Previsão de reabertura: <strong>{closedUntilLabel}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          <Card padding="lg" className="flex flex-col md:flex-row gap-5">
            {business.logoUrl && (
              <div className="relative size-24 rounded-full overflow-hidden ring-4 ring-[var(--color-surface)] -mt-16 shrink-0">
                <Image
                  src={business.logoUrl}
                  alt={`Logo de ${business.businessName ?? 'negócio'}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {principalNiche && (
                <span className="self-start text-xs px-2 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold">
                  {principalNiche.nicheName}
                </span>
              )}
              {business.businessName && (
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
                  {business.businessName}
                </h1>
              )}
              {business.niches && business.niches.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {business.niches
                    .filter((n) => !n.isPrincipal)
                    .map((n) => (
                      <span
                        key={n.id}
                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-page)] text-[var(--color-muted)]"
                      >
                        {n.nicheName}
                      </span>
                    ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-sm">
                {business.rating && (
                  <span className="inline-flex items-center gap-1 text-[var(--color-body)]">
                    <i className="ri-star-fill text-amber-400" />
                    <strong className="text-[var(--color-title)]">
                      {business.rating.average.toFixed(1)}
                    </strong>
                    <span className="text-[var(--color-muted)]">
                      ({business.rating.count} avaliações)
                    </span>
                  </span>
                )}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium',
                    open
                      ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                      : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      open ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]',
                    )}
                  />
                  {open ? 'Aberto agora' : 'Fechado'}
                </span>
              </div>
            </div>
          </Card>

          {business.description && (
            <Card padding="lg" className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
                Sobre
              </h2>
              <p className="text-[var(--color-body)] whitespace-pre-line">{business.description}</p>
            </Card>
          )}

          {hasCoords && (
            <Card padding="none" className="overflow-hidden">
              <div className="aspect-[2/1] w-full">
                <BusinessMapPreview
                  lat={business.address!.latitude!}
                  lng={business.address!.longitude!}
                  name={business.businessName ?? undefined}
                />
              </div>
            </Card>
          )}

          <Card padding="lg" className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
              Destaques
            </h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((l) => (
                  <article
                    key={l.id}
                    className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--color-page)] overflow-hidden"
                  >
                    {l.imageUrl && (
                      <div className="relative w-full aspect-square bg-[var(--color-input)]">
                        <Image
                          src={l.imageUrl}
                          alt={l.title ?? 'Produto'}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3 flex flex-col gap-1">
                      {l.title && (
                        <h3 className="font-medium text-[var(--color-title)] line-clamp-2">
                          {l.title}
                        </h3>
                      )}
                      <div className="text-[var(--color-primary)] font-bold">
                        R$ {l.price.toFixed(2)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<i className="ri-shopping-bag-3-line" />}
                title="Nenhum destaque disponível"
                description="Este negócio ainda não cadastrou anúncios públicos."
              />
            )}
          </Card>

          <Card padding="lg" className="flex flex-col gap-3 text-center">
            <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
              O que dizem os clientes
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Avaliações estarão disponíveis em breve.
            </p>
            <div className="flex justify-center">
              <Button
                variant="primary"
                leftIcon={<i className="ri-star-line" />}
                onClick={() => handleAuthRequired('avaliar')}
              >
                Deixar avaliação
              </Button>
            </div>
          </Card>
        </main>

        <aside className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-4">
          <Card padding="lg" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
              Falar com a loja
            </h2>
            {business.publicPhone && (
              <ContactAction
                channel="whatsapp"
                target={`55${business.publicPhone}`}
                message="Olá! Vi seu perfil no SeuBairro e gostaria de saber mais."
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
          </Card>

          {(addressLine || orderedHours.length > 0 || business.instagramUrl) && (
            <Card padding="lg" className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
                Informações
              </h2>
              {addressLine && (
                <div className="flex gap-3">
                  <i className="ri-map-pin-line text-xl text-[var(--color-primary)] shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong className="text-sm text-[var(--color-title)]">Endereço</strong>
                    <p className="text-sm text-[var(--color-body)]">{addressLine}</p>
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
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline font-medium mt-1"
                    >
                      <i className="ri-map-2-fill" />
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              )}

              {orderedHours.length > 0 && (
                <div className="flex gap-3">
                  <i className="ri-time-line text-xl text-[var(--color-primary)] shrink-0" />
                  <div className="flex flex-col gap-1 flex-1">
                    <strong className="text-sm text-[var(--color-title)]">
                      Horário de Funcionamento
                    </strong>
                    <ul className="flex flex-col gap-1 mt-1 text-sm">
                      {orderedHours.map((h) => (
                        <li
                          key={h.daysWeek}
                          className="flex items-center justify-between gap-3 text-[var(--color-body)]"
                        >
                          <span>{h.dayName || DAY_LABELS[h.daysWeek]}</span>
                          <span className="font-medium">
                            {h.openTime && h.closeTime ? `${h.openTime} – ${h.closeTime}` : 'Fechado'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {business.instagramUrl && (
                <div className="flex gap-3">
                  <i className="ri-instagram-line text-xl text-[var(--color-primary)] shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong className="text-sm text-[var(--color-title)]">Instagram</strong>
                    <a
                      href={business.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[var(--color-primary)] hover:underline truncate"
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
