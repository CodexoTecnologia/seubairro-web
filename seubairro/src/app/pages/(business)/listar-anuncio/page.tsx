'use client'
import React, { useState, useEffect } from 'react'
import '@/styles/business/list-anuncio/list-anuncio.css'
import Link from 'next/link'
import { ListingService } from '@/API/services/ListingService'
import { CategoryService } from '@/API/services/CategoryService'

export default function ListarAnuncioPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [ads, setAds] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadListings = async () => {
            try {
                setIsLoading(true)
                const [catsRaw, adsRaw] = await Promise.all([
                    CategoryService.getAll(),
                    ListingService.getAll()
                ])

                const catsArray = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as any)?.data || [])
                setCategories(catsArray)

                const catMap: Record<string, string> = {}
                catsArray.forEach((c: any) => { catMap[c.id] = c.name })

                const listingsArray = Array.isArray(adsRaw) ? adsRaw : ((adsRaw as any)?.data || [])
                const formattedAds = listingsArray.map((l: any) => ({
                    id: l.id,
                    title: l.title || 'Anúncio sem título',
                    price: `R$ ${l.price.toFixed(2)}`,
                    status: l.isActive ? 'active' : 'inactive',
                    categoryId: l.categoryId,
                    categoryName: catMap[l.categoryId] || 'Geral'
                }))

                setAds(formattedAds)
            } catch (error) {
                console.error("Erro ao carregar anúncios", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadListings()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este anúncio?")) {
            try {
                await ListingService.delete(id)
                setAds(prev => prev.filter(ad => ad.id !== id))
            } catch (err) {
                alert("Erro ao excluir o anúncio")
            }
        }
    }

    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || ad.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || ad.categoryId === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    return (
        <div className="list-ads-container">
            <div className="page-header">
                <div className="header-title">
                    <h1>Seus Anúncios</h1>
                    <p>Gerencie seus produtos e serviços ativos.</p>
                </div>
                <Link href="/pages/criar-anuncio" className="btn-create">
                    <i className="ri-add-line"></i> Novo Anúncio
                </Link>
            </div>
            <div className="filters-bar">
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
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                    </select>
                    <select
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Todas Categorias</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {isLoading ? (
                <p>Carregando anúncios...</p>
            ) : filteredAds.length === 0 ? (
                <p>Nenhum anúncio encontrado.</p>
            ) : (
                <div className="listings-list">
                    {filteredAds.map(ad => (
                        <div key={ad.id} className="listing-card">
                            <div className="listing-info">
                                <div className="listing-header">
                                    <h3 className="listing-title">{ad.title}</h3>
                                    <span className={`listing-status ${ad.status}`}>
                                        {ad.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <div className="listing-price">{ad.price}</div>
                            </div>
                            <div className="listing-actions">
                                <button className="btn-icon" title="Editar">
                                    <i className="ri-pencil-line"></i>
                                </button>
                                <button className="btn-icon delete" title="Excluir" onClick={() => handleDelete(ad.id)}>
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

