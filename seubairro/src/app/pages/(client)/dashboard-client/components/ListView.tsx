'use client'
import React from 'react'
import { ListingData } from './ListingCard'
import ListingCard from './ListingCard'

interface ListViewProps {
    listings: ListingData[]
}

export default function ListView({ listings }: ListViewProps) {
    return (
        <div id="feedView">
            <div className="feed-header-info">
                <h3>Destaques perto de você</h3>
                <span>Ordenado por proximidade <i className="ri-arrow-down-line"></i></span>
            </div>

            <div className="listings-grid">
                {listings.length === 0 ? (
                    <div style={{ 
                        gridColumn: '1/-1', 
                        textAlign: 'center', 
                        padding: '60px', 
                        color: '#94A3B8' 
                    }}>
                        <i className="ri-search-2-line" style={{ 
                            fontSize: '3rem', 
                            marginBottom: '10px', 
                            display: 'block' 
                        }}></i>
                        <p>Nenhum resultado encontrado.</p>
                    </div>
                ) : (
                    listings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))
                )}
            </div>
        </div>
    )
}
