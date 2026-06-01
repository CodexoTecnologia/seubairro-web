import { Skeleton } from '@/design-system/primitives/Skeleton'

export default function PublicLoading() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
      <Skeleton variant="rect" height={200} />
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="rect" height={300} />
    </div>
  )
}
