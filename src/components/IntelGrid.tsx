import React from 'react';

export const IntelGrid: React.FC = () => {
  return (
    <section className="intel-grid !my-12 fade-in-up delay-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 01: Критерии отбора */}
      <article className="data-block">
        <div className="block-header">
          <span className="block-id">01</span>
          <h2 className="block-title">Критерии отбора</h2>
        </div>
        <div className="block-content">
          <ul className="data-list">
            <li>
              <span className="label">Возраст:</span>
              <span>от 5 лет в штате</span>
            </li>
            <li>
              <span className="label">Связь и активность:</span>
              <span className="text-right">Discord + онлайн от 3 ч/сутки</span>
            </li>
          </ul>
        </div>
      </article>

      {/* 02: Активы корпорации */}
      <article className="data-block">
        <div className="block-header">
          <span className="block-id">02</span>
          <h2 className="block-title">Активы корпорации</h2>
        </div>
        <div className="block-content">
          <ul className="data-list">
            <li>
              <span className="label">Автопарк:</span>
              <span>Четыре машины элитного класса</span>
            </li>
            <li>
              <span className="label">База:</span>
              <span>Дом ( Верхний Чумаш )</span>
            </li>
            <li className="block border-b-0 pb-0">
              <span className="label block !mb-1">Заводы корпорации:</span>
              <div className="text-xs text-zinc-400 pl-2 !space-y-0.5">
                <div>• 1 Завод в Палето-Бэй</div>
                <div>• 2 Завод в Ла-меса</div>
              </div>
            </li>
          </ul>
        </div>
      </article>

      {/* 03: Директивы */}
      <article className="data-block">
        <div className="block-header">
          <span className="block-id">03</span>
          <h2 className="block-title">Директивы</h2>
        </div>
        <div className="block-content">
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Никаких извинений. Никаких слабостей. Мы берем то, что принадлежит нам, и устраняем препятствия.
          </p>
        </div>
      </article>
    </section>
  );
};
