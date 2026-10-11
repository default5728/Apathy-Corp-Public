import React, { useState, useEffect } from 'react';
import { GalaxyIntro } from './components/GalaxyIntro';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntelGrid } from './components/IntelGrid';
import { FleetSection } from './components/FleetSection';
import { ApplyModal } from './components/ApplyModal';
import { CalculatorView } from './components/CalculatorView';
import { LeadersView } from './components/LeadersView';
import { AboutView } from './components/AboutView';
import { StaffSyncModal } from './components/StaffSyncModal';
import { CandidateApplication } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'calc' | 'leaders' | 'about'>('home');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [pendingAppsCount, setPendingAppsCount] = useState<number>(0);

  // Check pending applications count for live badges
  useEffect(() => {
    fetch('/api/applications?status=pending')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.count === 'number') {
          setPendingAppsCount(data.count);
        }
      })
      .catch(() => {});
  }, []);

  const handleApplicationCreated = () => {
    setPendingAppsCount((prev) => prev + 1);
  };

  if (showIntro) {
    return <GalaxyIntro onEnter={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#030407] text-[#89949F] relative overflow-x-hidden flex flex-col font-mono">
      {/* Background Video & CRT/Scanline Layers */}
      <video
        className="video-bg pointer-events-none"
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="crt-overlay" />
      <div className="noise-bg" />

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onBackToIntro={() => setShowIntro(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Dynamic View based on currentTab */}
      <main className="container flex-1">
        {currentTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Planet Backdrop with subtle pulse and glow */}
            <div className="relative">
              <HeroSection
                onOpenApply={() => setIsApplyOpen(true)}
                pendingCount={pendingAppsCount}
              />
              <IntelGrid />
              <FleetSection />
            </div>
          </div>
        )}

        {currentTab === 'calc' && (
          <CalculatorView onBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'leaders' && (
          <LeadersView onBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'about' && (
          <AboutView
            onBack={() => setCurrentTab('home')}
            onOpenApply={() => setIsApplyOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="sys-footer mt-auto py-8 border-t border-white/5 text-center text-[10px] tracking-[0.25em] text-zinc-600 uppercase font-['Bruno_Ace_SC',sans-serif]">
        <div>APATHY CORP &copy; 2026 // RADMIR RP // СИСТЕМА ПРИЕМА ЗАЯВОК</div>
      </footer>

      {/* Recruitment Application Modal */}
      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onApplicationCreated={handleApplicationCreated}
      />

      {/* Staff Sync Gateway Modal */}
      <StaffSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
}
