import { formatDistance } from '@/lib/utils'
import { cn } from '@/lib/utils/cn'

type Props = {
  meters: number
  className?: string
}

export function DistanceBadge({ meters, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-[var(--color-muted)]',
        className,
      )}
    >
      <i className="ri-map-pin-line" aria-hidden />
      {formatDistance(meters)}
    </span>
  )
}
