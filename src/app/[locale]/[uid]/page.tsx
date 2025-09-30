import { notFound } from "next/navigation";
import { getPageByUID } from "@/prismic/queries";
import SliceZone from "@/components/SliceZone";
import type { SliceZoneType } from "@/types/slices";

interface PageData {
	title?: string;
	slices?: SliceZoneType[];
}

export default async function Page({ params }: { params: Promise<{ locale: string; uid: string }> }) {
	try {
		const { locale, uid } = await params;
		const page = await getPageByUID(locale, uid);
		
		// Verificar que sea un documento de tipo "page" antes de acceder a title
		const isPageDocument = page.type === 'page';
		const pageData = isPageDocument ? page.data as PageData : null;
		
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
