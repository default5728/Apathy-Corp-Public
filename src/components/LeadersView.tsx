import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LeadersViewProps {
  onBack: () => void;
}

interface LeaderCard {
  role: string;
  name: string;
  tag: string;
  image: string;
  bio: string;
}

const LEADERS: LeaderCard[] = [
  {
    role: 'Owner',
    name: 'Akula Tankist',
    tag: 'ОСНОВАТЕЛЬ & ВЛАДЕЛЕЦ',
    image: '/images/20261010004050_1.jpg',
    bio: 'Стратегическое управление, глобальная безопасность и финансовая структура APATHY CORP.',
  },
  {
    role: 'Co-owner',
    name: 'Sidakk Salvatore',
    tag: 'СОВЛАДЕЛЕЦ',
    image: '/images/sidakk.png',
    bio: 'Контроль производственных линий, логистических маршрутов и корпоративного флота.',
  },
  {
    role: 'DEP OWNER',
    name: 'Sontana Terrokilla',
    tag: 'ЗАМЕСТИТЕЛЬ ВЛАДЕЛЬЦА',
    image: '/images/20261010233419_1.jpg',
    bio: 'Кадровый сектор, координация состава на сервере и надзор за выполнением директив.',
  },
];

export const LeadersView: React.FC<LeadersViewProps> = ({ onBack }) => {
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

      <section className="fade-in-up delay-1">
        <h1 className="section-title" style={{ marginTop: '2rem' }}>
          РУКОВОДСТВО APATHY
        </h1>

        {LEADERS.map((leader) => (
          <div key={leader.name} className="info-wrapper">
            <div className="info-text info-text-top">{leader.role}</div>

            <div className="info-image-container">
              <img src={leader.image} alt={`${leader.name} Photo`} loading="lazy" />
            </div>

            <div className="info-text info-text-bottom">{leader.name}</div>

            <div className="text-[0.7rem] text-[#5a677b] font-['Jura',sans-serif] tracking-[0.3em] uppercase mt-2">
              {leader.tag}
            </div>

            <p className="max-w-xl text-center text-xs text-[#738299] font-mono leading-relaxed mt-3">
              {leader.bio}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};
