'use client'
import React, { useState, useEffect } from 'react'
import { ListingService } from '@/API/services/ListingService'
import { CategoryService } from '@/API/services/CategoryService'
import type { ListingResponse } from '@/API/services/ListingService'
import type { CategoryResponse } from '@/API/dtos/Response/business/CategoryResponse'
import '@/styles/client/dashboard/dashboard.css'

export default function ClientDashboard() {
    const [currentType, setCurrentType] = useState('all')
    const [currentCategory, setCurrentCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
    const [adsData, setAdsData] = useState<any[]>([])
    const [categoriesMap, setCategoriesMap] = useState<Record<string, CategoryResponse>>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true)
                // Fetch categories
                const catsRaw = await CategoryService.getAll()
                const catsArray = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as any)?.data || [])

                const typeMap: Record<string, CategoryResponse> = {}
                catsArray.forEach((c: CategoryResponse) => {
                    typeMap[c.id] = c
                })
                setCategoriesMap(typeMap)

                // Fetch nearby listings (mocking max distance 50km for now)
                const listingsRaw = await ListingService.getNearby(50)
                const listingsArray = Array.isArray(listingsRaw) ? listingsRaw : ((listingsRaw as any)?.data || [])

                const formattedAds = listingsArray.map((listing: ListingResponse, i: number) => {
                    const category = typeMap[listing.listingCategoryId]
                    return {
                        id: listing.id,
                        title: listing.title || 'Anúncio sem título',
                        type: category?.categoryType === 1 ? 'product' : 'service',
                        category: category?.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || 'outros',
                        categoryName: category?.name || 'Geral',
                        price: `R$ ${listing.price.toFixed(2)}`
                    }
                })

                setAdsData(formattedAds)
            } catch (error) {
                console.error('Erro ao carregar dashboard', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadDashboardData()
    }, [])

    const filteredData = adsData.filter(item => {
        const matchType = currentType === 'all' || item.type === currentType
        const matchCat = currentCategory === 'all' || item.category.includes(currentCategory) || currentCategory === item.category
        return matchType && matchCat
    })

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
                </div>
            </header>
            <main className="main-content container">
                <div id="feedView">
                    <div className="feed-header-info">
                        <h3>Destaques perto de você</h3>
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
                                    <div className="ad-content">
                                        <div className="ad-category">
                                            <i className={item.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'} style={{ marginRight: '4px' }}></i>
                                            {item.categoryName}
                                        </div>
                                        <h3 className="ad-title">{item.title}</h3>
                                        <div className="ad-price">{item.price}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

