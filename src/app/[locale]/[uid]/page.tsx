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
}

interface PrismicPage {
	id?: string;
	uid?: string;
	type?: string;
	data?: PageData;
	alternate_languages?: AlternateLanguage[];
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
			},
			robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
		};

		return metadata;
	} catch {
		return { title: 'NavaPools' };
	}
}
