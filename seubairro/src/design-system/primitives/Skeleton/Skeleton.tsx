import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

type Variant = 'text' | 'circle' | 'rect'

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant
  lines?: number
  width?: string | number
  height?: string | number
}

const baseClasses = 'bg-[var(--color-border-default)]/60 animate-pulse'

export const Skeleton = ({
  variant = 'rect',
  lines = 1,
  width,
  height,
  className,
  style,
  ...rest
}: Props) => {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, 'h-3 rounded-sm', i === lines - 1 && 'w-4/5')}
            style={{ width: i === lines - 1 ? undefined : width }}
          />
        ))}
      </div>
    )
  }

  const shape =
    variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded-sm h-3' : 'rounded-md'

  return (
    <div
      className={cn(baseClasses, shape, className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  )
}
