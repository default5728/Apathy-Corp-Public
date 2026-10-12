// Vercel serverless: POST /api/notify-applicant
// ЛС кандидату от бота APATHY: вердикт HR («принят» + реквизиты входа / «отклонён» + причина).
// Вызывается закрытым порталом (ac-gn3m.vercel.app) с секретом в заголовке x-notify-secret.
// Текст сообщения собирается ТОЛЬКО здесь, на сервере — портал шлёт голые значения.
const DISCORD_API = 'https://discord.com/api/v10';
const PORTAL_ORIGIN = 'https://ac-gn3m.vercel.app';
const LOCAL_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5273',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5273',
];

interface NotifyBody {
  decision?: string;
  discordId?: string;
  publicCode?: string;
  nick?: string;
  cid?: string;
  phone?: string;
  discord?: string;
  pin?: string;
  roleTitle?: string;
  reason?: string;
}

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: NotifyBody;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (data: unknown) => void;
  end: () => void;
}

// Лимит на получателя: 10 ЛС в час — защита от случайного флуда из портала.
const dmHits = new Map<string, number[]>();
function overRateLimit(recipientId: string): boolean {
  const now = Date.now();
  const recent = (dmHits.get(recipientId) || []).filter((t) => now - t < 3600_000);
  recent.push(now);
  dmHits.set(recipientId, recent);
  return recent.length > 10;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = String(req.headers.origin || '');
  if (origin === PORTAL_ORIGIN || LOCAL_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-notify-secret');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }

  const secret = process.env.PORTAL_NOTIFY_SECRET;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!secret || !botToken) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  const providedSecret = String(req.headers['x-notify-secret'] || '');
  if (providedSecret !== secret) {
    res.status(403).json({ ok: false, error: 'Forbidden' });
    return;
  }

  const body = req.body || {};
  const decision = body.decision === 'approved' ? 'approved' : 'rejected';
  const discordId = String(body.discordId || '');
  if (!/^\d{5,25}$/.test(discordId)) {
    res.status(400).json({ ok: false, error: 'Bad discordId' });
    return;
  }
  if (overRateLimit(discordId)) {
    res.status(429).json({ ok: false, error: 'Rate limited' });
    return;
  }

  const clean = (v: unknown, max: number) => String(v || '').replace(/[\r\n]+/g, ' ').slice(0, max);
  const nick = clean(body.nick, 64) || '—';
  const cid = clean(body.cid, 32) || '—';
  const phone = clean(body.phone, 64) || '—';
  const discordTag = clean(body.discord, 64) || '—';
  const pin = clean(body.pin, 32) || '—';
  const roleTitle = clean(body.roleTitle, 48) || 'Сотрудник';
  const reason = clean(body.reason, 500) || 'Причина не указана.';
  const publicCode = clean(body.publicCode, 9);

  const embed =
    decision === 'approved'
      ? {
          title: 'Заявка в корпорацию APATHY — принята',
          color: 0x10b981,
          description: 'Ты зачислен(а) в штат. Реквизиты для входа в закрытый портал корпорации:',
          fields: [
            { name: 'Ник', value: nick, inline: true },
            { name: 'CID', value: cid, inline: true },
            { name: 'Телефон', value: phone, inline: true },
            { name: 'Discord', value: discordTag, inline: true },
            { name: 'PIN-код', value: pin, inline: true },
            { name: 'Роль', value: roleTitle, inline: true },
            ...(publicCode ? [{ name: 'Код проверки заявки', value: publicCode }] : []),
          ],
          footer: { text: 'Вход: ac-gn3m.vercel.app · реквизиты должны совпадать точно' },
          timestamp: new Date().toISOString(),
        }
      : {
          title: 'Заявка в корпорацию APATHY — отклонена',
          color: 0xef4444,
          description: 'К сожалению, твоя заявка на вступление получила отказ.',
          fields: [
            { name: 'Причина', value: reason },
            ...(publicCode ? [{ name: 'Код заявки', value: publicCode }] : []),
          ],
          footer: { text: 'Подать заявку повторно можно на сайте корпорации' },
          timestamp: new Date().toISOString(),
        };

  try {
    const dmRes = await fetch(`${DISCORD_API}/users/@me/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_id: discordId }),
    });
    if (!dmRes.ok) throw new Error(`DM channel ${dmRes.status}`);
    const dm = (await dmRes.json()) as { id?: string };
    if (!dm.id) throw new Error('No DM channel');

    const msgRes = await fetch(`${DISCORD_API}/channels/${dm.id}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!msgRes.ok) throw new Error(`Message ${msgRes.status}`);
    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, error: 'Discord delivery failed' });
  }
}
