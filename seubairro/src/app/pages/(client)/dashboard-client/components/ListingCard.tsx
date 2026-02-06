// Cards de anúncios - pendente de consumir a API
// Se for utilizado em business, alterar o local para components gerais

'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'

export interface ListingData {
    id: number
    title: string
    type: string
    category: string
    price: string
    rating: number
    reviews: number
    distance: number
    image: string
}

interface ListingCardProps {
    listing: ListingData
}

export default function ListingCard({ listing }: ListingCardProps) {
    const router = useRouter()

    const handleClick = () => {
        router.push('/pages/detalhes-anuncio')
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        // TODO: Implementar lógica de favoritar
    }

    const typeIcon = listing.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'

    return (
        <Card variant="outlined" padding="none" className="ad-card" onClick={handleClick}>
            <div className="ad-image" style={{ backgroundImage: `url('${listing.image}')` }}>
                <div className="dist-badge">
                    <i className="ri-map-pin-2-fill"></i> {listing.distance} km
                </div>
                <Button variant="ghost" className="fav-btn" onClick={handleFavorite}>
                    <i className="ri-heart-line"></i>
                </Button>
            </div>
            <div className="ad-content">
                <div className="ad-category">
                    <i className={typeIcon} style={{ marginRight: '4px' }}></i>
                    {listing.category}
                </div>
                <h3 className="ad-title">{listing.title}</h3>
                <div className="ad-rating">
                    <i className="ri-star-fill"></i> {listing.rating} <span>({listing.reviews})</span>
                </div>
                <div className="ad-price">{listing.price}</div>
            </div>
        </Card>
    )
}
