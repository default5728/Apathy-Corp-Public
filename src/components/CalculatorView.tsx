import React, { useState } from 'react';
import { Calculator, ArrowLeft, Coins } from 'lucide-react';

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
  { id: 'blue_flowers', name: 'Синие цветы', price: 1500, max: 1000, unit: 'шт' },
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
          className="text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity duration-300 font-['Jura',sans-serif] text-[#738299] hover:text-[#d1dce8] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&lt; НАЗАД В ГЛАВНОЕ МЕНЮ</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-[rgba(115,130,153,0.3)] bg-white/[0.02] backdrop-blur-sm text-[#738299] text-[0.7rem] font-['Jura',sans-serif] uppercase tracking-[0.3em] mb-4">
          <Calculator className="w-3.5 h-3.5" />
          <span>Тарифная сетка Radmir RP</span>
        </div>
        <h1 className="section-title !mb-4 text-[#d1dce8]">КАЛЬКУЛЯТОР ДОХОДА</h1>
        <p className="text-xs text-[#5a677b] mt-2 font-mono uppercase tracking-wider">
          Расчёт мгновенной выплаты за сдачу добытых ресурсов на склад APATHY CORP
        </p>
      </div>

      <div className="calc-wrapper">
        {/* Resource Cards */}
        <div>
          {RESOURCES.map((res) => {
            const currentCount = counts[res.id] || 0;
            const subTotal = currentCount * res.price;

            return (
              <div key={res.id} className="calc-row">
                <div className="res-name">
                  {res.name}
                  <span className="res-price">
                    {res.price.toLocaleString('ru-RU')} $ / {res.unit}
                  </span>
                  <span className="res-price">
                    Лимит партии: {res.max} {res.unit}
                  </span>
                </div>

                {/* Volume slider */}
                <div className="res-slider-container">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(res.max, currentCount)}
                    value={currentCount}
                    onChange={(e) => handleCountChange(res.id, parseInt(e.target.value) || 0)}
                    className="calc-slider"
                    aria-label={`${res.name}: количество`}
                  />
                </div>

                {/* Counter Input & Quick Add Buttons */}
                <div className="res-controls">
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={currentCount === 0 ? '' : currentCount}
                    onChange={(e) => handleCountChange(res.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="calc-input"
                  />

                  <button
                    type="button"
                    onClick={() => handleAdd(res.id, 10)}
                    className="calc-chip"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd(res.id, 50)}
                    className="calc-chip"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd(res.id, 100)}
                    className="calc-chip"
                  >
                    +100
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-[9px] text-[#5a677b] uppercase tracking-[0.2em] font-mono mb-1">
                    Сумма
                  </div>
                  <div className="res-total">{subTotal.toLocaleString('ru-RU')} $</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Total Bar */}
        <div className="calc-total-wrapper">
          <div className="total-label">ОБЩИЙ ДОХОД К ВЫПЛАТЕ</div>
          <div className="total-value">{grandTotal.toLocaleString('ru-RU')} $</div>
        </div>

        <div className="reset-btn-container">
          <button
            type="button"
            onClick={handleReset}
            className="btn-glitch !px-8 !py-3 cursor-pointer"
          >
            
            <span className="btn-text">СБРОСИТЬ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
