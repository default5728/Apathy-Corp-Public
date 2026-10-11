import React from 'react';
import { Database, Shield } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'calc' | 'leaders' | 'about';
  onSelectTab: (tab: 'home' | 'calc' | 'leaders' | 'about') => void;
  onBackToIntro: () => void;
  onOpenSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onBackToIntro,
  onOpenSyncModal,
}) => {
  return (
    <header className="sys-header relative z-30">
      <div>
        <button
          onClick={onBackToIntro}
          type="button"
          className="text-inherit no-underline opacity-70 hover:opacity-100 transition-opacity duration-300 font-['Bruno_Ace_SC',sans-serif] text-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>&lt; BACK</span>
        </button>
      </div>

      <nav className="top-nav hidden md:flex items-center gap-3">
        <button
          onClick={() => onSelectTab('about')}
          type="button"
          className={`nav-link cursor-pointer ${currentTab === 'about' ? 'text-white border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-white/10' : ''}`}
        >
          APATHY
        </button>
        <button
          onClick={() => onSelectTab('calc')}
          type="button"
          className={`nav-link cursor-pointer ${currentTab === 'calc' ? 'text-white border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-white/10' : ''}`}
        >
          КАЛЬКУЛЯТОР
        </button>
        <button
          onClick={() => onSelectTab('leaders')}
          type="button"
          className={`nav-link cursor-pointer ${currentTab === 'leaders' ? 'text-white border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-white/10' : ''}`}
        >
          ЛИДЕРЫ
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSyncModal}
          type="button"
          title="Интеграция с порталом персонала (ac) и Firebase"
          className="px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 text-[10px] text-cyan-300 flex items-center gap-1.5 tracking-wider font-mono transition-all cursor-pointer"
        >
          <Database className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">ШЛЮЗ API</span>
        </button>

        <div className="sys-status flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>STATUS:</span>
          <span className="accent-text font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
