import React, { useState, useEffect } from 'react';
import { GalaxyIntro } from './components/GalaxyIntro';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntelGrid } from './components/IntelGrid';
import { CorpStatsSection } from './components/CorpStatsSection';
import { ApplicationStatusSection } from './components/ApplicationStatusSection';
import { FleetSection } from './components/FleetSection';
import { GallerySections } from './components/GallerySections';
import { ApplyModal } from './components/ApplyModal';
import { CalculatorView } from './components/CalculatorView';
import { LeadersView } from './components/LeadersView';
import { AboutView } from './components/AboutView';
import { fetchApplicationsFromFirestore } from './lib/firebase';
import { useScrollReveal } from './lib/reveal';
import { CandidateApplication } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'calc' | 'leaders' | 'about'>('home');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [pendingAppsCount, setPendingAppsCount] = useState<number>(0);

  useScrollReveal();

  // Ambient cosmic flash dots (as in ac2 script.js)
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'glitch-blocks';
    document.body.appendChild(container);

    const timer = setInterval(() => {
      if (Math.random() > 0.6) {
        const block = document.createElement('div');
        block.className = 'glitch-block';
        const size = Math.random() * 8 + 2;
        block.style.width = `${size}px`;
        block.style.height = `${size}px`;
        block.style.top = `${Math.random() * 100}vh`;
        block.style.left = `${Math.random() * 100}vw`;
        container.appendChild(block);
        setTimeout(() => {
          if (container.contains(block)) container.removeChild(block);
        }, 200);
      }
    }, 150);

    return () => {
      clearInterval(timer);
      container.remove();
    };
  }, []);

  // Live count of applications still waiting for an HR decision
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const apps = await fetchApplicationsFromFirestore();
        if (!cancelled) setPendingAppsCount(apps.filter((a) => a.status === 'pending').length);
      } catch {
        try {
          const res = await fetch('/api/applications?status=pending');
          const data = await res.json();
          if (!cancelled && data.success && typeof data.count === 'number') {
            setPendingAppsCount(data.count);
          }
        } catch {
          /* badge stays at its last value */
        }
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Chrome can ignore the autoplay attribute until the element is re-triggered
  useEffect(() => {
    if (showIntro) return;
    const video = document.querySelector<HTMLVideoElement>('video.video-bg');
    if (!video) return;
    video.play().catch(() => {});
    const onCanPlay = () => video.play().catch(() => {});
    video.addEventListener('canplay', onCanPlay);
    return () => video.removeEventListener('canplay', onCanPlay);
  }, [showIntro]);

  const handleApplicationCreated = () => {
    setPendingAppsCount((prev) => prev + 1);
  };

  if (showIntro) {
    return <GalaxyIntro onEnter={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen text-[#89949F] relative overflow-x-hidden flex flex-col font-mono">
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
              <CorpStatsSection />
              <IntelGrid />
              <ApplicationStatusSection />
              <FleetSection />
              <GallerySections />
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
    </div>
  );
}
