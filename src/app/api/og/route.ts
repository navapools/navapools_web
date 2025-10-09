import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// A minimal OG provider: accepts originalPath query param and returns an HTML document
// with basic Open Graph and Twitter meta tags. This is enough for social scrapers to
// receive a 200 response with OG tags while we later enhance it to fetch from Prismic.

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const original = url.searchParams.get('originalPath') || '/';

  // Basic metadata — later we can fetch Prismic by originalPath to populate these
  const title = 'Nava Pools';
  const description = 'Nava Pools — quality pool solutions';
  const siteUrl = 'https://navapools.com';
  const pageUrl = new URL(original, siteUrl).toString();
  const image = `${siteUrl}/NavaPools_logo.png`; // public fallback

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
