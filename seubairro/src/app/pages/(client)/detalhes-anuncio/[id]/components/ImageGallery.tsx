'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="gallery-wrapper">
      <div className="main-image-container">
        <img
          src={images[activeIndex]}
          alt={title}
          className="main-image"
        />
        <button className="btn-share" aria-label="Compartilhar">
          <i className="ri-share-forward-line"></i>
        </button>
      </div>

      <div className="thumbs-sidebar">
        {images.map((image, index) => (
          <button
            key={index}
            className={`thumb ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Ver imagem ${index + 1}`}
          >
            <img
              src={image}
              alt={`${title} - foto ${index + 1}`}
              className="thumb-image"
            />
          </button>
        ))}
      </div>
    </section>
  );
};
