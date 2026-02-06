import { ReactNode, HTMLAttributes } from 'react'
import '@/styles/ui/card.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    variant?: 'default' | 'elevated' | 'outlined'
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    const classes = [
        'card',
        variant,
        `padding-${padding}`,
        className
    ].filter(Boolean).join(' ')
    
    return <div className={classes} {...props}>{children}</div>
}

