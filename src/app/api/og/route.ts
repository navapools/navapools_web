import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPageByUID, getSettings } from '@/prismic/queries';

// Parse originalPath and try to extract locale and uid.
function parsePath(original: string) {
  // normalize
  let path = original;
  if (!path.startsWith('/')) path = '/' + path;
  const parts = path.split('/').filter(Boolean);
  // expected: [locale, uid] or [locale]
  if (parts.length === 0) return { locale: 'en', uid: null };
  if (parts.length === 1) return { locale: parts[0], uid: null };
  return { locale: parts[0], uid: parts[1] };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const original = url.searchParams.get('originalPath') || '/';
  const siteUrl = 'https://navapools.com';

  const { locale, uid } = parsePath(original);

  // Default metadata
  let title = 'Nava Pools';
  let description = 'Nava Pools — soluciones y diseño de piscinas.';
  const pageUrl = new URL(original, siteUrl).toString();
  let image = `${siteUrl}/NavaPools_logo.png`;
  let imageWidth: number | null = 1200;
  let imageHeight: number | null = 630;
  let imageAlt = 'Nava Pools';

  try {
    const settings = await getSettings(locale || 'en');
    if (settings?.data?.site_name) title = settings.data.site_name;

    // helper to ensure image URLs are absolute
    const makeAbsolute = (u?: string) => {
      if (!u) return undefined;
      return u.startsWith('http') ? u : `${siteUrl}${u.startsWith('/') ? '' : '/'}${u}`;
    };

    // If no UID provided but a locale is present, attempt to load the locale home page
    // (the app's locale home uses the UID `nava-pools-page`). This ensures bots
    // requesting `/`, `/en` or `/es` receive the same metadata as real users.
    if (!uid) {
      try {
        const homePage = await getPageByUID(locale || 'en', 'nava-pools-page');
        if (homePage) {
          const pdRaw = (homePage as unknown as { data?: unknown }).data;
          const pd = (pdRaw && typeof pdRaw === 'object') ? pdRaw as Record<string, unknown> : {} as Record<string, unknown>;

          const tVal = pd['title'];
          if (typeof tVal === 'string') title = tVal;
          const dVal = pd['description'];
          if (typeof dVal === 'string') description = dVal;

          // Prefer explicit seo_image / seo_image_square on the home page as well
          const seoImgVal = pd['seo_image'];
          if (seoImgVal && typeof seoImgVal === 'object') {
            const seoImg = seoImgVal as Record<string, unknown>;
            const urlVal = seoImg['url'];
            if (typeof urlVal === 'string') {
              image = makeAbsolute(urlVal) || image;
              const altVal = seoImg['alt'];
              if (typeof altVal === 'string') imageAlt = altVal;
              const dims = seoImg['dimensions'];
              if (dims && typeof dims === 'object') {
                const dimsRec = dims as Record<string, unknown>;
                const w = dimsRec['width'];
                const h = dimsRec['height'];
                if (typeof w === 'number') imageWidth = w;
                if (typeof h === 'number') imageHeight = h;
              }
            }
          }
        }
      } catch (err) {
        // ignore — fall back to defaults
      }
    }

    if (uid) {
      const page = await getPageByUID(locale || 'en', uid);
      if (page) {
        const pdRaw = (page as unknown as { data?: unknown }).data;
        const pd = (pdRaw && typeof pdRaw === 'object') ? pdRaw as Record<string, unknown> : {} as Record<string, unknown>;

        const tVal = pd['title'];
        if (typeof tVal === 'string') title = tVal;
        const dVal = pd['description'];
        if (typeof dVal === 'string') description = dVal;

        const seoImgVal = pd['seo_image'];
        if (seoImgVal && typeof seoImgVal === 'object') {
          const seoImg = seoImgVal as Record<string, unknown>;
          const urlVal = seoImg['url'];
          if (typeof urlVal === 'string') {
            image = makeAbsolute(urlVal) || image;
            const altVal = seoImg['alt'];
            if (typeof altVal === 'string') imageAlt = altVal;
            const dims = seoImg['dimensions'];
            if (dims && typeof dims === 'object') {
              const dimsRec = dims as Record<string, unknown>;
              const w = dimsRec['width'];
              const h = dimsRec['height'];
              if (typeof w === 'number') imageWidth = w;
              if (typeof h === 'number') imageHeight = h;
            }
          }
        } else {
          const seoSquareVal = pd['seo_image_square'];
          if (seoSquareVal && typeof seoSquareVal === 'object') {
            const sq = seoSquareVal as Record<string, unknown>;
            const urlVal = sq['url'];
            if (typeof urlVal === 'string') {
              image = makeAbsolute(urlVal) || image;
              const altVal = sq['alt'];
              if (typeof altVal === 'string') imageAlt = altVal;
              const dims = sq['dimensions'];
              if (dims && typeof dims === 'object') {
                const dimsRec = dims as Record<string, unknown>;
                const w = dimsRec['width'];
                const h = dimsRec['height'];
                if (typeof w === 'number') imageWidth = w;
                if (typeof h === 'number') imageHeight = h;
              }
            }
          } else {
            const slicesVal = pd['slices'];
            if (Array.isArray(slicesVal)) {
              for (const s of slicesVal) {
                const sr = (s && typeof s === 'object') ? s as Record<string, unknown> : {} as Record<string, unknown>;
                const primary = sr['primary'];
                if (primary && typeof primary === 'object') {
                  const primaryRec = primary as Record<string, unknown>;
                  for (const key of Object.keys(primaryRec)) {
                    const val = primaryRec[key];
                    if (val && typeof val === 'object') {
                      const valRec = val as Record<string, unknown>;
                      const urlVal = valRec['url'];
                      if (typeof urlVal === 'string') {
                        image = makeAbsolute(urlVal) || image;
                        const altVal = valRec['alt'];
                        if (typeof altVal === 'string') imageAlt = altVal;
                        const dims = valRec['dimensions'];
                        if (dims && typeof dims === 'object') {
                          const dimsRec = dims as Record<string, unknown>;
                          const w = dimsRec['width'];
                          const h = dimsRec['height'];
                          if (typeof w === 'number') imageWidth = w;
                          if (typeof h === 'number') imageHeight = h;
                        }
                        break;
                      }
                    }
                  }
                }
                if (image !== `${siteUrl}/NavaPools_logo.png`) break;
              }
            }
          }
        }

        const metaTitle = pd['meta_title'];
        if (typeof metaTitle === 'string') title = metaTitle;
        const metaDesc = pd['meta_description'];
        if (typeof metaDesc === 'string') description = metaDesc;
      }
    }
  } catch (err) {
    // swallow errors — fallbacks already set
    console.warn('OG API: error fetching Prismic data', err);
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:locale" content="${escapeHtml(locale || 'en')}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(title)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    ${imageWidth ? `<meta property="og:image:width" content="${imageWidth}" />` : ''}
    ${imageHeight ? `<meta property="og:image:height" content="${imageHeight}" />` : ''}
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />

    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Cache for bots: 1 hour; adjust as needed. Use short caching when content may change.
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60',
    },
  });
}
