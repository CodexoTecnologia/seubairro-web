// Visualização em mapa - pendente de consumir a API e integrar com o OSM

'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { ListingData } from './ListingCard'

interface MapViewProps {
    listings: ListingData[]
}

const mockCoordinates = [
    { t: '30%', l: '40%' },
    { t: '50%', l: '60%' },
    { t: '70%', l: '30%' },
    { t: '20%', l: '70%' },
    { t: '40%', l: '20%' },
    { t: '60%', l: '80%' }
]

export default function MapView({ listings }: MapViewProps) {
    const router = useRouter()

    const handlePinClick = () => {
        router.push('/pages/detalhes-anuncio')
    }

    const handleCenterMap = () => {
        // Implementar lógica de centralizar no usuário > Recentralizar
        console.log('Centralizar mapa')
    }

    return (
        <div className="map-wrapper">
            <div className="simulated-map">
                <div className="map-bg"></div>
                <div id="mapPinsContainer">
                    {listings.map((item, index) => {
                        const pos = mockCoordinates[index % mockCoordinates.length]
                        const typeIcon = item.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'
                        
                        return (
                            <div
                                key={item.id}
                                className="map-pin"
                                style={{ top: pos.t, left: pos.l }}
                                onClick={handlePinClick}
                            >
                                <div className="pin-shape">
                                    <i className={typeIcon}></i>
                                </div>
                                <div className="pin-label">{item.title}</div>
                            </div>
                        )
                    })}
                </div>
                <Button 
                    variant="primary"
                    className="map-overlay-btn" 
                    onClick={handleCenterMap}
                >
                    <i className="ri-focus-3-line"></i> Centralizar em mim
                </Button>
            </div>
        </div>
    )
}
