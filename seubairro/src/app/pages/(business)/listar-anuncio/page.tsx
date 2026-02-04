'use client'

import React, { useState } from 'react'
import '@/styles/business/list-anuncio/list-anuncio.css'
import Link from 'next/link'

export default function ListarAnuncioPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Mock Data
    const ads = [
        {
            id: 1,
            title: "Cesta Básica Completa",
            price: "R$ 120,00",
            status: "active",
            category: "food",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=60",
            views: 124
        },
        {
            id: 2,
            title: "Sucos Naturais 500ml",
            price: "R$ 8,50",
            status: "active",
            category: "food",
            image: "https://images.unsplash.com/photo-1621905476059-5f34604809f6?auto=format&fit=crop&w=150&q=60",
            views: 45
        },
        {
            id: 3,
            title: "Promoção de Fraldas G",
            price: "R$ 45,90",
            status: "inactive",
            category: "retail",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=150&q=60",
            views: 12
        }
    ]

    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || ad.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    return (
        <div className="list-ads-container">
            <div className="page-header">
                <div className="header-title">
                    <h1>Seus Anúncios</h1>
                    <p>Gerencie seus produtos e serviços ativos.</p>
                </div>
                {/* Botão de criar anuncio */}
                <Link href="/pages/business/criar-anuncio" className="btn-create">
                    <i className="ri-add-line"></i> Novo Anúncio
                </Link>
            </div>

            <div className="filters-bar">
                {/* Busca por nome de anuncio */}
                <div className="search-box">
                    <i className="ri-search-line"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar anúncio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    {/* Filtro por status */}
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                    </select>

                    {/* Filtro por categoria */}
                    <select
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Todas Categorias</option>
                        <option value="food">Alimentação</option>
                        <option value="services">Serviços</option>
                        <option value="retail">Varejo</option>
                    </select>
                </div>
            </div>

            {/* Lista de anuncios */}
            <div className="listings-list">
                {filteredAds.map(ad => (
                    <div key={ad.id} className="listing-card">
                        <img src={ad.image} alt={ad.title} className="listing-thumb" />

                        <div className="listing-info">
                            <div className="listing-header">
                                {/* Nome do anuncio */}
                                <h3 className="listing-title">{ad.title}</h3>
                                {/* Se esta ativo ou não */}
                                <span className={`listing-status ${ad.status}`}>
                                    {ad.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            {/* Preço */}
                            <div className="listing-price">{ad.price}</div>

                            <div className="listing-meta">
                                <i className="ri-eye-line"></i> {ad.views} visualizações
                            </div>
                        </div>

                        <div className="listing-actions">
                            {/* Botão de editar */}
                            <button className="btn-icon" title="Editar">
                                <i className="ri-pencil-line"></i>
                            </button>
                            {/* Botão de excluir */}
                            <button className="btn-icon delete" title="Excluir">
                                <i className="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}