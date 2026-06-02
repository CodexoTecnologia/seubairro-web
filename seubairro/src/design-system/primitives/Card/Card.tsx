import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { cardVariants, type CardVariants } from './Card.variants'

type Props = HTMLAttributes<HTMLDivElement> & CardVariants

export const Card = forwardRef<HTMLDivElement, Props>(
  ({ className, variant, padding, ...rest }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...rest} />
  ),
)

Card.displayName = 'Card'

export const CardHeader = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...rest} />
)

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>
}

export const CardTitle = ({ as: Tag = 'h3', className, ...rest }: CardTitleProps) => (
  <Tag className={cn('text-lg font-semibold text-[var(--color-title)]', className)} {...rest} />
)

export const CardDescription = ({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-[var(--color-muted)]', className)} {...rest} />
)

export const CardFooter = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center gap-2 mt-4', className)} {...rest} />
)
