import Link from 'next/link';

interface RelatedListing {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface RelatedListingsProps {
  listings: RelatedListing[];
}

export const RelatedListings = ({ listings }: RelatedListingsProps) => {
  if (listings.length === 0) return null;

  return (
    <div className="sidebar-related">
      <h3>Outros anúncios</h3>
      
      <div className="related-vertical-list">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/pages/detalhes-anuncio/${listing.id}`}
            className="mini-card-horizontal"
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="mini-card-img"
            />
            <div className="mc-info">
              <span className="mc-title">{listing.title}</span>
              <span className="mc-price">
                R$ {listing.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
