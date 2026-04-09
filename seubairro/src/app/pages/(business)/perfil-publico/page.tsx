'use client'
import React, { useState, useEffect } from 'react'
import '@/styles/business/public-profile/public-profile.css'
import { useAuthContext } from '@/contexts/AuthContext'
import { BusinessService, type BusinessResponse } from '@/API/services/BusinessService'
import { ListingService } from '@/API/services/ListingService'

export default function BusinessPerfilPage() {
    const { user, isAuthenticated } = useAuthContext()
    const [business, setBusiness] = useState<BusinessResponse | null>(null)
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!isAuthenticated || !user?.id) {
                setError("Usuário não autenticado.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true)
                // 1. Fetch Business
                const businessRaw = await BusinessService.getByOwnerId(user.id)
                let currentBusiness: BusinessResponse | null = null

                if (businessRaw && businessRaw.length > 0) {
                    currentBusiness = businessRaw[0]
                    setBusiness(currentBusiness)
                } else {
                    setError("Nenhum estabelecimento encontrado.")
                    return
                }

                // 2. Fetch Listings limit or all for this owner
                // Assuming ListingService.getAll() returns this user's listings
                const listingsRaw = await ListingService.getAll()
                const listingsArray = Array.isArray(listingsRaw) ? listingsRaw : ((listingsRaw as any)?.data || [])

                const activeListings = listingsArray
                    .filter((l: any) => l.isActive)
                    .map((l: any) => ({
                        id: l.id,
                        title: l.title || 'Produto sem título',
                        price: `R$ ${l.price.toFixed(2)}`,
                        image: "https://placehold.co/200" // mock image
                    }))

                setListings(activeListings)
            } catch (err) {
                console.error(err)
                setError("Falha ao carregar dados do perfil.")
            } finally {
                setLoading(false)
            }
        }

        fetchProfileData()
    }, [user, isAuthenticated])

    if (loading) {
        return (
            <div className="public-profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <p>Carregando perfil...</p>
            </div>
        )
    }

    if (error || !business) {
        return (
            <div className="public-profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <p>{error || "Erro ao carregar"}</p>
            </div>
        )
    }

    const coverImage = business.coverImageUrl || "https://placehold.co/1200x300"
    const profileImage = business.logoUrl || "https://placehold.co/200"
    const whatsappLink = business.publicPhone ? `https://wa.me/55${business.publicPhone.replace(/\D/g, '')}` : '#'

    // Mocking some data for the public profile view that's not natively in the business response yet
    const isOpen = true
    const rating = 4.8
    const reviewCount = 124

    return (
        <div className="public-profile-container">
            <div className="profile-cover-wrapper">
                <img src={coverImage} alt="Capa" className="cover-image" />
            </div>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="profile-header-card">
                    <div className="profile-identity">
                        <img src={profileImage} alt="Perfil" className="profile-avatar" />
                        <div className="profile-info">
                            {/* <span className="category-badge">Categoria Principal</span> */}
                            <h1>{business.businessName || business.legalName || 'Nome do Negócio'}</h1>
                            <div className="rating-box">
                                <span>{rating}</span>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-half-fill"></i>
                                <span>({reviewCount} avaliações)</span>
                            </div>
                            <div className={`business-status ${isOpen ? 'open' : 'closed'}`}>
                                <span className="dot"></span>
                                {isOpen ? 'Aberto agora' : 'Fechado'}
                            </div>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-whatsapp">
                            <i className="ri-whatsapp-line"></i> Chamar no Zap
                        </a>
                        <button className="btn-share">
                            <i className="ri-share-forward-line"></i>
                        </button>
                    </div>
                </div>

                <section className="profile-section">
                    <div className="section-header">
                        <h2>Sobre</h2>
                    </div>
                    <p className="about-text">{business.description || "Nenhuma descrição fornecida."}</p>
                </section>

                <section className="profile-section">
                    <div className="section-header">
                        <h2>Informações</h2>
                    </div>
                    <div className="info-card">
                        <div className="info-row">
                            <i className="ri-map-pin-line info-icon"></i>
                            <div className="info-content">
                                <strong>Endereço</strong>
                                <p>Endereço não cadastrado ou não disponível publicamente.</p>
                                <div className="map-preview">
                                    <i className="ri-map-2-fill" style={{ marginRight: '8px' }}></i> Ver no Mapa
                                </div>
                            </div>
                        </div>
                        <div className="info-row">
                            <i className="ri-time-line info-icon"></i>
                            <div className="info-content">
                                <strong>Horário de Funcionamento</strong>
                                <p>Seg-Sex: 08:00 - 19:00 (Mockado)</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="profile-section">
                    <div className="section-header">
                        <h2>Destaques</h2>
                    </div>
                    {listings.length > 0 ? (
                        <div className="products-grid">
                            {listings.map(product => (
                                <div key={product.id} className="product-card">
                                    <img src={product.image} alt={product.title} className="product-image" />
                                    <div className="product-details">
                                        <h3 className="product-title">{product.title}</h3>
                                        <div className="product-price">{product.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b' }}>Nenhum destaque disponível no momento.</p>
                    )}
                </section>
                <section className="profile-section">
                    <div className="section-header">
                        <h2>O que dizem os clientes</h2>
                    </div>
                    <div className="info-card" style={{ textAlign: 'center', padding: '30px' }}>
                        <p style={{ color: '#64748b' }}>Avaliações estarão disponíveis em breve.</p>
                    </div>
                </section>
            </div>
        </div>
    )
}

