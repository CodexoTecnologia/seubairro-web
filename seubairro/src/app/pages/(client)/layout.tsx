'use client'

import AppNavbar from '@/components/layout/navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Helper to check active state
    const isActive = (path: string) => pathname === path ? 'active' : ''

    return (
        <div style={{ backgroundColor: 'var(--client-bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <AppNavbar />

            <div style={{ flex: 1 }}>
                {children}
            </div>

            <div className="bottom-nav">
                <Link href="/pages/dashboad" className={isActive('/pages/dashboad')}>
                    <i className="ri-home-5-line"></i>
                    <span>Início</span>
                </Link>
                <Link href="#" className={isActive('/pages/busca')}>
                    <i className="ri-search-line"></i>
                    <span>Buscar</span>
                </Link>
                <Link href="#" className={isActive('/pages/favoritos')}>
                    <i className="ri-heart-3-line"></i>
                    <span>Favoritos</span>
                </Link>
                <Link href="/pages/perfil" className={isActive('/pages/perfil')}>
                    <i className="ri-user-line"></i>
                    <span>Perfil</span>
                </Link>
            </div>
        </div>
    )
}
