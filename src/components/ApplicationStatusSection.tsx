import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { findApplicationByCode } from '../lib/firebase';
import type { CandidateApplication } from '../types';

const STATUS_META: Record<
  CandidateApplication['status'],
  { label: string; className: string }
> = {
  pending: {
    label: 'НА РАССМОТРЕНИИ',
    className: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
  },
  approved: {
    label: 'ПРИНЯТА — С ВАМИ СВЯЖЕТСЯ HR-ОТДЕЛ',
    className: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
  },
  rejected: {
    label: 'ОТКЛОНЕНА',
    className: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
  },
};

export const ApplicationStatusSection: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CandidateApplication | null | 'not_found'>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const normalized = code.trim().toUpperCase();
    if (!/^AP-[A-Z0-9]{6}$/.test(normalized)) {
      setError('Формат кода: AP-XXXXXX (6 символов после AP-)');
      return;
    }
    setLoading(true);
    try {
      const app = await findApplicationByCode(normalized);
      setResult(app || 'not_found');
    } catch {
      setError('База данных временно недоступна. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-12 fade-in-up">
      <article className="data-block">
        <div className="block-header">
          <span className="block-id">04</span>
          <h2 className="block-title">Статус заявки</h2>
        </div>
        <div className="block-content">
          <p className="text-xs text-zinc-400 leading-relaxed font-mono mb-4">
            Введите код, который вы получили после отправки заявки (формат AP-XXXXXX), чтобы
            узнать её текущий статус.
          </p>

          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AP-XXXXXX"
              maxLength={10}
              className="form-input text-sm flex-1 tracking-[0.2em] uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-full border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-['Bruno_Ace_SC',sans-serif] tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-cyan-400" />
              )}
              <span>Проверить</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {result === 'not_found' && (
            <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/10 text-zinc-400 text-xs font-mono">
              Заявка с таким кодом не найдена. Проверьте код — он был показан после отправки
              анкеты.
            </div>
          )}

          {result && result !== 'not_found' && (
            <div
              className={`mt-4 p-4 rounded-xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                STATUS_META[result.status].className
              }`}
            >
              <span className="font-bold tracking-wider">{STATUS_META[result.status].label}</span>
              <span className="opacity-80">
                Ник: <b className="text-white">{result.nick}</b> · подана:{' '}
                {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString('ru-RU') : '—'}
              </span>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};
