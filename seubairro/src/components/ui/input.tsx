import { InputHTMLAttributes, ReactNode } from 'react'
import '@/styles/ui/input.css'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ReactNode
    rightElement?: ReactNode
    fullWidth?: boolean
}
export function Input({
    label,
    error,
    icon,
    rightElement,
    fullWidth = false,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    return (
        <div className={`inputGroup ${fullWidth ? 'fullWidth' : ''}`}>
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                </label>
            )}
            <div className="inputWrapper">
                {icon && <div className="icon">{icon}</div>}
                <input
                    id={inputId}
                    className={`input ${icon ? 'withIcon' : ''} ${rightElement ? 'withRightElement' : ''} ${error ? 'error' : ''} ${className}`}
                    {...props}
                />
                {rightElement && <div className="rightElement">{rightElement}</div>}
            </div>
            {error && <span className="errorMessage">{error}</span>}
        </div>
    )
}

