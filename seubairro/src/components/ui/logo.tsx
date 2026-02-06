import Link from 'next/link'
import '@/styles/ui/logo.css'
interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    href?: string
    showText?: boolean
}
export function Logo({ size = 'md', href = '/', showText = true }: LogoProps) {
    const content = (
        <div className={`logo ${size}`}>
            <span className="logoText">
                Seu<span className="accent">Bairro</span>
            </span>
        </div>
    )
    if (href) {
        return (
            <Link href={href} className="logoLink">
                {content}
            </Link>
        )
    }
    return content
}

