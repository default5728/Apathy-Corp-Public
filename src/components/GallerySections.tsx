import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  imgSrc: string;
  title: string;
}

const FACTORY_IMAGES: GalleryImage[] = [
  { imgSrc: '/images/factory_1_crop.png', title: 'Палето-бей' },
  { imgSrc: '/images/factory_2_crop.png', title: 'Ла-меса' },
];

const HQ_IMAGES: GalleryImage[] = [{ imgSrc: '/images/hq_crop.png', title: 'Чумаш' }];

const GalleryRows: React.FC<{
  title: string;
  images: GalleryImage[];
  onOpen: (img: GalleryImage) => void;
  minColumn?: number;
}> = ({ title, images, onOpen, minColumn }) => (
  <section className="gallery-section fade-in-up" style={{ marginTop: '3rem' }}>
    <h2 className="section-title">{title}</h2>
    <div
      className="gallery-grid"
      style={minColumn ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minColumn}px, 1fr))` } : undefined}
    >
      {images.map((img) => (
        <div key={img.imgSrc} className="gallery-item" onClick={() => onOpen(img)}>
          <img src={img.imgSrc} alt={img.title} loading="lazy" />
          <div className="car-title">{img.title}</div>
        </div>
      ))}
    </div>
  </section>
);

export const GallerySections: React.FC = () => {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <GalleryRows title="Местоположения заводов" images={FACTORY_IMAGES} onOpen={setSelected} minColumn={350} />
      <GalleryRows
        title="Штаб квартира-Хранилище"
        images={HQ_IMAGES}
        onOpen={setSelected}
        minColumn={350}
      />

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-5xl w-full cursor-default">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selected.imgSrc}
              alt={selected.title}
              className="w-full max-h-[80vh] object-contain bg-black border border-white/10 rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};
