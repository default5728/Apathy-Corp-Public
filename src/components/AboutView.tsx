import React, { useState } from 'react';
import { ArrowLeft, Building2, Factory, Home, X } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
  onOpenApply: () => void;
}

const ABOUT_IMAGES = [
  '/images/about_1.jpg',
  '/images/about_2.jpg',
  '/images/about_3.jpg',
  '/images/about_4.jpg',
  '/images/about_5.jpg',
  '/images/about_6.jpg',
];

export const AboutView: React.FC<AboutViewProps> = ({ onBack, onOpenApply }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          type="button"
          className="text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity duration-300 text-[#738299] hover:text-[#d1dce8] flex items-center gap-2 cursor-pointer font-['Jura',sans-serif]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&lt; НАЗАД В ГЛАВНОЕ МЕНЮ</span>
        </button>
      </div>

      <div className="fade-in-up delay-1">
        <h1 className="section-title" style={{ marginTop: '2rem' }}>
          О КОРПОРАЦИИ APATHY
        </h1>
        <p className="text-xs text-[#5a677b] -mt-6 mb-8 text-center font-mono uppercase tracking-wider">
          Эмоции мешают бизнесу. Корпорация на сервере Radmir GTA 5 RP.
        </p>
      </div>

      {/* Story Card */}
      <div className="about-text-block fade-in-up delay-2 text-xs sm:text-sm font-mono space-y-4">
        <p>
          <strong className="text-white font-semibold">Apathy Corp</strong> — корпорация на сервере Radmir RP, созданная для тех, кто хочет стабильно и честно зарабатывать в спокойной атмосфере без лишней драмы.
        </p>
        <p>
          Название «Apathy» олицетворяет хладнокровный, взвешенный подход к делу: мы не тратим нервы на пустые конфликты, четко знаем свои цели и эффективно развиваем общее дело. У нас развернуты собственные фабрики, подготовлен надежный парк грузового и легкового транспорта, а также налажен прямой выкуп всех категорий ресурсов.
        </p>
        <p>
          Каждый участник делает свой посильный вклад в производство и гарантированно получает моментальные выплаты без задержек.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in-up delay-3">
        <div className="data-block !p-5 flex flex-col items-start gap-2">
          <Factory className="w-5 h-5 text-[#738299]" />
          <h4 className="text-sm font-bold text-[#d1dce8] font-['Bruno_Ace_SC',sans-serif]">
            Завод 1 · Палето-Бэй
          </h4>
          <p className="text-[11px] text-[#738299] font-mono">
            Первичная переработка камня и лесозаготовки. Круглосуточный цикл.
          </p>
        </div>

        <div className="data-block !p-5 flex flex-col items-start gap-2">
          <Building2 className="w-5 h-5 text-[#738299]" />
          <h4 className="text-sm font-bold text-[#d1dce8] font-['Bruno_Ace_SC',sans-serif]">
            Завод 2 · Ла-Меса
          </h4>
          <p className="text-[11px] text-[#738299] font-mono">
            Биохимическая переработка цветка и фармацевтическое производство.
          </p>
        </div>

        <div className="data-block !p-5 flex flex-col items-start gap-2">
          <Home className="w-5 h-5 text-[#738299]" />
          <h4 className="text-sm font-bold text-[#d1dce8] font-['Bruno_Ace_SC',sans-serif]">
            Штаб-квартира · Дом ***
          </h4>
          <p className="text-[11px] text-[#738299] font-mono">
            Охраняемый особняк, подземный паркинг и координационный центр.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-12 fade-in-up delay-4">
        <h3 className="section-title">ГАЛЕРЕЯ КОРПОРАЦИИ</h3>

        <div className="about-gallery">
          {ABOUT_IMAGES.map((img, i) => (
            <div
              key={img}
              onClick={() => setActiveImage(img)}
              className="gallery-item"
            >
              <img
                src={img}
                alt={`Apathy ${i + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="data-block !p-8 text-center flex flex-col items-center gap-4 mb-12 fade-in-up delay-5">
        <h3 className="text-lg font-bold text-[#d1dce8] font-['Bruno_Ace_SC',sans-serif] uppercase tracking-wider">
          ГОТОВЫ ПРИСОЕДИНИТЬСЯ К НАМ?
        </h3>
        <p className="text-xs text-[#738299] font-mono max-w-lg">
          Заполните анкету кандидата прямо сейчас — данные моментально поступят на рассмотрение руководству.
        </p>
        <button
          onClick={onOpenApply}
          type="button"
          className="btn-submit-apply cursor-pointer"
        >
          ПОДАТЬ ЗАЯВКУ
        </button>
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#8fa0b8] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
