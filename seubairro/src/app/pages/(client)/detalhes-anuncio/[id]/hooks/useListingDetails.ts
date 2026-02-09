'use client';

import { useState, useEffect } from 'react';

export interface ListingDetails {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string[];
  features: Array<{ icon: string; label: string }>;
  postedAt: string;
  category: string;
  business: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    whatsappNumber: string;
  };
  location: {
    address: string;
    distance: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface UseListingDetailsReturn {
  listing: ListingDetails | null;
  isLoading: boolean;
  error: string | null;
}

export const useListingDetails = (id: string): UseListingDetailsReturn => {
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Substituir por chamada real à API
        // const response = await fetch(`/api/listings/${id}`);
        // const data = await response.json();
        
        // Mock data será importado do arquivo data/mockListingDetails.ts
        const { mockListingDetails } = await import('../data');
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundListing = mockListingDetails.find(l => l.id === id);
        
        if (!foundListing) {
          throw new Error('Anúncio não encontrado');
        }

        setListing(foundListing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar anúncio');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  return { listing, isLoading, error };
};
