import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';

export async function GET() {
    const lines = [
        'User-agent: *',
        'Disallow:', // allow all
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        'Host: ' + SITE_URL.replace(/^https?:\/\//, ''),
    ];

    return new NextResponse(lines.join('\n'), {
        headers: { 'Content-Type': 'text/plain' },
    });
}
