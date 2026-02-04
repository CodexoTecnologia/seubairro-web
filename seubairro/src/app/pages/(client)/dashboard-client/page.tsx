'use client'

import React, { useState } from 'react'
import '@/styles/client/dashboard/dashboard.css'

export default function ClientDashboard() {
    const [currentType, setCurrentType] = useState('all')
    const [currentCategory, setCurrentCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

    const adsData = [
        {
            id: 1,
            title: "Mercadinho da Família",
            type: "product",
            category: "alimentacao",
            price: "Ofertas do Dia",
            rating: 4.8,
            reviews: 120,
            distance: 0.2,
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            title: "Eletricista Rápido",
            type: "service",
            category: "servicos",
            price: "A partir de R$ 80",
            rating: 5.0,
            reviews: 45,
            distance: 1.5,
            image: "https://images.unsplash.com/photo-1621905476059-5f34604809f6?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 3,
            title: "Salão Beleza Pura",
            type: "service",
            category: "beleza",
            price: "Corte R$ 35,00",
            rating: 4.5,
            reviews: 80,
            distance: 0.5,
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 4,
            title: "Hamburgueria Artesanal",
            type: "product",
            category: "alimentacao",
            price: "Combo R$ 29,90",
            rating: 4.9,
            reviews: 200,
            distance: 3.2,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 5,
            title: "Conserto de Celular",
            type: "service",
            category: "servicos",
            price: "Orçamento Grátis",
            rating: 4.7,
            reviews: 15,
            distance: 0.1,
            image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 6,
            title: "Moda Local",
            type: "product",
            category: "varejo",
            price: "Peças exclusivas",
            rating: 4.6,
            reviews: 30,
            distance: 0.8,
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=60"
        }
    ]

    const filteredData = adsData.filter(item => {
        const matchType = currentType === 'all' || item.type === currentType
        const matchCat = currentCategory === 'all' || item.category === currentCategory
        return matchType && matchCat
    }).sort((a, b) => a.distance - b.distance)

    const mockCoordinates = [
        { t: '30%', l: '40%' }, { t: '50%', l: '60%' },
        { t: '70%', l: '30%' }, { t: '20%', l: '70%' },
        { t: '40%', l: '20%' }, { t: '60%', l: '80%' }
    ]

    return (
        <>
            <header className="filters-header">
                <div className="container filters-container">

                    <div className="type-selector-wrapper">
                        <div className="type-selector">
                            <button
                                className={`type-btn ${currentType === 'all' ? 'active' : ''}`}
                                onClick={() => setCurrentType('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`type-btn ${currentType === 'product' ? 'active' : ''}`}
                                onClick={() => setCurrentType('product')}
                            >
                                Produtos
                            </button>
                            <button
                                className={`type-btn ${currentType === 'service' ? 'active' : ''}`}
                                onClick={() => setCurrentType('service')}
                            >
                                Serviços
                            </button>
                        </div>
                    </div>

                    <div className="category-scroll">
                        <button
                            className={`cat-pill ${currentCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setCurrentCategory('all')}
                        >
                            <i className="ri-apps-2-line"></i> Tudo
                        </button>
                        <button
                            className={`cat-pill ${currentCategory === 'alimentacao' ? 'active' : ''}`}
                            onClick={() => setCurrentCategory('alimentacao')}
                        >
                            <i className="ri-restaurant-2-line"></i> Alimentação
                        </button>
                        <button
                            className={`cat-pill ${currentCategory === 'servicos' ? 'active' : ''}`}
                            onClick={() => setCurrentCategory('servicos')}
                        >
                            <i className="ri-hammer-line"></i> Serviços
                        </button>
                        <button
                            className={`cat-pill ${currentCategory === 'varejo' ? 'active' : ''}`}
                            onClick={() => setCurrentCategory('varejo')}
                        >
                            <i className="ri-shopping-bag-3-line"></i> Varejo
                        </button>
                        <button
                            className={`cat-pill ${currentCategory === 'beleza' ? 'active' : ''}`}
                            onClick={() => setCurrentCategory('beleza')}
                        >
                            <i className="ri-scissors-cut-line"></i> Beleza
                        </button>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            id="btnListView"
                        >
                            <i className="ri-list-check"></i>
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => setViewMode('map')}
                            id="btnMapView"
                        >
                            <i className="ri-map-2-line"></i>
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content container">

                {viewMode === 'list' && (
                    <div id="feedView">
                        <div className="feed-header-info">
                            <h3>Destaques perto de você</h3>
                            <span>Ordenado por proximidade <i className="ri-arrow-down-line"></i></span>
                        </div>

                        <div className="listings-grid" id="listingsContainer">
                            {filteredData.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                                    <i className="ri-search-2-line" style={{ fontSize: '3rem', marginBottom: '10px', display: 'block' }}></i>
                                    <p>Nenhum resultado encontrado.</p>
                                </div>
                            ) : (
                                filteredData.map(item => (
                                    <div key={item.id} className="ad-card" onClick={() => window.location.href = '/pages/detalhes-anuncio'}>
                                        <div className="ad-image" style={{ backgroundImage: `url('${item.image}')` }}>
                                            <div className="dist-badge">
                                                <i className="ri-map-pin-2-fill"></i> {item.distance} km
                                            </div>
                                            <button className="fav-btn"><i className="ri-heart-line"></i></button>
                                        </div>
                                        <div className="ad-content">
                                            <div className="ad-category">
                                                <i className={item.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'} style={{ marginRight: '4px' }}></i>
                                                {item.category}
                                            </div>
                                            <h3 className="ad-title">{item.title}</h3>
                                            <div className="ad-rating">
                                                <i className="ri-star-fill"></i> {item.rating} <span>({item.reviews})</span>
                                            </div>
                                            <div className="ad-price">{item.price}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {viewMode === 'map' && (
                    <div id="mapView" className="map-wrapper">
                        <div className="simulated-map">
                            <div className="map-bg"></div>
                            <div id="mapPinsContainer">
                                {filteredData.map((item, index) => {
                                    const pos = mockCoordinates[index % mockCoordinates.length]
                                    return (
                                        <div
                                            key={item.id}
                                            className="map-pin"
                                            style={{ top: pos.t, left: pos.l }}
                                            onClick={() => window.location.href = '/pages/detalhes-anuncio'}
                                        >
                                            <div className="pin-shape">
                                                <i className={item.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'}></i>
                                            </div>
                                            <div className="pin-label">{item.title}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="map-overlay-btn">
                                <i className="ri-focus-3-line"></i> Centralizar em mim
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </>
    )
}
