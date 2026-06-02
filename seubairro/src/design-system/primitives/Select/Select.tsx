import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { selectVariants, type SelectVariants } from './Select.variants'

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  Pick<SelectVariants, 'size'> & {
    label?: string
    error?: string
    hint?: string
    leftIcon?: ReactNode
    fullWidth?: boolean
  }

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, hint, leftIcon, fullWidth, className, id, size, children, ...rest }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const hasError = Boolean(error)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-title)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-3 flex items-center text-[var(--color-muted)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            className={cn(
              selectVariants({ size, state: hasError ? 'error' : 'default' }),
              leftIcon && 'pl-10',
              className,
            )}
            {...rest}
          >
            {children}
          </select>
          <i
            aria-hidden
            className="ri-arrow-down-s-line absolute inset-y-0 right-3 flex items-center text-[var(--color-muted)] pointer-events-none"
          />
        </div>
        {hasError ? (
          <span id={`${selectId}-error`} className="text-xs text-[var(--color-danger)]">
            {error}
          </span>
        ) : hint ? (
          <span id={`${selectId}-hint`} className="text-xs text-[var(--color-muted)]">
            {hint}
          </span>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
