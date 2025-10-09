import { notFound } from "next/navigation";
import { getPageByUID } from "@/prismic/queries";
import SliceZone from "@/components/SliceZone";
import type { SliceZoneType } from "@/types/slices";
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';

interface AlternateLanguage {
	id?: string;
	uid?: string;
	lang?: string;
	type?: string;
}

interface PageData {
	title?: string;
	description?: string;
	noindex?: boolean;
	seo?: { noindex?: boolean };
	meta?: { noindex?: boolean };
	slices?: SliceZoneType[];
	seo_image?: PrismicImage;
	seo_image_square?: PrismicImage;
}

interface PrismicPage {
	id?: string;
	uid?: string;
	type?: string;
	data?: PageData;
	alternate_languages?: AlternateLanguage[];
}

interface PrismicImage {
	url?: string;
	alt?: string;
	dimensions?: { width?: number; height?: number };
}

export default async function Page({ params }: { params: Promise<{ locale: string; uid: string }> }) {
	try {
		const { locale, uid } = await params;
		const page = (await getPageByUID(locale, uid)) as PrismicPage | null;

		// Verificar que sea un documento de tipo "page" antes de acceder a title
		const isPageDocument = page?.type === 'page';
		const pageData = isPageDocument ? page?.data : null;

		return (
			<div>
				{isPageDocument && pageData?.title && <h1 className="text-2xl font-semibold p-4">{pageData.title}</h1>}
				<SliceZone slices={pageData?.slices || []} />
			</div>
		);
	} catch (error) {
		console.error('Error fetching page:', error);
		notFound();
	}
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; uid: string }> }): Promise<Metadata> {
	const { locale, uid } = await params;
	try {
		const page = (await getPageByUID(locale, uid)) as PrismicPage | null;
		if (!page) return { title: 'NavaPools' };

		const isPage = page.type === 'page';
		const title = isPage ? (page.data?.title || `NavaPools`) : 'NavaPools';
		const description = isPage ? (page.data?.description || '') : '';
		const noindex = Boolean(page.data?.noindex || page.data?.seo?.noindex || page.data?.meta?.noindex);

		// Build alternates from Prismic's alternate_languages
		const languages: Record<string, string> = {};
		(page.alternate_languages || []).forEach((alt: AlternateLanguage) => {
			const short = alt.lang ? alt.lang.split('-')[0] : alt.lang || '';
			if (short) languages[short] = `${SITE_URL}/${short}/${alt.uid}`;
		});

		// Ensure canonical points to chosen locale
		const canonical = `${SITE_URL}/${locale}/${uid}`;

	// Helper: try to find a suitable social image in the Prismic document (explicit seo_image, seo_image_square, hero, background, slice images)
		const makeAbsolute = (u?: string) => {
			if (!u) return undefined;
			return u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
		};

		const findImageInSlice = (slice: unknown): PrismicImage | null => {
			if (!slice || typeof slice !== 'object') return null;
			const s = slice as Record<string, unknown>;
			// check common primary keys
			if (s.primary && typeof s.primary === 'object') {
				const primary = s.primary as Record<string, unknown>;
				for (const key of Object.keys(primary)) {
					const val = primary[key] as unknown;
					if (val && typeof val === 'object' && 'url' in (val as Record<string, unknown>)) {
						return val as PrismicImage;
					}
				}
			}
			// check items array
			if (Array.isArray(s.items)) {
				for (const item of s.items as unknown[]) {
					if (!item || typeof item !== 'object') continue;
					for (const key of Object.keys(item as Record<string, unknown>)) {
						const val = (item as Record<string, unknown>)[key] as unknown;
						if (val && typeof val === 'object' && 'url' in (val as Record<string, unknown>)) {
							return val as PrismicImage;
						}
					}
				}
			}
			// direct image fields on slice
			for (const key of Object.keys(s)) {
				const val = s[key] as unknown;
				if (val && typeof val === 'object' && 'url' in (val as Record<string, unknown>)) {
					return val as PrismicImage;
				}
			}
			return null;
		};

		// If editors provided explicit seo images, prefer them
	const landscapeFromPrismic = page.data?.seo_image as PrismicImage | undefined;
	const squareFromPrismic = page.data?.seo_image_square as PrismicImage | undefined;

		const socialImages: { url: string; alt?: string; width?: number; height?: number }[] = [];

		if (landscapeFromPrismic?.url) {
			socialImages.push({ url: makeAbsolute(landscapeFromPrismic.url) || `${SITE_URL}/NavaPools_logo.png`, alt: landscapeFromPrismic.alt || page.data?.title, width: landscapeFromPrismic.dimensions?.width, height: landscapeFromPrismic.dimensions?.height });
		}
		if (squareFromPrismic?.url) {
			socialImages.push({ url: makeAbsolute(squareFromPrismic.url) || `${SITE_URL}/NavaPools_logo.png`, alt: squareFromPrismic.alt || page.data?.title, width: squareFromPrismic.dimensions?.width, height: squareFromPrismic.dimensions?.height });
		}

		// If none explicit, search slices/fields
		if (socialImages.length === 0) {
			const candidates: (PrismicImage | null)[] = [];
			if (page.data) {
				const d = page.data as unknown as Record<string, unknown>;
				for (const key of Object.keys(d)) {
					const val = d[key] as unknown;
					if (val && typeof val === 'object' && 'url' in (val as Record<string, unknown>)) {
						candidates.push(val as PrismicImage);
					}
				}
			}
			const slices = (page.data as PageData | undefined)?.slices;
			if (Array.isArray(slices)) {
				for (const sl of slices) {
					const found = findImageInSlice(sl);
					if (found) candidates.push(found);
				}
			}
			const first = candidates.find(c => c && typeof c.url === 'string') as PrismicImage | undefined;
			if (first && first.url) {
				socialImages.push({ url: makeAbsolute(first.url) || `${SITE_URL}/NavaPools_logo.png`, alt: first.alt || page.data?.title || 'NavaPools', width: first.dimensions?.width, height: first.dimensions?.height });
			}
		}

		// Always ensure at least the site logo is present
		if (socialImages.length === 0) {
			socialImages.push({ url: `${SITE_URL}/NavaPools_logo.png`, alt: page.data?.title || 'NavaPools', width: 1200, height: 630 });
		}

		const metadata: Metadata = {
			title,
			description,
			alternates: {
				canonical,
				languages,
			},
			openGraph: {
				title,
				description,
				url: canonical,
				siteName: 'NavaPools',
				images: socialImages.map(i => ({ url: i.url, alt: i.alt, width: i.width || 1200, height: i.height || 630 })),
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: socialImages.map(i => i.url),
			},
			robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
		};

		return metadata;
	} catch {
		return { title: 'NavaPools' };
	}
}
