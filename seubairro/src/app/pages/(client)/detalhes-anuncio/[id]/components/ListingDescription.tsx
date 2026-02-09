interface Feature {
  icon: string;
  label: string;
}

interface ListingDescriptionProps {
  description: string[];
  features: Feature[];
}

export const ListingDescription = ({ description, features }: ListingDescriptionProps) => {
  return (
    <section className="description-section">
      <h3>Sobre este item</h3>
      
      {description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      {features.length > 0 && (
        <div className="features-compact">
          {features.map((feature, index) => (
            <span key={index}>
              <i className={feature.icon}></i>
              {feature.label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
