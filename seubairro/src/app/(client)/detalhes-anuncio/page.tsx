'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { DiscoveryService } from '@/lib/api/services/DiscoveryService'
import { BusinessMapPreview } from '@/features/business/components/BusinessMapPreview'
import { ContactAction } from '@/design-system/patterns/ContactAction'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { cn } from '@/lib/utils/cn'
import type { PublicListingDetailResponse } from '@/lib/api/dtos/Response/index'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

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
        if (!cancelled) setListing(data)
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
        <Skeleton variant="rect" height={320} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rect" height={120} />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <ErrorState
          title="Não foi possível carregar o anúncio"
          description={error ?? 'Anúncio não encontrado.'}
          icon={<i className="ri-error-warning-line" />}
        />
        <div className="flex justify-center mt-4">
          <Link href="/dashboard-client">
            <Button variant="outline">Voltar ao feed</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = listing.images ?? []
  const cover = images[activeImage] ?? images.find((i) => i.isCover) ?? images[0] ?? null
  const loc = listing.businessLocation
  const hasMap = !!loc && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <Link
        href="/dashboard-client"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <i className="ri-arrow-left-line" aria-hidden />
        Voltar ao feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-input)]">
            {cover ? (
              <Image
                src={cover.url}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
                <i className="ri-image-line text-4xl" aria-hidden />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === activeImage}
                  className={cn(
                    'relative size-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                    i === activeImage ? 'border-[var(--color-primary)]' : 'border-transparent',
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/negocio/${listing.business.businessSlug}`}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:underline"
              >
                {listing.business.businessName}
              </Link>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                  listing.business.isOpenNow
                    ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                    : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
                )}
              >
                {listing.business.isOpenNow ? 'Aberto' : 'Fechado'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-title)]">{listing.title}</h1>
            <strong className="text-2xl text-[var(--color-primary)]">
              {formatCurrency(listing.price, listing.currencyCode)}
            </strong>
            {listing.stockQuantity > 0 && (
              <span className="text-xs text-[var(--color-muted)]">
                {listing.stockQuantity} em estoque
              </span>
            )}
          </div>

          {/* Slot de contato — botão ou aviso, sem layout shift. */}
          <div className="min-h-11 flex items-center">
            {listing.whatsappLink ? (
              <ContactAction channel="whatsapp" href={listing.whatsappLink} fullWidth />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                <i className="ri-information-line align-middle mr-1" aria-hidden />
                Este anúncio não tem WhatsApp cadastrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {listing.description && (
        <Card padding="lg" className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            Descrição
          </h2>
          <p className="text-sm text-[var(--color-body)] whitespace-pre-line">{listing.description}</p>
        </Card>
      )}

      <Card padding="lg" className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Localização
        </h2>
        {hasMap ? (
          <div
            className="relative w-full h-64 rounded-[var(--radius-card)] overflow-hidden"
            aria-label={`Mapa mostrando a localização de ${listing.business.businessName}`}
          >
            <BusinessMapPreview lat={loc.latitude} lng={loc.longitude} name={listing.business.businessName} />
          </div>
        ) : null}
        <p className="text-sm text-[var(--color-muted)]">
          <i className="ri-map-pin-line align-middle mr-1" aria-hidden />
          {loc.neighborhood}, {loc.city}
        </p>
      </Card>
    </div>
  )
}
