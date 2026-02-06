'use client'
import React from 'react'
import '@/styles/business/public-profile/public-profile.css'
export default function BusinessPerfilPage() {
    const businessData = {
        name: "Mercadinho da Vila",
        category: "Alimentação e Bebidas",
        coverImage: "https://placehold.co/1200x300",
        profileImage: "https://placehold.co/200",
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
            { id: 1, title: "Pão Francês Fresquinho", price: "R$ 12,90/kg", image: "https://placehold.co/200" },
            { id: 2, title: "Leite Integral", price: "R$ 4,50", image: "https://placehold.co/200" },
            { id: 3, title: "Café Torrado", price: "R$ 18,90", image: "https://placehold.co/200" },
            { id: 4, title: "Queijo Mussarela", price: "R$ 45,90/kg", image: "https://placehold.co/200" }
        ]
    }
    return (
        <div className="public-profile-container">
            { }
            <div className="profile-cover-wrapper">
                <img src={businessData.coverImage} alt="Capa" className="cover-image" />
            </div>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                { }
                <div className="profile-header-card">
                    <div className="profile-identity">
                        { }
                        <img src={businessData.profileImage} alt="Perfil" className="profile-avatar" />
                        <div className="profile-info">
                            { }
                            <span className="category-badge">{businessData.category}</span>
                            { }
                            <h1>{businessData.name}</h1>
                            <div className="rating-box">
                                { }
                                <span>{businessData.rating}</span>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-half-fill"></i>
                                <span>({businessData.reviewCount} avaliações)</span>
                            </div>
                            { }
                            <div className={`business-status ${businessData.isOpen ? 'open' : 'closed'}`}>
                                <span className="dot"></span>
                                {businessData.isOpen ? 'Aberto agora' : 'Fechado'}
                            </div>
                        </div>
                    </div>
                    { }
                    <div className="profile-actions">
                        <a href={`https://wa.me/${businessData.whatsapp}`} target="_blank" className="btn-whatsapp">
                            <i className="ri-whatsapp-line"></i> Chamar no Zap
                        </a>
                        <button className="btn-share">
                            <i className="ri-share-forward-line"></i>
                        </button>
                    </div>
                </div>
                { }
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Sobre</h2>
                    </div>
                    <p className="about-text">{businessData.description}</p>
                </section>
                { }
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Informações</h2>
                    </div>
                    <div className="info-card">
                        { }
                        <div className="info-row">
                            <i className="ri-map-pin-line info-icon"></i>
                            <div className="info-content">
                                <strong>Endereço</strong>
                                <p>{businessData.address}</p>
                                { }
                                <div className="map-preview">
                                    <i className="ri-map-2-fill" style={{ marginRight: '8px' }}></i> Ver no Mapa
                                </div>
                            </div>
                        </div>
                        { }
                        <div className="info-row">
                            <i className="ri-time-line info-icon"></i>
                            <div className="info-content">
                                <strong>Horário de Funcionamento</strong>
                                <p>{businessData.hours.schedule}</p>
                            </div>
                        </div>
                    </div>
                </section>
                { }
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Destaques</h2>
                    </div>
                    { }
                    <div className="products-grid">
                        {businessData.products.map(product => (
                            <div key={product.id} className="product-card">
                                { }
                                <img src={product.image} alt={product.title} className="product-image" />
                                <div className="product-details">
                                    { }
                                    <h3 className="product-title">{product.title}</h3>
                                    { }
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

