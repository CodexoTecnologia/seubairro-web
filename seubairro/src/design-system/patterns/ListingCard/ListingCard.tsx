import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { DistanceBadge } from '@/design-system/patterns/DistanceBadge'
import { cn } from '@/lib/utils/cn'
import { listingCardVariants, type ListingCardVariants } from './ListingCard.variants'

type Props = ListingCardVariants & {
  title: string
  price: number
  categoryName?: string
  thumbnailUrl: string | null
  distanceMeters: number
  /** Injeção do badge "Aberto agora" pelo caller (preserva a regra de camadas). */
  openSlot?: ReactNode
  href: string
  /** Tipo do anúncio. Parte do contrato; reservado para uso visual futuro. */
  type?: 'product' | 'service'
  className?: string
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function ListingCard({
  title,
  price,
  categoryName,
  thumbnailUrl,
  distanceMeters,
  openSlot,
  href,
  layout,
  emphasis,
  className,
}: Props) {
  const horizontal = layout === 'horizontal'

  return (
    <Link href={href} className={cn(listingCardVariants({ layout, emphasis }), className)}>
      <div
        className={cn(
          'relative bg-[var(--color-input)] shrink-0',
          horizontal ? 'w-28 aspect-square' : 'w-full aspect-[4/3]',
        )}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes={horizontal ? '112px' : '(max-width: 640px) 100vw, 300px'}
            className="object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
            <i className="ri-image-line text-2xl" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 min-h-5">
          {categoryName && (
            <span className="text-xs text-[var(--color-muted)] truncate">{categoryName}</span>
          )}
          <span className="ml-auto">{openSlot}</span>
        </div>
        <h3 className="font-semibold text-[var(--color-title)] line-clamp-2">{title}</h3>
        <DistanceBadge meters={distanceMeters} />
        <strong className="text-[var(--color-primary)] mt-auto">{formatPrice(price)}</strong>
      </div>
    </Link>
  )
}
