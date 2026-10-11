import React from 'react';
import { Shield, ArrowLeft, Award, Crown } from 'lucide-react';

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
          className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer font-['Bruno_Ace_SC',sans-serif] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&lt; НАЗАД В ГЛАВНОЕ МЕНЮ</span>
        </button>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Crown className="w-3.5 h-3.5 text-cyan-400" />
          <span>КОМАНДНЫЙ СОСТАВ КОРПОРАЦИИ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-white uppercase font-['Bruno_Ace_SC',sans-serif]">
          РУКОВОДСТВО APATHY
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Высший командный состав и уполномоченные лица корпорации
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {LEADERS.map((leader, idx) => (
          <div
            key={leader.name}
            className="group relative rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-400/50 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
          >
            <div className="text-[11px] font-bold text-cyan-400 font-['Bruno_Ace_SC',sans-serif] tracking-widest uppercase mb-4">
              {leader.role}
            </div>

            <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-cyan-400/60 transition-all duration-300 shadow-2xl mb-5">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <h3 className="text-lg font-bold text-white tracking-wider font-['Bruno_Ace_SC',sans-serif]">
              {leader.name}
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1 mb-3">
              {leader.tag}
            </span>

            <p className="text-xs text-zinc-400 font-mono leading-relaxed mt-auto pt-3 border-t border-white/5">
              {leader.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
