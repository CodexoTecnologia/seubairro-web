import { ListingDetails } from '../hooks';
import {
  ImageGallery,
  ListingHeader,
  ListingDescription,
  SellerWidget,
  LocationWidget,
  SafetyTip,
  RelatedListings,
  Breadcrumbs,
} from './';

interface MainContentProps {
  listing: ListingDetails;
  relatedListings: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
  }>;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export const MainContent = ({ 
  listing, 
  relatedListings, 
  onFavoriteToggle 
}: MainContentProps) => {
  const breadcrumbItems = [
    { label: 'Início', href: '/pages/dashboard-client' },
    { label: listing.category, href: `/pages/dashboard-client?category=${listing.category}` },
    { label: listing.title.split(' ').slice(0, 2).join(' ') },
  ];

  return (
    <main className="ad-page-container">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="ad-layout-grid">
        {/* Coluna Esquerda */}
        <div className="left-column">
          <ImageGallery images={listing.images} title={listing.title} />

          <ListingHeader
            title={listing.title}
            price={listing.price}
            postedAt={listing.postedAt}
            whatsappNumber={listing.business.whatsappNumber}
            onFavoriteToggle={onFavoriteToggle}
          />

          <ListingDescription
            description={listing.description}
            features={listing.features}
          />
        </div>

        {/* Sidebar Direita */}
        <aside className="right-sidebar">
          <SellerWidget
            businessName={listing.business.name}
            businessLogo={listing.business.logo}
            rating={listing.business.rating}
            businessId={listing.business.id}
          />

          <LocationWidget
            address={listing.location.address}
            distance={listing.location.distance}
            coordinates={listing.location.coordinates}
          />

          <SafetyTip />

          <RelatedListings listings={relatedListings} />
        </aside>
      </div>
    </main>
  );
};
