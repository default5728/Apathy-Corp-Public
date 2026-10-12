// Vercel serverless: GET /api/discord-oauth-start
// Шаг 1 OAuth-верификации Discord: выдаёт state-cookie и уводит кандидата на страницу
// согласия Discord (scope identify + guilds.join — бот добавит его на сервер, чтобы
// гарантированно смог написать в ЛС реквизиты после решения HR).
const CALLBACK_URL = 'https://ac-p.vercel.app/api/discord-oauth-callback';

interface VercelRequest {
  method?: string;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  redirect: (status: number, url: string) => void;
}

function randomHexState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('Discord OAuth is not configured');
    return;
  }

  const state = randomHexState();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: CALLBACK_URL,
    response_type: 'code',
    scope: 'identify guilds.join',
    state,
  });

  // Cookie читает только callback (HttpOnly), живёт 10 минут — как раз на время согласия.
  res.setHeader(
    'Set-Cookie',
    `dc_oauth_state=${state}; Path=/api/discord-oauth-callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  res.redirect(302, `https://discord.com/oauth2/authorize?${params.toString()}`);
}
