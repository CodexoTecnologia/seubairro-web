'use client'
import React, { useState, useEffect } from 'react'
import '@/styles/business/list-anuncio/list-anuncio.css'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { ListingService } from '@/API/services/ListingService'
import { CategoryService } from '@/API/services/CategoryService'
import { BusinessService } from '@/API/services/BusinessService'

export default function ListarAnuncioPage() {
    const { user } = useAuthContext()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [ads, setAds] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    useEffect(() => {
        const loadListings = async () => {
            if (!user?.id) return
            try {
                setIsLoading(true)
                const businessRaw = await BusinessService.getByOwnerId(user.id)
                const rawData = (businessRaw as any)?.data ?? businessRaw
                const businessArr = Array.isArray(rawData) ? rawData : rawData ? [rawData] : []
                if (businessArr.length === 0) return

                const businessId = businessArr[0].id
                const [catsRaw, adsRaw] = await Promise.all([
                    CategoryService.getAll(),
                    ListingService.getByBusiness(businessId)
                ])
                console.log('[listar-anuncio] listings:', adsRaw)

                const catsArray = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as any)?.data || [])
                setCategories(catsArray)

                const catMap: Record<string, string> = {}
                catsArray.forEach((c: any) => { catMap[c.id] = c.name })

                const listingsArray = Array.isArray(adsRaw) ? adsRaw : ((adsRaw as any)?.data || [])
                const formattedAds = listingsArray.map((l: any) => ({
                    id: l.id,
                    title: l.title || 'Anúncio sem título',
                    price: l.price ?? 0,
                    isActive: l.isActive,
                    listingCategoryId: l.listingCategoryId,
                    categoryName: catsArray.find((c: any) => c.id === l.listingCategoryId)?.name || 'Geral',
                    imageUrl: l.imageUrl || "https://images.unsplash.com/photo-1588964895597-a51e21f816d0?auto=format&fit=crop&w=100&q=60"
                }))
                setAds(formattedAds)
            } catch (error) {
                console.error("Erro ao carregar anúncios", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadListings()
    }, [user])

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setIsUpdating(id)
            if (currentStatus) {
                await ListingService.deactivate(id)
            } else {
                await ListingService.activate(id)
            }

            setAds(prev => prev.map(ad => ad.id === id ? { ...ad, isActive: !currentStatus } : ad))
        } catch (err) {
            alert("Erro ao alterar status do anúncio")
        } finally {
            setIsUpdating(null)
        }
    }

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
        const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' ? ad.isActive === true : ad.isActive === false)
        const matchesCategory = categoryFilter === 'all' || ad.listingCategoryId === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Geral'

    return (
<div className="list-ads-container">
        <header className="page-header">
            <div className="header-title">
                <h1>Meus Anúncios</h1>
                <p>Gerencie seu catálogo de produtos e serviços.</p>
            </div>
        </header>
          <section className="toolbar-container">
            <div className="search-box">
                <i className="ri-search-line"></i>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Pesquisar anúncio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="toolbar-actions">
                <select 
                    className="filter-select" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Todos Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </select>

                <select 
                    className="filter-select" 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">Categorias</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <Link href="/pages/criar-anuncio" className="btn-create-compact">
                    <i className="ri-add-line"></i>
                    <span>Novo</span>
                </Link>
            </div>
        </section>

            {isLoading ? (
                <p>Carregando anúncios...</p>
            ) : (
                <div className="listings-list">
                    {filteredAds.map(ad => (
                        <div key={ad.id} className={`manage-card ${!ad.isActive ? 'paused' : ''} ${isUpdating === ad.id ? 'updating' : ''}`}>
                            <div className="mc-drag"><i className="ri-drag-move-2-fill"></i></div>

                            <div className="mc-image">
                                { }
                                <img src={ad.imageUrl} alt={ad.title || 'Imagem do produto'} />
                            </div>

                            <div className="mc-details">
                                <h3>{ad.title}</h3>
                                <span className="mc-cat">Anúncio • {getCategoryName(ad.listingCategoryId)}</span>
                            </div>

                            <div className="mc-metrics">
                                <div className="metric"><i className="ri-eye-line"></i> 0</div>
                                <div className="metric"><i className="ri-cursor-line"></i> 0</div>
                            </div>

                            <div className="mc-price">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ad.price)}
                            </div>

                            <div className="mc-status">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={ad.isActive}
                                        disabled={isUpdating === ad.id}
                                        onChange={() => handleToggleStatus(ad.id, ad.isActive)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={`status-text ${ad.isActive ? 'active' : 'inactive'}`}>
                                    {ad.isActive ? 'Ativo' : 'Pausado'}
                                </span>
                            </div>

                            <div className="mc-actions">
                                <Link href={`/pages/editar-anuncio/${ad.id}`} className="btn-icon-action" title="Editar">
                                    <i className="ri-pencil-line"></i>
                                </Link>
                                <button className="btn-icon-action delete" title="Excluir" onClick={() => handleDelete(ad.id)}>
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredAds.length === 0 && <p className="empty-state">Nenhum anúncio encontrado.</p>}
                </div>
            )}
        </div>
    )
}

