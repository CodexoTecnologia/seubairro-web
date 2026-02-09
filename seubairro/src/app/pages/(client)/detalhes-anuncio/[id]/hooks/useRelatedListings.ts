'use client';

import { useState, useEffect } from 'react';

interface RelatedListing {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface UseRelatedListingsReturn {
  relatedListings: RelatedListing[];
  isLoading: boolean;
}

export const useRelatedListings = (
  listingId: string,
  category: string,
  limit: number = 3
): UseRelatedListingsReturn => {
  const [relatedListings, setRelatedListings] = useState<RelatedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);

      try {
        // TODO: Substituir por chamada real à API
        // const response = await fetch(`/api/listings/related?id=${listingId}&category=${category}&limit=${limit}`);
        // const data = await response.json();
        
        const { mockRelatedListings } = await import('../data');
        
        // Simula delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setRelatedListings(mockRelatedListings.slice(0, limit));
      } catch (err) {
        console.error('Erro ao carregar anúncios relacionados:', err);
        setRelatedListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId && category) {
      fetchRelated();
    }
  }, [listingId, category, limit]);

  return { relatedListings, isLoading };
};
