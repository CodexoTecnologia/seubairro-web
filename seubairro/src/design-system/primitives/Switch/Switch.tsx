import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils/cn'
import { switchVariants, switchThumbVariants, type SwitchVariants } from './Switch.variants'

type Props = SwitchVariants & {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  id?: string
  className?: string
}

/** Toggle acessível (`role="switch"`). Space/Enter alternam (nativo do `<button>`). */
export const Switch = forwardRef<HTMLButtonElement, Props>(
  ({ checked, onChange, label, disabled, size, id, className }, ref) => {
    const generatedId = useId()
    const switchId = id ?? generatedId
    return (
      <span className="inline-flex items-center gap-2.5">
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            switchVariants({ size }),
            checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-default)]',
            className,
          )}
        >
          <span data-checked={checked} className={cn(switchThumbVariants({ size }))} />
        </button>
        <label htmlFor={switchId} className="text-sm text-[var(--color-body)] cursor-pointer select-none">
          {label}
        </label>
      </span>
    )
  },
)

Switch.displayName = 'Switch'
