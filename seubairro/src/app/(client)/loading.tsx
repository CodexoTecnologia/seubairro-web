import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ListingCardSkeleton } from '@/design-system/patterns/ListingCard'

export default function ClientLoading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra sticky do feed: título "Perto de você" + toggle lista/mapa + filtros */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-default)] -mx-4 md:-mx-6 px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <Skeleton variant="text" width={120} />
        <div className="flex items-center gap-2">
          <Skeleton variant="rect" width={88} height={40} className="rounded-full" />
          <Skeleton variant="rect" width={96} height={40} className="rounded-full" />
        </div>
      </div>

      {/* Grade de anúncios com a anatomia real do ListingCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
