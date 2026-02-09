interface LocationWidgetProps {
  address: string;
  distance: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const LocationWidget = ({ address, distance, coordinates }: LocationWidgetProps) => {
  return (
    <div className="location-widget">
      <div className="loc-head">
        <i className="ri-map-pin-line"></i> {address}
      </div>

      <div className="mini-map-static">
        <i className="ri-map-pin-fill static-pin"></i>
        {/* TODO: Integrar com Google Maps ou Leaflet quando API estiver pronta */}
      </div>

      <p className="distance-text">
        Aprox. {distance.toFixed(1)} km de você
      </p>
    </div>
  );
};
