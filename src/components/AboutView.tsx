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
          className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer font-['Bruno_Ace_SC',sans-serif] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&lt; НАЗАД В ГЛАВНОЕ МЕНЮ</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-white uppercase font-['Bruno_Ace_SC',sans-serif]">
          О КОРПОРАЦИИ APATHY
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Эмоции мешают бизнесу. Корпорация на сервере Radmir GTA 5 RP.
        </p>
      </div>

      {/* Story Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed space-y-4 mb-10 shadow-xl">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/10 flex flex-col items-start gap-2">
          <Factory className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white font-['Bruno_Ace_SC',sans-serif]">
            Завод 1 · Палето-Бэй
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono">
            Первичная переработка камня и лесозаготовки. Круглосуточный цикл.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/10 flex flex-col items-start gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white font-['Bruno_Ace_SC',sans-serif]">
            Завод 2 · Ла-Меса
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono">
            Биохимическая переработка цветка и фармацевтическое производство.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/10 flex flex-col items-start gap-2">
          <Home className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white font-['Bruno_Ace_SC',sans-serif]">
            Штаб-квартира · Дом ***
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono">
            Охраняемый особняк, подземный паркинг и координационный центр.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider font-['Bruno_Ace_SC',sans-serif] mb-6 text-center">
          ГАЛЕРЕЯ КОРПОРАЦИИ
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ABOUT_IMAGES.map((img, i) => (
            <div
              key={img}
              onClick={() => setActiveImage(img)}
              className="group aspect-[16/10] rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/60 cursor-pointer transition-all duration-300 relative bg-black/50"
            >
              <img
                src={img}
                alt={`Apathy ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl bg-zinc-950 border border-cyan-500/30 text-center flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold text-white font-['Bruno_Ace_SC',sans-serif] uppercase tracking-wider">
          ГОТОВЫ ПРИСОЕДИНИТЬСЯ К НАМ?
        </h3>
        <p className="text-xs text-zinc-400 font-mono max-w-lg">
          Заполните анкету кандидата прямо сейчас — данные моментально поступят на рассмотрение руководству.
        </p>
        <button
          onClick={onOpenApply}
          type="button"
          className="btn-submit-apply px-8 py-3.5 rounded-full cursor-pointer text-xs font-['Bruno_Ace_SC',sans-serif] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105"
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
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 cursor-pointer"
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
