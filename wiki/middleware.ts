// Proteção por senha do wiki (Vercel Edge Middleware — HTTP Basic Auth).
// Gate o site inteiro (HTML, busca, imagens). Sem senha configurada = tudo bloqueado.
// Configure no Vercel as env vars: WIKI_USER e WIKI_PASSWORD.
export const config = {
  matcher: ["/((?!favicon.ico|.*\\.(?:png|svg|ico)$).*)"],
};

export default function middleware(req: Request): Response | undefined {
  const USER = process.env.WIKI_USER || "visa";
  const PASS = process.env.WIKI_PASSWORD || "";
  const header = req.headers.get("authorization") || "";

  if (PASS.length > 0 && header.startsWith("Basic ")) {
    let decoded = "";
    try { decoded = atob(header.slice(6)); } catch { decoded = ""; }
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === USER && pass === PASS) return undefined; // libera
  }

  return new Response("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Base de Conocimiento Visa"' },
  });
}
