'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { DiscoveryService } from '@/lib/api/services/DiscoveryService'
import { PublicBusinessService, isBusinessOpenNow, type PublicBusinessResponse } from '@/lib/api/services/PublicBusinessService'
import { BusinessMapPreview } from '@/features/business/components/BusinessMapPreview'
import { ContactAction } from '@/design-system/patterns/ContactAction'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { cn } from '@/lib/utils/cn'
import type { PublicListingDetailResponse } from '@/lib/api/dtos/Response/index'
import { ChatService } from '@/lib/api/services/ChatService'
import { HireServiceModal } from '@/features/client/components/HireServiceModal/HireServiceModal'

const DAY_LABELS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export default function AnuncioDetalhesPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [listing, setListing] = useState<PublicListingDetailResponse | null>(null)
  const [businessData, setBusinessData] = useState<PublicBusinessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  const currentDayOfWeek = new Date().getDay()

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!id) {
        setError('Anúncio não informado.')
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const data = await DiscoveryService.getListingDetail(id)
        if (cancelled) return
        setListing(data)

        if (data?.business?.businessSlug) {
          PublicBusinessService.getBySlug(data.business.businessSlug)
            .then((bData) => {
              if (!cancelled) setBusinessData(bData)
            })
            .catch(() => {
              // Perfil completo é complementar: a página funciona sem ele.
            })
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar o anúncio.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

  const router = useRouter()
  const [isHireModalOpen, setIsHireModalOpen] = useState(false)
  const [isChatStarting, setIsChatStarting] = useState(false)

  const handleStartChatDirect = async () => {
    if (!listing?.business?.businessId) return
    setIsChatStarting(true)
    try {
      const conv = await ChatService.startConversation({
        businessId: listing.business.businessId,
      })
      router.push(`/mensagens?conversationId=${conv.id}`)
    } catch {
      router.push('/mensagens')
    } finally {
      setIsChatStarting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full px-4 py-6">
        <Skeleton variant="text" width="140px" height={24} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-4">
            <Skeleton variant="rect" height={360} className="rounded-2xl" />
            <Skeleton variant="text" width="80%" height={36} />
            <Skeleton variant="rect" height={100} className="rounded-xl" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton variant="rect" height={320} className="rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <ErrorState
          title="Não foi possível carregar o anúncio"
          description={error ?? 'Anúncio não encontrado ou indisponível.'}
          icon={<i className="ri-error-warning-line text-4xl" />}
        />
        <div className="flex justify-center mt-6">
          <Link href="/dashboard-client">
            <Button variant="outline" leftIcon={<i className="ri-arrow-left-line" />}>
              Voltar ao feed
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const rawImages = listing.images ?? []
  const images = rawImages.map((img) => ({
    ...img,
    url: (img.imageUrl ?? img.url)!,
  }))
  const cover = images[activeImage] ?? images.find((i) => i.isCover) ?? images[0] ?? null
  const loc = listing.businessLocation
  const hasMap = !!loc && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)

  const todayHours = businessData?.operatingHours?.find((h) => h.daysWeek === currentDayOfWeek)
  const todayHoursLabel = todayHours
    ? todayHours.openTime && todayHours.closeTime
      ? `${todayHours.openTime} – ${todayHours.closeTime}`
      : 'Fechado hoje'
    : null

  const principalNiche = businessData?.niches?.find((n) => n.isPrincipal) ?? businessData?.niches?.[0] ?? null
  const isOpenNow = businessData ? isBusinessOpenNow(businessData.operatingHours ?? [], businessData.isClosed) : false
  const whatsappUrl = listing.whatsappLink ?? null

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
      {/* Voltar ao feed */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard-client"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline group"
        >
          <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1" aria-hidden />
          Voltar para Anúncios
        </Link>
      </div>

      {/* Seção Superior (Hero): Foto + Informações do Produto & Vendedor Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
        {/* Coluna Esquerda: Galeria de Fotos */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="relative w-full aspect-[16/10] max-h-[480px] rounded-2xl overflow-hidden bg-[var(--color-input)] border border-[var(--color-border-default)] shadow-sm">
            {cover?.url?.trim() ? (
              <Image
                src={cover.url.trim()}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
                <i className="ri-image-line text-5xl" aria-hidden />
              </div>
            )}
          </div>

          {/* Miniaturas das fotos */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => {
                const imgUrl = img.url?.trim() ? img.url.trim() : null
                if (!imgUrl) return null
                return (
                  <button
                    key={img.url ?? i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Ver imagem ${i + 1}`}
                    aria-current={i === activeImage}
                    className={cn(
                      'relative size-16 md:size-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                      i === activeImage
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <Image src={imgUrl} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Coluna Direita: Título, Preço, Contato & Card do Anunciante */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Card Principal: Título, Preço e Contato Direct */}
          <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                {principalNiche && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <i className="ri-price-tag-3-line text-xs" />
                    {principalNiche.nicheName}
                  </span>
                )}
                {businessData && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold',
                      isOpenNow
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)]'
                        : 'bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]',
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        isOpenNow ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]',
                      )}
                    />
                    {isOpenNow ? 'Aberto Agora' : 'Fechado'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-title)] tracking-tight">
                {listing.title}
              </h1>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[var(--color-primary)] tracking-tight">
                  {formatCurrency(listing.price, listing.currencyCode)}
                </span>
                {listing.type === 'product' && (
                  <span className="text-xs text-[var(--color-muted)] font-medium">
                    {listing.stockQuantity > 0 ? `${listing.stockQuantity} em estoque` : 'Sem estoque'}
                  </span>
                )}
              </div>
            </div>

            {/* Ações Principais: Contratar, Chat e WhatsApp */}
            <div className="flex flex-col gap-2.5 w-full">
              <Button
                size="lg"
                onClick={() => setIsHireModalOpen(true)}
                className="w-full font-bold shadow-md text-base"
                leftIcon={<i className="ri-shopping-bag-3-line text-xl" />}
              >
                Contratar Serviço / Pedido
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="md"
                  isLoading={isChatStarting}
                  onClick={handleStartChatDirect}
                  className="w-full font-semibold text-xs"
                  leftIcon={<i className="ri-chat-3-line text-lg text-[var(--color-primary)]" />}
                >
                  Falar no Chat
                </Button>

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full font-semibold text-xs text-[var(--color-whatsapp)] border-[var(--color-whatsapp)]/30 hover:bg-[var(--color-whatsapp)]/10"
                      leftIcon={<i className="ri-whatsapp-line text-lg" />}
                    >
                      WhatsApp
                    </Button>
                  </a>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Card do Anunciante / Perfil da Loja */}
          <Card padding="none" className="overflow-hidden shadow-sm border-[var(--color-border-default)] flex flex-col">
            {/* Banner da Empresa */}
            <div className="relative w-full h-24 bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900">
              {businessData?.coverImageUrl?.trim() ? (
                <Image
                  src={businessData.coverImageUrl.trim()}
                  alt={`Capa de ${listing.business.businessName}`}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 to-blue-600/30 flex items-center justify-center">
                  <i className="ri-store-2-line text-3xl text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <span className="absolute top-2 right-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Anunciante
              </span>
            </div>

            {/* Conteúdo do Card do Vendedor */}
            <div className="p-4 flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                {/* Avatar / Logo */}
                <div className="relative size-14 rounded-xl overflow-hidden ring-4 ring-[var(--color-surface)] shadow-sm shrink-0 -mt-10 bg-[var(--color-input)] flex items-center justify-center">
                  {(businessData?.logoUrl || listing.business.businessLogoUrl)?.trim() ? (
                    <Image
                      src={(businessData?.logoUrl ?? listing.business.businessLogoUrl!).trim()}
                      alt={listing.business.businessName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <i className="ri-store-3-line text-xl text-[var(--color-primary)]" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-bold text-[var(--color-title)] truncate leading-tight">
                    {listing.business.businessName}
                  </h2>
                  {principalNiche && (
                    <span className="text-[11px] font-medium text-[var(--color-muted)] truncate">
                      {principalNiche.nicheName}
                    </span>
                  )}
                </div>
              </div>

              {/* Status e Avaliações */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-default)] text-xs">
                {businessData?.rating ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <i className="ri-star-fill text-amber-500 text-xs" />
                    {businessData.rating.average.toFixed(1)}
                    <span className="text-[var(--color-muted)] font-normal">
                      ({businessData.rating.count})
                    </span>
                  </span>
                ) : (
                  <span className="text-[var(--color-muted)] flex items-center gap-1 text-[11px]">
                    <i className="ri-star-line text-amber-400" /> Sem avaliações
                  </span>
                )}

                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px]',
                    listing.business.isOpenNow
                      ? 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)]'
                      : 'bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      listing.business.isOpenNow ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]',
                    )}
                  />
                  {listing.business.isOpenNow ? 'Aberto Agora' : 'Fechado'}
                </span>
              </div>

              {/* Horário de Hoje */}
              {todayHoursLabel && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-body)] bg-[var(--color-input)] px-3 py-2 rounded-lg">
                  <i className="ri-time-line text-[var(--color-primary)]" />
                  <span>
                    <strong>Hoje:</strong> {todayHoursLabel}
                  </span>
                </div>
              )}

              {/* CTA Ver Perfil Completo */}
              <Link href={`/negocio/${listing.business.businessSlug}`} className="w-full mt-1">
                <Button
                  variant="outline"
                  className="w-full font-bold text-xs py-2"
                  rightIcon={<i className="ri-arrow-right-line" />}
                >
                  Ver Perfil Completo da Loja
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Seção Inferior: Descrição & Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-2">
        {/* Descrição do Anúncio */}
        {listing.description && (
          <Card padding="lg" className="flex flex-col gap-3 shadow-sm border-[var(--color-border-default)] h-full">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
              <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <i className="ri-file-text-line text-lg" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                Descrição do Anúncio
              </h2>
            </div>
            <p className="text-[var(--color-body)] leading-relaxed text-sm md:text-base whitespace-pre-line">
              {listing.description}
            </p>
          </Card>
        )}

        {/* Mapa de Localização */}
        {hasMap && (
          <Card padding="lg" className="flex flex-col gap-4 shadow-sm border-[var(--color-border-default)] h-full">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
              <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <i className="ri-map-pin-line text-lg" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                Localização do Anúncio
              </h2>
            </div>
            <div className="rounded-xl overflow-hidden border border-[var(--color-border-default)] shadow-xs">
              <div className="aspect-[2/1] w-full">
                <BusinessMapPreview
                  lat={loc.latitude}
                  lng={loc.longitude}
                  name={listing.business.businessName}
                />
              </div>
            </div>
            <p className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
              <i className="ri-map-pin-fill text-[var(--color-primary)] text-sm" />
              {loc.neighborhood}, {loc.city}
            </p>
          </Card>
        )}
      </div>

      {/* Modal de Solicitação de Ordem de Serviço */}
      <HireServiceModal
        isOpen={isHireModalOpen}
        listing={listing}
        onClose={() => setIsHireModalOpen(false)}
      />
    </div>
  )
}


