'use client'
import React, { useState } from 'react'
import ListingForm from './components/listing-form'
import '@/styles/business/create-anuncio/create-anuncio.css'

export default function CriarAnuncioPage() {
    const [adType, setAdType] = useState<'product' | 'service'>('product')

    return (
        <div className="create-ad-container">
            <header className="page-header">
                <h1>Criar Novo Anúncio</h1>
            </header>
            <div className="type-selector">
                <button
                    className={`type-btn ${adType === 'product' ? 'active' : ''}`}
                    onClick={() => setAdType('product')}
                >
                    <i className="ri-shopping-bag-3-line"></i> Produto
                </button>
                <button
                    className={`type-btn ${adType === 'service' ? 'active' : ''}`}
                    onClick={() => setAdType('service')}
                >
                    <i className="ri-hammer-line"></i> Serviço
                </button>
            </div>
            <ListingForm type={adType} />
        </div>
    )
}