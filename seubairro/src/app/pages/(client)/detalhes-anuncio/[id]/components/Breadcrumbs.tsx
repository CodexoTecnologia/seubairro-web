import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="breadcrumbs-container">
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <i className="ri-arrow-right-s-line"></i>
          )}
        </div>
      ))}
    </div>
  );
};
