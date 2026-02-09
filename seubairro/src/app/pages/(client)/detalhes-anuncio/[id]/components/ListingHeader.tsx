'use client';

import { Button } from '@/components/ui';
import { useState } from 'react';

interface ListingHeaderProps {
  title: string;
  price: number;
  postedAt: string;
  whatsappNumber: string;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export const ListingHeader = ({ 
  title, 
  price, 
  postedAt, 
  whatsappNumber,
  onFavoriteToggle 
}: ListingHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteToggle?.(newState);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Vi seu anúncio: ${title}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="ad-header-compact">
      <div className="header-top">
        <h1>{title}</h1>
        <span className="posted-time">{postedAt}</span>
      </div>

      <div className="price-action-row">
        <div className="price-tag-compact">
          <span className="symbol">R$</span>
          <span className="amount">{price.toFixed(2).replace('.', ',')}</span>
        </div>

        <div className="action-buttons-compact">
          <button 
            className="btn-whatsapp-compact"
            onClick={handleWhatsApp}
          >
            <i className="ri-whatsapp-line"></i> Chamar
          </button>
          
          <button 
            className={`btn-fav-compact ${isFavorite ? 'active' : ''}`}
            onClick={handleFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <i className={isFavorite ? 'ri-heart-fill' : 'ri-heart-line'}></i>
          </button>
        </div>
      </div>
    </section>
  );
};
