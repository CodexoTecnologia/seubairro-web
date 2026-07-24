import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ListingCardSkeleton } from '@/design-system/patterns/ListingCard'

export default function PublicLoading() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
      {/* Capa + identidade do negócio */}
      <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border-default)]">
        <Skeleton variant="rect" className="w-full h-36 md:h-48 rounded-none" />
        <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <Skeleton variant="circle" width={80} height={80} className="-mt-12 sm:-mt-14 ring-4 ring-[var(--color-surface)] shrink-0" />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <Skeleton variant="text" width="45%" className="h-5" />
            <Skeleton variant="text" width="65%" />
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Skeleton variant="rect" width={96} height={24} className="rounded-full" />
              <Skeleton variant="rect" width={112} height={24} className="rounded-full" />
            </div>
          </div>
          <Skeleton variant="rect" width={140} height={44} className="rounded-full shrink-0" />
        </div>
      </div>

      {/* Grade de anúncios do negócio */}
      <div className="flex flex-col gap-4">
        <Skeleton variant="text" width={160} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
