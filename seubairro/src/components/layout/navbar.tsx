'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Navbar() {
    const pathname = usePathname()
    const businessPaths = ['/pages/dashboard', '/pages/criar-anuncio', '/pages/listar-anuncio', '/pages/editar-profile', '/pages/Chat']
    const isBusiness = pathname ? businessPaths.some(path => pathname.toLowerCase().startsWith(path.toLowerCase())) : false
    return (
        <nav className={`app-navbar ${isBusiness ? 'theme-business' : 'theme-client'}`}>
            <div className="nav-container">
                <Link href={isBusiness ? "/pages/dashboard-business" : "/pages/dashboard-client"} className="nav-logo">
                    <img src="/assets/logo-seubairro.svg" alt="SeuBairro" />
                    <span>Seu<span>Bairro</span> {isBusiness && <small style={{ fontSize: '0.6em', color: 'var(--business-accent)', marginLeft: '4px' }}>Business</small>}</span>
                </Link>
                {!isBusiness && (
                    <div className="search-bar-container">
                        <div className="search-input-wrapper">
                            <i className="ri-search-line"></i>
                            <input type="text" placeholder="Buscar produtos ou serviços..." />
                        </div>
                        <div className="location-badge">
                            <i className="ri-map-pin-user-fill"></i>
                            <span>Colombo, PR</span>
                        </div>
                    </div>
                )}
                <div className="nav-actions">
                    <button className="icon-btn" title="Notificações"><i className="ri-notification-3-line"></i></button>
                    <Link href="/pages/perfil" className="user-profile" style={{ textDecoration: 'none' }}>
                        <div className="avatar-circle">G</div>
                        <span className="user-name">Gabriel</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

