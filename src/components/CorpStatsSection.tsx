import React, { useEffect, useState } from 'react';
import {
  subscribeOnlineCount,
  subscribePublicStats,
  type CorpPublicStats,
} from '../lib/corpFirebase';

const fmtMoney = (n: number) => '$' + n.toLocaleString('ru-RU');

export const CorpStatsSection: React.FC = () => {
  const [stats, setStats] = useState<CorpPublicStats | null>(null);
  const [online, setOnline] = useState<number | null>(null);

  // Цифры ведёт портал: он пишет зеркало в public_stats/main и биконы в public_presence.
  useEffect(() => {
    const unsubStats = subscribePublicStats(setStats);
    const unsubOnline = subscribeOnlineCount(setOnline);
    return () => {
      unsubStats();
      unsubOnline();
    };
  }, []);

  const cells: { label: string; value: string }[] = [
    { label: 'Казна корпорации', value: stats ? fmtMoney(stats.treasuryBalance) : '—' },
    {
      label: 'Добыто ресурсов',
      value: stats ? `${stats.totalMinedItems.toLocaleString('ru-RU')} шт.` : '—',
    },
    { label: 'Штат', value: stats ? `${stats.staffTotal.toLocaleString('ru-RU')} чел.` : '—' },
  ];

  return (
    <section className="my-12 fade-in-up">
      <article className="data-block">
        <div className="block-header">
          <span className="block-id">00</span>
          <h2 className="block-title">Корпорация в цифрах</h2>
        </div>
        <div className="block-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cells.map((c) => (
              <div key={c.label} className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-mono">
                  {c.label}
                </div>
                <div className="text-xl font-bold text-white font-['Bruno_Ace_SC',sans-serif] mt-2 break-words">
                  {c.value}
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-mono">
                Сейчас в сети
              </div>
              <div className="text-xl font-bold text-white font-['Bruno_Ace_SC',sans-serif] mt-2 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                {online === null ? '—' : online}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
