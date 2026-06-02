import { Skeleton } from '@/design-system/primitives/Skeleton'

export default function BusinessLoading() {
  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="60%" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <Skeleton variant="rect" height={80} />
        <Skeleton variant="rect" height={80} />
        <Skeleton variant="rect" height={80} />
      </div>
      <Skeleton variant="rect" height={200} />
    </div>
  )
}
