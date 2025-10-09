import { NextResponse } from 'next/server';
import { getAllPages } from '@/prismic/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';
const LOCALES = ['en', 'es'];

interface SitemapUrl {
    url: string;
    last_publication_date?: string | null;
}

function generateSiteMapXml(urls: SitemapUrl[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.url}</loc>
    ${u.last_publication_date ? `<lastmod>${new Date(u.last_publication_date).toISOString()}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;
}

// Simple in-memory cache (node server memory). TTL in seconds via NEXT_PUBLIC_SITEMAP_TTL, default 3600s.
let cachedSitemap: { xml: string; expiresAt: number } | null = null;

export async function GET() {
    const ttl = Number(process.env.NEXT_PUBLIC_SITEMAP_TTL || 3600);
    const now = Date.now();

    if (cachedSitemap && cachedSitemap.expiresAt > now) {
        return new NextResponse(cachedSitemap.xml, {
            status: 200,
            headers: { 'Content-Type': 'application/xml', 'X-Cache': 'HIT' },
        });
    }

    try {
        const allUrls: SitemapUrl[] = [];

        for (const locale of LOCALES) {
            const pages = await getAllPages(locale);
            // Ensure home per locale is included
            allUrls.push({ url: `/${locale}` });
            pages.forEach((p: SitemapUrl) => allUrls.push({ url: p.url, last_publication_date: p.last_publication_date }));
        }

        const xml = generateSiteMapXml(allUrls);

        cachedSitemap = { xml, expiresAt: now + ttl * 1000 };

        return new NextResponse(xml, {
            status: 200,
            headers: { 'Content-Type': 'application/xml', 'X-Cache': 'MISS' },
        });
    } catch (err) {
        console.error('Error generating sitemap:', err);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
