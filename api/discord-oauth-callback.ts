// Vercel serverless: GET /api/discord-oauth-callback
// Шаг 2 OAuth-верификации: проверяем state-cookie, меняем code на токен, узнаём ID
// и имя кандидата, добавляем его на сервер корпорации (guilds.join) и возвращаем на сайт
// с ?dc=ok&dcId=...&dcName=... — ApplyModal восстановит черновик и откроется сам.
const SITE_URL = 'https://ac-p.vercel.app';
const CALLBACK_URL = 'https://ac-p.vercel.app/api/discord-oauth-callback';
const DISCORD_API = 'https://discord.com/api/v10';

interface VercelRequest {
  method?: string;
  headers: { cookie?: string };
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  redirect: (status: number, url: string) => void;
}

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

function readStateCookie(cookieHeader?: string): string {
  if (!cookieHeader) return '';
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === 'dc_oauth_state') return part.slice(idx + 1).trim();
  }
  return '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fail = () => {
    // Гасим state-cookie, чтобы недоделанную попытку нельзя было переиспользовать.
    res.setHeader('Set-Cookie', 'dc_oauth_state=; Path=/api/discord-oauth-callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    res.redirect(302, `${SITE_URL}/?dc=err`);
  };

  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!clientId || !clientSecret) return fail();

    // Отказ пользователя на странице согласия Discord приходит как ?error=...
    if (first(req.query.error)) return fail();

    const code = first(req.query.code);
    const state = first(req.query.state);
    const cookieState = readStateCookie(req.headers.cookie);
    // 128-бит случайный state: простое сравнение строк достаточно, тайминг-атака нереалистична.
    const sameState = state.length === cookieState.length && state === cookieState;
    if (!code || !sameState) return fail();

    const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: CALLBACK_URL,
      }),
    });
    if (!tokenRes.ok) return fail();
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    const accessToken = String(tokenJson.access_token || '');
    if (!accessToken) return fail();

    const meRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!meRes.ok) return fail();
    const me = (await meRes.json()) as { id?: string; username?: string; global_name?: string };
    const userId = String(me.id || '');
    const userName = String(me.global_name || me.username || 'DiscordUser').slice(0, 64);
    if (!userId) return fail();

    // Добавляем кандидата на сервер: ЛС от бота доставляется только участникам сервера.
    // Уже состоящий в сервере получит 204 — тоже норм.
    if (guildId && botToken) {
      await fetch(`${DISCORD_API}/guilds/${guildId}/members/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      }).catch(() => {});
    }

    res.setHeader('Set-Cookie', 'dc_oauth_state=; Path=/api/discord-oauth-callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    const back = new URLSearchParams({ dc: 'ok', dcId: userId, dcName: userName });
    res.redirect(302, `${SITE_URL}/?${back.toString()}`);
  } catch {
    fail();
  }
}
