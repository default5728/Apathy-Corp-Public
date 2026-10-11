import React, { useState, useEffect } from 'react';
import { CandidateApplication } from '../types';
import {
  Database,
  ExternalLink,
  Check,
  Copy,
  RefreshCw,
  Send,
  Shield,
  Layers,
  Sparkles,
  X,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface StaffSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffSyncModal: React.FC<StaffSyncModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'api' | 'staff_code'>('queue');
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.warn('Failed to fetch applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (e) {
      console.warn('Failed to update status:', e);
    }
  };

  const staffIntegrationCode = `// Вставьте этот код во второй сайт (портал персонала: https://github.com/default5728/ac.git)
// Например, в src/components/staff/StaffHrManager.tsx или отдельную вкладку "Заявки":

import React, { useEffect, useState } from 'react';

export const StaffApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      // Запрос к публичному сайту (или через прокси):
      const res = await fetch('/api/applications?status=pending');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    const interval = setInterval(loadApplications, 15000); // Автообновление каждые 15 сек
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Входящие анкеты кандидатов</h3>
      {loading ? <p>Загрузка...</p> : (
        applications.map((app) => (
          <div key={app.id} className="p-4 bg-zinc-900 border border-white/10 rounded-xl">
            <div className="font-bold text-white">{app.nick} (CID: {app.cid})</div>
            <div className="text-xs text-zinc-400">Тел: {app.phone} · Discord: {app.discord}</div>
            <a href={app.docs} target="_blank" className="text-cyan-400 text-xs underline">
              Скрин документов
            </a>
          </div>
        ))
      )}
    </div>
  );
};`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Bruno_Ace_SC',sans-serif] uppercase tracking-wider flex items-center gap-2">
                Шлюз Синхронизации Заявок
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE API
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Связь между публичным сайтом (ac2) и сайтом персонала (ac) через API & Firebase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-black/40 gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-3.5 px-3 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Очередь заявок ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3.5 px-3 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Эндпоинты API & Firebase</span>
          </button>

          <button
            onClick={() => setActiveTab('staff_code')}
            className={`py-3.5 px-3 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'staff_code'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Код для сайта персонала (ac)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-zinc-400 text-[11px]">
                  Все анкеты кандидатов, отправленные через кнопку «ОТПРАВИТЬ ЗАЯВКУ»:
                </span>
                <button
                  onClick={fetchApplications}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Обновить</span>
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Очередь пуста. Заполните анкету на сайте, чтобы протестировать передачу данных.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{app.nick}</span>
                          <span className="text-cyan-400 text-[11px]">CID: {app.cid}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              app.status === 'approved'
                                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                                : app.status === 'rejected'
                                ? 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
                                : 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300'
                            }`}
                          >
                            {app.status === 'approved'
                              ? 'Одобрено'
                              : app.status === 'rejected'
                              ? 'Отклонено'
                              : 'В обработке'}
                          </span>
                        </div>

                        <div className="text-zinc-400 text-[11px] flex flex-wrap items-center gap-3">
                          <span>Телефон: <strong className="text-white">{app.phone}</strong></span>
                          <span>Discord: <strong className="text-cyan-300">{app.discord}</strong></span>
                          <span>ID: {app.id}</span>
                          <span className="text-zinc-500">
                            {new Date(app.submittedAt).toLocaleTimeString('ru-RU')}
                          </span>
                        </div>

                        <div className="pt-1">
                          <a
                            href={app.docs}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-white text-[11px] underline flex items-center gap-1"
                          >
                            <span>Скриншот документов: {app.docs}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Action buttons for HR */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Принять</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Отклонить</span>
                            </button>
                          </>
                        )}
                        {app.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'pending')}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 text-[10px] cursor-pointer"
                          >
                            Сбросить статус
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  1. POST /api/applications (Отправка анкеты с сайта)
                </h4>
                <div className="p-4 rounded-xl bg-black border border-white/10 relative">
                  <pre className="text-cyan-300 leading-relaxed overflow-x-auto text-[11px]">
{`POST /api/applications
Content-Type: application/json

{
  "nick": "John_Apathy",
  "cid": "7XYZ",
  "phone": "777-888",
  "discord": "apathy_candidate#1234",
  "docs": "https://imgur.com/example"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  2. GET /api/applications (Получение заявок сайтом персонала)
                </h4>
                <div className="p-4 rounded-xl bg-black border border-white/10 relative">
                  <pre className="text-emerald-300 leading-relaxed overflow-x-auto text-[11px]">
{`GET /api/applications?status=pending

Ответ 200 OK:
{
  "success": true,
  "count": 1,
  "applications": [
    {
      "id": "APP-1001",
      "nick": "John_Apathy",
      "cid": "7XYZ",
      "phone": "777-888",
      "discord": "apathy_candidate#1234",
      "docs": "https://imgur.com/example",
      "status": "pending",
      "submittedAt": "2026-10-11T09:40:00.000Z"
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  3. Firebase Firestore Коллекция
                </h4>
                <p className="text-zinc-400 text-[11px] mb-2 leading-relaxed">
                  Проект Firebase: <code className="text-white">beaming-diode-mt86m</code>.
                  Данные записываются в коллекцию <code className="text-cyan-300">applications</code>.
                  Второй сайт (ac) может слушать эту коллекцию в реальном времени через <code className="text-yellow-300">onSnapshot()</code>!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'staff_code' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-[11px]">
                  Готовый React-компонент для вставки в репозиторий <code className="text-white">https://github.com/default5728/ac.git</code>:
                </span>
                <button
                  onClick={() => handleCopy(staffIntegrationCode, 'staff_code')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedKey === 'staff_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать код</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black border border-white/10">
                <pre className="text-cyan-200 leading-relaxed overflow-x-auto text-[11px]">
                  {staffIntegrationCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
