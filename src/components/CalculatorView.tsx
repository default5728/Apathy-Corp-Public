import React, { useState } from 'react';
import { Calculator, RotateCcw, ArrowLeft, Coins } from 'lucide-react';

interface ResourceItem {
  id: string;
  name: string;
  price: number;
  max: number;
  unit: string;
}

const RESOURCES: ResourceItem[] = [
  { id: 'stone', name: 'Камень', price: 5000, max: 1000, unit: 'шт' },
  { id: 'wood', name: 'Дерево', price: 2500, max: 1000, unit: 'шт' },
  { id: 'red_flowers', name: 'Красные цветы', price: 1500, max: 1000, unit: 'шт' },
  { id: 'blue_flowers', name: 'Синие цветы', price: 1400, max: 1000, unit: 'шт' },
  { id: 'pink_flowers', name: 'Розовые цветы', price: 1500, max: 1000, unit: 'шт' },
];

interface CalculatorViewProps {
  onBack: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ onBack }) => {
  const [counts, setCounts] = useState<Record<string, number>>({
    stone: 0,
    wood: 0,
    red_flowers: 0,
    blue_flowers: 0,
    pink_flowers: 0,
  });

  const handleCountChange = (id: string, value: number) => {
    const val = Math.max(0, Math.min(2000, isNaN(value) ? 0 : value));
    setCounts((prev) => ({ ...prev, [id]: val }));
  };

  const handleAdd = (id: string, amount: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.min(2000, (prev[id] || 0) + amount),
    }));
  };

  const handleReset = () => {
    setCounts({
      stone: 0,
      wood: 0,
      red_flowers: 0,
      blue_flowers: 0,
      pink_flowers: 0,
    });
  };

  const grandTotal = RESOURCES.reduce((acc, res) => {
    return acc + (counts[res.id] || 0) * res.price;
  }, 0);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span>Тарифная сетка Radmir RP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-white uppercase font-['Bruno_Ace_SC',sans-serif]">
          КАЛЬКУЛЯТОР ДОХОДА
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Расчёт мгновенной выплаты за сдачу добытых ресурсов на склад APATHY CORP
        </p>
      </div>

      {/* Resource Cards */}
      <div className="space-y-4">
        {RESOURCES.map((res) => {
          const currentCount = counts[res.id] || 0;
          const subTotal = currentCount * res.price;

          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-400/30 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-['Bruno_Ace_SC',sans-serif]">
                    {res.name}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300 font-mono">
                    {res.price.toLocaleString('ru-RU')} $ / {res.unit}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-1">
                  Лимит партии: {res.max} {res.unit}
                </div>
              </div>

              {/* Counter Input & Quick Add Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={currentCount === 0 ? '' : currentCount}
                  onChange={(e) => handleCountChange(res.id, parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-24 px-3 py-2 rounded-lg bg-black border border-white/20 text-white font-mono text-center text-sm focus:border-cyan-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleAdd(res.id, 10)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdd(res.id, 50)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
                >
                  +50
                </button>
                <button
                  type="button"
                  onClick={() => handleAdd(res.id, 100)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
                >
                  +100
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[130px]">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  Сумма
                </div>
                <div className="text-lg font-bold text-cyan-300 font-mono">
                  {subTotal.toLocaleString('ru-RU')} $
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Total Bar */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-cyan-950/20 to-zinc-950 border border-cyan-400/40 shadow-[0_0_35px_rgba(34,211,238,0.15)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#89949f] font-['Bruno_Ace_SC',sans-serif]">
            ОБЩИЙ ДОХОД К ВЫПЛАТЕ
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            {grandTotal.toLocaleString('ru-RU')} $
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>СБРОСИТЬ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
