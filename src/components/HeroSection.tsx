import React from 'react';
import { Send, Users } from 'lucide-react';

interface HeroSectionProps {
  onOpenApply: () => void;
  pendingCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApply, pendingCount = 0 }) => {
  return (
    <section className="hero relative my-16 sm:my-24 text-center">
      {/* Glitch Main Title */}
      <div className="flex justify-center w-full mb-4">
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
      <div className="hero-actions flex gap-4 justify-center items-center flex-wrap mt-8">
        <button
          type="button"
          onClick={onOpenApply}
          className="btn-glitch btn-apply group cursor-pointer"
        >
          <span className="btn-text flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5" />
            ОТПРАВИТЬ ЗАЯВКУ
          </span>
          <span className="btn-decor">_</span>
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/20 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>В базе: {pendingCount} заявок на рассмотрении</span>
        </div>
      )}
    </section>
  );
};
