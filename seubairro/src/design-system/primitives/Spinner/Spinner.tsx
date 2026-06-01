import { cn } from '@/lib/utils/cn'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  className?: string
  label?: string
}

const sizeMap: Record<Size, string> = {
  sm: 'size-4 border-2',
  md: 'size-5 border-2',
  lg: 'size-6 border-[3px]',
}

export const Spinner = ({ size = 'md', className, label }: Props) => (
  <span
    role="status"
    aria-live="polite"
    aria-label={label ?? 'Carregando'}
    className={cn(
      'inline-block rounded-full border-current border-r-transparent motion-safe:animate-spin',
      sizeMap[size],
      className,
    )}
  />
)
