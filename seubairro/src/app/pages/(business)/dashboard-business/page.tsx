'use client'
import React from 'react'
import '@/styles/business/dashboard/dashboard.css'
export default function BusinessDashboard() {
    return (
        <>
            <header className="content-header">
                <h1>Bom dia, Gabriel! 🚀</h1>
                <p>Aqui está o resumo do seu negócio hoje.</p>
            </header>
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue"><i className="ri-eye-line"></i></div>
                    <div className="stat-info">
                        <span className="label">Visitas no Perfil</span>
                        <strong className="value">1,240</strong>
                        <span className="trend up"><i className="ri-arrow-up-line"></i> 12% essa semana</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><i className="ri-whatsapp-line"></i></div>
                    <div className="stat-info">
                        <span className="label">Cliques no Zap</span>
                        <strong className="value">45</strong>
                        <span className="trend up"><i className="ri-arrow-up-line"></i> 5 novos hoje</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><i className="ri-map-pin-line"></i></div>
                    <div className="stat-info">
                        <span className="label">Aparições no Mapa</span>
                        <strong className="value">3,800</strong>
                        <span className="trend neutral"><i className="ri-subtract-line"></i> Estável</span>
                    </div>
                </div>
            </section>
            <section className="quick-actions">
                <h2>O que você quer fazer?</h2>
                <div className="actions-row">
                    <a href="#" className="action-btn primary" style={{ textDecoration: 'none' }}>
                        <i className="ri-add-circle-line"></i>
                        <span>Criar Novo Anúncio</span>
                    </a>
                    <a href="#" className="action-btn" style={{ textDecoration: 'none' }}>
                        <i className="ri-edit-box-line"></i>
                        <span>Editar Informações</span>
                    </a>
                    <button className="action-btn">
                        <i className="ri-share-forward-line"></i>
                        <span>Compartilhar Loja</span>
                    </button>
                </div>
            </section>
            <section className="recent-products">
                <div className="section-head">
                    <h2>Seus Anúncios Ativos</h2>
                    <a href="#">Ver todos</a>
                </div>
                <div className="products-table">
                    <div className="product-row">
                        <img src="https://placehold.co/100" alt="Produto" />
                        <div className="p-info">
                            <strong>Cesta Básica Completa</strong>
                            <span>Alimentação</span>
                        </div>
                        <div className="p-price">R$ 120,00</div>
                        <div className="p-status active">Ativo</div>
                        <button className="btn-icon"><i className="ri-pencil-line"></i></button>
                    </div>
                    <div className="product-row">
                        <img src="https://placehold.co/100" alt="Produto" />
                        <div className="p-info">
                            <strong>Sucos Naturais</strong>
                            <span>Alimentação</span>
                        </div>
                        <div className="p-price">R$ 8,50</div>
                        <div className="p-status active">Ativo</div>
                        <button className="btn-icon"><i className="ri-pencil-line"></i></button>
                    </div>
                </div>
            </section>
        </>
    )
}

