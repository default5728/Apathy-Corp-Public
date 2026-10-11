// Vercel serverless: POST /api/notify-discord
// Шлёт карточку новой заявки в Discord через webhook из переменной окружения
// DISCORD_WEBHOOK_URL. Если переменная не задана — тихо выходим, заявка не страдает.
interface NotifyRequest {
  method?: string;
  body?: {
    nick?: string;
    cid?: string;
    discord?: string;
    publicCode?: string;
  };
}

interface NotifyResponse {
  status: (code: number) => { json: (data: unknown) => void };
}

export default async function handler(req: NotifyRequest, res: NotifyResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  const { nick, cid, discord, publicCode } = req.body || {};

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'APATHY · Приём заявок',
        embeds: [
          {
            title: 'Новая заявка в корпорацию',
            color: 0x22d3ee,
            fields: [
              { name: 'Ник', value: String(nick || '—'), inline: true },
              { name: 'CID', value: String(cid || '—'), inline: true },
              { name: 'Discord', value: String(discord || '—'), inline: true },
              { name: 'Код проверки', value: String(publicCode || '—'), inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    res.status(200).json({ ok: true });
  } catch {
    // Уведомление — best effort: на статус заявки не влияет.
    res.status(200).json({ ok: true });
  }
}
