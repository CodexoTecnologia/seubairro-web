'use client'

import React from 'react'
import '@/styles/business/public-profile/public-profile.css'

export default function BusinessPerfilPage() {
    // Mock Data (Simulating what would come from an API)
    const businessData = {
        name: "Mercadinho da Vila",
        category: "Alimentação e Bebidas",
        coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
        isOpen: true,
        rating: 4.8,
        reviewCount: 124,
        whatsapp: "5541999999999",
        description: "O melhor mercadinho da região! Temos produtos frescos, padaria própria e um atendimento que você só encontra aqui. Venha nos visitar e confira nossas ofertas diárias.",
        address: "Rua das Flores, 123 - Centro, Colombo - PR",
        hours: {
            status: "Aberto agora",
            schedule: "Seg-Sex: 08:00 - 19:00"
        },
        products: [
            { id: 1, title: "Pão Francês Fresquinho", price: "R$ 12,90/kg", image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=300&q=60" },
            { id: 2, title: "Leite Integral", price: "R$ 4,50", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=60" },
            { id: 3, title: "Café Torrado", price: "R$ 18,90", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=300&q=60" },
            { id: 4, title: "Queijo Mussarela", price: "R$ 45,90/kg", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=300&q=60" }
        ]
    }

    return (
        <div className="public-profile-container">
            {/* Imagem de capa */}
            <div className="profile-cover-wrapper">
                <img src={businessData.coverImage} alt="Capa" className="cover-image" />
            </div>

            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header do Perfil */}
                <div className="profile-header-card">
                    <div className="profile-identity">
                        {/* Foto do perfil */}
                        <img src={businessData.profileImage} alt="Perfil" className="profile-avatar" />

                        <div className="profile-info">
                            {/* Categoria principal */}
                            <span className="category-badge">{businessData.category}</span>

                            {/* Nome do negócio */}
                            <h1>{businessData.name}</h1>

                            <div className="rating-box">
                                {/* Avaliação */}
                                <span>{businessData.rating}</span>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-half-fill"></i>
                                <span>({businessData.reviewCount} avaliações)</span>
                            </div>

                            {/* Status se esta aberto ou não */}
                            <div className={`business-status ${businessData.isOpen ? 'open' : 'closed'}`}>
                                <span className="dot"></span>
                                {businessData.isOpen ? 'Aberto agora' : 'Fechado'}
                            </div>
                        </div>
                    </div>

                    {/* Botão para chamas no whatsapp */}
                    <div className="profile-actions">
                        <a href={`https://wa.me/${businessData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                            <i className="ri-whatsapp-line"></i> Chamar no Zap
                        </a>
                        <button className="btn-share">
                            <i className="ri-share-forward-line"></i>
                        </button>
                    </div>
                </div>

                {/* Sobre o negocio */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Sobre</h2>
                    </div>
                    <p className="about-text">{businessData.description}</p>
                </section>

                {/* Localização e Horário */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Informações</h2>
                    </div>

                    <div className="info-card">
                        {/* Endereço / Localização */}
                        <div className="info-row">
                            <i className="ri-map-pin-line info-icon"></i>
                            <div className="info-content">
                                <strong>Endereço</strong>
                                <p>{businessData.address}</p>
                                {/* Ver mapa */}
                                <div className="map-preview">
                                    <i className="ri-map-2-fill" style={{ marginRight: '8px' }}></i> Ver no Mapa
                                </div>
                            </div>
                        </div>

                        {/* Horario de funcionamento */}
                        <div className="info-row">
                            <i className="ri-time-line info-icon"></i>
                            <div className="info-content">
                                <strong>Horário de Funcionamento</strong>
                                <p>{businessData.hours.schedule}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Produtos */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Destaques</h2>
                    </div>

                    {/* Lista todos os produtos desse business */}
                    <div className="products-grid">
                        {businessData.products.map(product => (
                            <div key={product.id} className="product-card">
                                {/* Fotos */}
                                <img src={product.image} alt={product.title} className="product-image" />
                                <div className="product-details">
                                    {/* Titulo do anuncio */}
                                    <h3 className="product-title">{product.title}</h3>
                                    {/* Preço */}
                                    <div className="product-price">{product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
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