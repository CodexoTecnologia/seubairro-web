import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { sliderVariants, type SliderVariants } from './Slider.variants'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size' | 'color'> &
  SliderVariants & {
    min: number
    max: number
    step?: number
    value: number
    onChange: (value: number) => void
    label: string
    valueFormatter?: (value: number) => string
    disabled?: boolean
  }

/**
 * Wrapper acessível sobre `<input type="range">`. Teclado (setas, Home/End) é nativo.
 */
export const Slider = forwardRef<HTMLInputElement, Props>(
  (
    { min, max, step = 1, value, onChange, label, valueFormatter, disabled, size, color, className, ...rest },
    ref,
  ) => {
    const id = useId()
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-[var(--color-title)]">
            {label}
          </label>
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            {valueFormatter ? valueFormatter(value) : value}
          </span>
        </div>
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(sliderVariants({ size, color }), className)}
          {...rest}
        />
      </div>
    )
  },
)

Slider.displayName = 'Slider'
