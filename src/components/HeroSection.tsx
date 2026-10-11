import React from 'react';
import { Send, Users } from 'lucide-react';

interface HeroSectionProps {
  onOpenApply: () => void;
  pendingCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApply, pendingCount = 0 }) => {
  return (
    <section className="hero relative !my-16 sm:!my-24 text-center">
      {/* Glitch Main Title */}
      <div className="flex justify-center w-full !mb-4 fade-in-up delay-1">
        <h1
          style={{ fontFamily: "'Space Age', sans-serif" }}
          className="glitch-title"
        >
          Apathy
        </h1>
      </div>

      {/* Subtitle */}
      <p className="subtitle text-zinc-400">
        Эмоции мешают бизнесу. Корпорация на Radmir RP.
      </p>

      {/* Hero Actions (Notice: Empty "_" button is removed completely as requested!) */}
      <div className="hero-actions flex gap-4 justify-center items-center flex-wrap !mt-8 fade-in-up delay-3">
        <button
          type="button"
          onClick={onOpenApply}
          className="btn-glitch btn-apply group cursor-pointer"
        >
          <span className="btn-text flex items-center gap-2">
            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            ОТПРАВИТЬ ЗАЯВКУ
          </span>
          <span className="btn-decor">_</span>
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="!mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded border border-[rgba(115,130,153,0.3)] bg-white/[0.02] backdrop-blur-sm text-[10px] text-[#738299] font-['Jura',sans-serif] tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#738299] animate-pulse" />
          <span>В базе: {pendingCount} заявок на рассмотрении</span>
        </div>
      )}
    </section>
  );
};
