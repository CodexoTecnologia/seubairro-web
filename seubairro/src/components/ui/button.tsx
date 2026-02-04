import { ButtonHTMLAttributes, ReactNode } from 'react'
import '@/styles/ui/button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
    children: ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const classes = [
        'button',
        variant,
        size,
        fullWidth && 'fullWidth',
        isLoading && 'loading',
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Carregando...' : children}
        </button>
    )
}
