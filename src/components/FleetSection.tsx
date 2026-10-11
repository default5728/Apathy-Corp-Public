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
    title: 'Чумаш · Rumpo Custom',
    subtitle: '1500 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_1.png',
    desc: 'Рабочий тягач для сбора камня и дерева. Доступен со 2-го ранга.',
  },
  {
    id: '2',
    title: 'Speedo Express Heavy',
    subtitle: '2000 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_2.png',
    desc: 'Скоростной фургон для доставки цветочных партий в лабораторию.',
  },
  {
    id: '3',
    title: 'Mule Cargo Transporter',
    subtitle: '3500 КГ ВМЕСТИМОСТЬ',
    imgSrc: '/images/trans_3.png',
    desc: 'Тяжелый корпоративный грузовик для крупных поставок сырья на склады.',
  },
  {
    id: '4',
    title: 'Pfister Neon Executive',
    subtitle: 'ОПЕРАТИВНЫЙ ТРАНСПОРТ',
    imgSrc: '/images/trans_4.png',
    desc: 'Флагманский электрокар руководства корпорации с усиленной броней.',
  },
];

export const FleetSection: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<VehicleCard | null>(null);

  return (
    <section className="gallery-section my-16">
      <h2 className="section-title text-center text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase font-['Bruno_Ace_SC',sans-serif] mb-10">
        АВТОПАРК КОРПОРАЦИИ
      </h2>

      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VEHICLES.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedImg(v)}
            className="gallery-item group relative rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer bg-black/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={v.imgSrc}
                alt={v.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4 bg-gradient-to-t from-black via-zinc-950/90 to-transparent">
              <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mb-1">
                {v.subtitle}
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider font-['Bruno_Ace_SC',sans-serif]">
                {v.title}
              </h3>
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
                <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">
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
