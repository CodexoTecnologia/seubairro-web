'use client'
import React, { useState, useEffect } from 'react'
import '@/styles/business/dashboard/dashboard.css'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { ListingService } from '@/API/services/ListingService'
import { CategoryService } from '@/API/services/CategoryService'

export default function BusinessDashboard() {
    const { user } = useAuthContext()
    const [listings, setListings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                const [catsRaw, listingsRaw] = await Promise.all([
                    CategoryService.getAll(),
                    ListingService.getAll()
                ])

                const catsArray = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as any)?.data || [])
                const catMap: Record<string, string> = {}
                catsArray.forEach((c: any) => { catMap[c.id] = c.name })

                const listingsArray = Array.isArray(listingsRaw) ? listingsRaw : ((listingsRaw as any)?.data || [])

                // Assuming getAll returns user's listings or we have to filter them. 
                // Since this is for business dashboard, we trust the API to return relevant listings for now.
                const formatted = listingsArray.map((l: any) => ({
                    id: l.id,
                    title: l.title || 'Anúncio sem título',
                    categoryName: catMap[l.categoryId] || 'Geral',
                    price: `R$ ${l.price.toFixed(2)}`,
                    isActive: l.isActive
                }))

                setListings(formatted)
            } catch (err) {
                console.error("Erro ao carregar dados", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <>
            <header className="content-header">
                <h1>Bom dia, {user?.firstName || 'Empreendedor'}! 🚀</h1>
                <p>Aqui está o resumo do seu negócio hoje.</p>
            </header>
            <section className="quick-actions">
                <h2>O que você quer fazer?</h2>
                <div className="actions-row">
                    <Link href="/pages/criar-anuncio" className="action-btn primary" style={{ textDecoration: 'none' }}>
                        <i className="ri-add-circle-line"></i>
                        <span>Criar Novo Anúncio</span>
                    </Link>
                    <a href="/pages/editar-profile" className="action-btn" style={{ textDecoration: 'none' }}>
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
                    <Link href="/pages/listar-anuncio">Ver todos</Link>
                </div>
                <div className="products-table">
                    {isLoading ? (
                        <p style={{ padding: '20px', color: '#64748b' }}>Carregando seus anúncios...</p>
                    ) : listings.length === 0 ? (
                        <p style={{ padding: '20px', color: '#64748b' }}>Você ainda não tem anúncios. Crie o seu primeiro!</p>
                    ) : (
                        listings.map(item => (
                            <div className="product-row" key={item.id}>
                                <div className="p-info">
                                    <strong>{item.title}</strong>
                                    <span>{item.categoryName}</span>
                                </div>
                                <div className="p-price">{item.price}</div>
                                <div className={`p-status ${item.isActive ? 'active' : ''}`}>{item.isActive ? 'Ativo' : 'Inativo'}</div>
                                <button className="btn-icon"><i className="ri-pencil-line"></i></button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    )
}

