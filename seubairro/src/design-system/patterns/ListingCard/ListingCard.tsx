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
  /** `compact` reduz padding e tipografia para grades mais densas. */
  size?: 'default' | 'compact'
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
  size = 'default',
  className,
}: Props) {
  const horizontal = layout === 'horizontal'
  const compact = size === 'compact'

  const validThumbnail = thumbnailUrl?.trim() ? thumbnailUrl.trim() : null

  return (
    <Link href={href} className={cn(listingCardVariants({ layout, emphasis }), className)}>
      <div
        className={cn(
          'relative bg-[var(--color-input)] shrink-0',
          horizontal ? 'w-28 aspect-square' : 'w-full aspect-[4/3]',
        )}
      >
        {validThumbnail ? (
          <Image
            src={validThumbnail}
            alt={title}
            fill
            sizes={horizontal ? '112px' : '(max-width: 640px) 100vw, 300px'}
            className="object-cover transition-transform duration-[var(--duration-base)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
            <i className={cn('ri-image-line', compact ? 'text-xl' : 'text-2xl')} aria-hidden />
          </div>
        )}
      </div>

      <div className={cn('flex flex-col flex-1 min-w-0', compact ? 'gap-1 p-2.5' : 'gap-1.5 p-3')}>
        <div className="flex items-center justify-between gap-2 min-h-5">
          {categoryName && (
            <span className="text-xs text-[var(--color-muted)] truncate">{categoryName}</span>
          )}
          <span className="ml-auto">{openSlot}</span>
        </div>
        <h3
          className={cn(
            'font-semibold text-[var(--color-title)] line-clamp-2',
            compact && 'text-sm leading-snug',
          )}
        >
          {title}
        </h3>
        <DistanceBadge meters={distanceMeters} />
        <strong
          data-numeric
          className={cn('text-[var(--color-primary)] mt-auto', compact && 'text-sm')}
        >
          {formatPrice(price)}
        </strong>
      </div>
    </Link>
  )
}
