'use client';

import { useParams } from 'next/navigation';
import { LoadingState, ErrorState, MainContent } from './components';
import { useListingDetails, useRelatedListings } from './hooks';
import '@/styles/client/detalhes-anuncio/detalhes-anuncio.css';

export default function DetalhesAnuncioPage() {
  const params = useParams();
  const id = params?.id as string;

  const { listing, isLoading, error } = useListingDetails(id);
  const { relatedListings } = useRelatedListings(id, listing?.category || '', 3);

  if (isLoading) return <LoadingState />;
  if (error || !listing) return <ErrorState message={error} />;

  return (
    <MainContent
      listing={listing}
      relatedListings={relatedListings}
      onFavoriteToggle={(isFavorite) => {
        // TODO: Integrar com API de favoritos
        console.log('Favorito:', isFavorite);
      }}
    />
  );
}
