'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // 1. Importamos o hook

export function BusinessSidebar() {
    const pathname = usePathname() // 2. Pegamos a URL atual

    return (
        <aside className="biz-sidebar">
            <div className="sidebar-header">
                <h3>Minha Loja</h3>
                <span className="status-badge online">Loja Aberta</span>
            </div>
            
            <nav className="biz-menu">
                <Link 
                    href="/pages/dashboard-business" 
                    // 3. Validação dinâmica de classe
                    className={`menu-link ${pathname === '/pages/dashboard-business' ? 'active' : ''}`}
                >
                    <i className="ri-dashboard-line"></i>
                    <span>Visão Geral</span>
                </Link>
                
                <Link 
                    href="/pages/listar-anuncio" 
                    // Usando startsWith para manter ativo em sub-páginas (ex: /criar-anuncio)
                    className={`menu-link ${pathname.startsWith('/pages/listar-anuncio') || pathname.startsWith('/pages/criar-anuncio') || pathname.startsWith('/pages/editar-anuncio') ? 'active' : ''}`}
                >
                    <i className="ri-store-2-line"></i>
                    <span>Meus Anúncios</span>
                </Link>
                
                <Link 
                    href="/pages/Chat" 
                    className={`menu-link ${pathname.startsWith('/pages/Chat') ? 'active' : ''}`}
                >
                    <i className="ri-message-3-line"></i>
                    <span>Mensagens</span>
                    <span className="small-icon"><i className="ri-external-link-line"></i></span>
                </Link>
                
                <Link 
                    href="/pages/perfil-publico" 
                    className={`menu-link ${pathname.startsWith('/pages/perfil-publico') ? 'active' : ''}`}
                >
                    <i className="ri-store-3-line"></i>
                    <span>Perfil Público</span>
                </Link>
                
                <Link 
                    href="/pages/editar-profile" 
                    className={`menu-link ${pathname.startsWith('/pages/editar-profile') ? 'active' : ''}`}
                >
                    <i className="ri-settings-3-line"></i>
                    <span>Configurações</span>
                </Link>
            </nav>
            
            <div className="sidebar-footer">
                <div className="plan-card">
                    <div className="plan-icon">
                        <i className="ri-vip-crown-line"></i>
                    </div>
                    <div>
                        <strong>Plano Premium</strong>
                        <Link href="#">Gerenciar Plano</Link>
                    </div>
                </div>
            </div>
        </aside>
    )
}