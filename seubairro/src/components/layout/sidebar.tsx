'use client'
import React from 'react'
import Link from 'next/link'
export function BusinessSidebar() {
    return (
        <aside className="biz-sidebar">
            <div className="sidebar-header">
                <h3>Minha Loja</h3>
                <span className="status-badge online">Loja Aberta</span>
            </div>
            <nav className="biz-menu">
                <Link href="/pages/business" className="menu-link active">
                    <i className="ri-dashboard-line"></i>
                    <span>Visão Geral</span>
                </Link>
                <Link href="/pages/business/anuncios" className="menu-link">
                    <i className="ri-store-2-line"></i>
                    <span>Meus Anúncios</span>
                    <span className="counter">3</span>
                </Link>
                <Link href="/pages/business/mensagens" className="menu-link">
                    <i className="ri-message-3-line"></i>
                    <span>Mensagens</span>
                    <span className="small-icon"><i className="ri-external-link-line"></i></span>
                </Link>
                <Link href="/pages/business/configuracoes" className="menu-link">
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

