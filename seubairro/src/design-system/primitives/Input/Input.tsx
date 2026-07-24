import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { inputVariants, type InputVariants } from './Input.variants'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Pick<InputVariants, 'size'> & {
    label?: string
    error?: string
    hint?: string
    leftIcon?: ReactNode
    rightElement?: ReactNode
    fullWidth?: boolean
  }

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, hint, leftIcon, rightElement, fullWidth, className, id, size, ...rest },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hasError = Boolean(error)
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-title)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-3 flex items-center text-[var(--color-muted)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              inputVariants({ size, state: hasError ? 'error' : 'default' }),
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              className,
            )}
            {...rest}
          />
          {rightElement && (
            <span className="absolute inset-y-0 right-3 flex items-center">
              {rightElement}
            </span>
          )}
        </div>
        {hasError ? (
          <span id={`${inputId}-error`} className="text-xs text-[var(--color-danger)]">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-xs text-[var(--color-muted)]">
            {hint}
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
