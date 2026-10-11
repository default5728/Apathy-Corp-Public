import React, { useState } from 'react';
import { X } from 'lucide-react';

interface VehicleCard {
  id: string;
  title: string;
  subtitle: string;
  imgSrc: string;
  desc: string;
}

const VEHICLES: VehicleCard[] = [
  {
    id: '1',
    title: 'Mers Runner',
    subtitle: '1.800 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_1.png',
    desc: 'Рабочий тягач для сбора камня и дерева. Доступен с 3-го ранга.',
  },
  {
    id: '2',
    title: 'Mers v250 W447',
    subtitle: '1.000 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_2.png',
    desc: 'Скоростной фургон для сбора и доставки ресурсов. Доступен с 3-го ранга',
  },
  {
    id: '3',
    title: 'Dogge Run 1500 TRX',
    subtitle: '600 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_3.png',
    desc: 'Тяжелый корпоративный суперпикап для поставок сырья на склады. Доступен с 4-го ранга',
  },
  {
    id: '4',
    title: 'Mers v250 W447',
    subtitle: '1.000 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_4.png',
    desc: 'Скоростной фургон для сбора и доставки ресурсов. Доступен с 3-го ранга',
  },
  {
    id: '5',
    title: 'Rumpo Заказной',
    subtitle: 'Зарезервированный транспорт ( PNG later ) ',
    imgSrc: '/images/rumpo.png',
    desc: 'Скоростной фургон для сбора и доставки ресурсов. Доступен с 3-го ранга',
  },
];

export const FleetSection: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<VehicleCard | null>(null);

  return (
    <section className="gallery-section my-16 fade-in-up delay-5">
      <h2 className="section-title text-center text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase font-['Bruno_Ace_SC',sans-serif] mb-10">
        АВТОПАРК КОРПОРАЦИИ
      </h2>

      <div className="gallery-grid">
        {VEHICLES.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedImg(v)}
            className="gallery-item"
          >
            <img src={v.imgSrc} alt={v.title} loading="lazy" />
            <div className="car-title">
              {v.title}
              <span className="block text-[0.65rem] tracking-[0.25em] opacity-70 mt-1" style={{ fontFamily: 'Jura, sans-serif' }}>
                {v.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl cursor-default"
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImg.imgSrc}
              alt={selectedImg.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-6 bg-zinc-950 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-[#738299] font-mono tracking-widest uppercase">
                  {selectedImg.subtitle}
                </span>
                <h4 className="text-lg font-bold text-white font-['Bruno_Ace_SC',sans-serif]">
                  {selectedImg.title}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">{selectedImg.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
