import { notFound } from "next/navigation";
import { getPageByUID } from "@/prismic/queries";
import SliceZone from "@/components/SliceZone";

export default async function Page({ params }: { params: Promise<{ locale: string; uid: string }> }) {
	try {
		const { locale, uid } = await params;
		const page = await getPageByUID(locale, uid);
		return (
			<div>
				{page.data.title && <h1 className="text-2xl font-semibold p-4">{page.data.title}</h1>}
				<SliceZone slices={page.data.slices || []} />
			</div>
		);
	} catch {
		notFound();
	}
}
