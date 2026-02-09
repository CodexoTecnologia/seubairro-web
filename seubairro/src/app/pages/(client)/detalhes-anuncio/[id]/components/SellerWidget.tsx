import Link from 'next/link';

interface SellerWidgetProps {
  businessName: string;
  businessLogo: string;
  rating: number;
  businessId: string;
}

export const SellerWidget = ({ 
  businessName, 
  businessLogo, 
  rating,
  businessId 
}: SellerWidgetProps) => {
  return (
    <div className="seller-widget">
      <div className="seller-header">
        <img
          src={businessLogo}
          alt={businessName}
          className="seller-img"
        />
        <div className="seller-info">
          <h4>{businessName}</h4>
          <div className="rating-badge">
            <i className="ri-star-fill"></i> {rating.toFixed(1)}
          </div>
        </div>
      </div>
      
      <Link 
        href={`/pages/perfil-negocio/${businessId}`}
        className="btn-view-profile"
      >
        Ver perfil completo
      </Link>
    </div>
  );
};
