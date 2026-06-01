import { Skeleton } from '@/design-system/primitives/Skeleton'

export default function ClientLoading() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton variant="text" width="40%" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={160} />
        ))}
      </div>
    </div>
  )
}
