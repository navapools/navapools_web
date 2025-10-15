import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Regular expression to detect major social scrapers
const BOT_UA_RE = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot/i;

const nextIntl = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Single middleware: run bot detection/rewrites first, then delegate to next-intl
export async function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  const url = req.nextUrl.clone();

  // Only apply rewrite for GET requests from recognized bots
  if (req.method === 'GET' && BOT_UA_RE.test(ua)) {
    // Rewrite bots to the dynamic OG API so they receive page-specific metadata.
    const original = req.nextUrl.pathname + (req.nextUrl.search || '');
    url.pathname = '/api/og';
    url.search = `originalPath=${encodeURIComponent(original)}`;
    return NextResponse.rewrite(url);
  }

  // Otherwise, let next-intl handle locale middleware behavior
  return nextIntl(req);
}

export const config = {
  matcher: ['/', '/:path*'],
};
