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
          className={`nav-link cursor-pointer ${currentTab === 'about' ? 'text-[#d1dce8] border-[#5a677b] shadow-[0_0_15px_rgba(90,103,123,0.35)] bg-white/5' : ''}`}
        >
          APATHY
        </button>
        <button
          onClick={() => onSelectTab('calc')}
          type="button"
          className={`nav-link cursor-pointer ${currentTab === 'calc' ? 'text-[#d1dce8] border-[#5a677b] shadow-[0_0_15px_rgba(90,103,123,0.35)] bg-white/5' : ''}`}
        >
          КАЛЬКУЛЯТОР
        </button>
        <button
          onClick={() => onSelectTab('leaders')}
          type="button"
          className={`nav-link cursor-pointer ${currentTab === 'leaders' ? 'text-[#d1dce8] border-[#5a677b] shadow-[0_0_15px_rgba(90,103,123,0.35)] bg-white/5' : ''}`}
        >
          ЛИДЕРЫ
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSyncModal}
          type="button"
          title="Интеграция с порталом персонала (ac) и Firebase"
          className="px-2.5 py-1 rounded-md border border-[rgba(115,130,153,0.35)] bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#5a677b] text-[10px] text-[#738299] flex items-center gap-1.5 tracking-wider font-mono transition-all cursor-pointer"
        >
          <Database className="w-3 h-3" />
          <span className="hidden sm:inline">ШЛЮЗ API</span>
        </button>

        <div className="sys-status flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#738299] animate-pulse" />
          <span>STATUS:</span>
          <span className="accent-text font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
