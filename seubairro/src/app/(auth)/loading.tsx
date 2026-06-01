import { Skeleton } from '@/design-system/primitives/Skeleton'

export default function AuthLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4 p-6">
        <Skeleton variant="rect" height={56} width={56} className="rounded-full" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton variant="rect" height={44} />
          <Skeleton variant="rect" height={44} />
          <Skeleton variant="rect" height={44} />
        </div>
      </div>
    </div>
  )
}
