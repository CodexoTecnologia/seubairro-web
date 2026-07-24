import { Skeleton } from '@/design-system/primitives/Skeleton'
import { cn } from '@/lib/utils/cn'

type Props = {
  /** Espelha o layout do ListingCard real. Default: `vertical`. */
  layout?: 'vertical' | 'horizontal'
  className?: string
}

/**
 * Placeholder de carregamento com a mesma anatomia do ListingCard:
 * imagem (aspect 4/3 ou quadrada no horizontal), linha de categoria,
 * título em duas linhas e rodapé com preço + badge de distância.
 */
export function ListingCardSkeleton({ layout = 'vertical', className }: Props) {
  const horizontal = layout === 'horizontal'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)]',
        horizontal ? 'flex' : 'flex flex-col',
        className,
      )}
    >
      <Skeleton
        variant="rect"
        className={cn('rounded-none shrink-0', horizontal ? 'w-28 aspect-square' : 'w-full aspect-[4/3]')}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton variant="text" width={72} />
          <Skeleton variant="rect" width={64} height={20} className="rounded-full" />
        </div>
        <Skeleton variant="text" lines={2} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <Skeleton variant="text" width={80} className="h-4" />
          <Skeleton variant="rect" width={56} height={20} className="rounded-full" />
        </div>
      </div>
    </div>
  )
}
