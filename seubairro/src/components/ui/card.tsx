import { ReactNode } from 'react'
import '@/styles/ui/card.css'
interface CardProps {
    children: ReactNode
    variant?: 'default' | 'elevated' | 'outlined'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    className?: string
}
export function Card({
    children,
    variant = 'default',
    padding = 'md',
    className = ''
}: CardProps) {
    const classes = [
        'card',
        variant,
        `padding-${padding}`,
        className
    ].filter(Boolean).join(' ')
    return <div className={classes}>{children}</div>
}

