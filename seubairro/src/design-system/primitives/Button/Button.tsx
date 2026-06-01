import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { buttonVariants, type ButtonVariants } from './Button.variants'

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
  }

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-block size-4 border-2 border-current border-r-transparent rounded-full animate-spin" aria-hidden />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  ),
)

Button.displayName = 'Button'
