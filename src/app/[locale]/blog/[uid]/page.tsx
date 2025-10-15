import { getBlogByUID } from '@/prismic/queries';
import SliceZone from '@/components/SliceZone';
import { PrismicRichText } from '@prismicio/react';
import type { SliceZoneType } from '@/types/slices';

export const revalidate = 60;

export default async function BlogDetail(props: unknown) {
    const { params } = props as { params: Promise<{ locale: string; uid: string }> };
    const { locale, uid } = await params;
    const postRaw = await getBlogByUID(locale, uid);
    const postRec = postRaw as Record<string, unknown> | null;

    if (!postRec) return <div className="p-6">Not found</div>;

    const data = (postRec['data'] as Record<string, unknown>) || {};
    const title = Array.isArray(data['title']) ? ((data['title'] as Array<Record<string, unknown>>)[0]?.text as string) || '' : (data['title'] as string) || '';
    const subtitle = Array.isArray(data['subtitle']) ? ((data['subtitle'] as Array<Record<string, unknown>>)[0]?.text as string) || '' : (data['subtitle'] as string) || '';

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <h2 className="text-lg text-neutral-600 mb-4">{subtitle}</h2>}

            <article className="prose max-w-none">
                {(() => {
                    const body = data.body as unknown;
                    if (Array.isArray(body)) {
                        const looksLikeSlices = body.length > 0 && body.every((it: unknown) => typeof it === 'object' && it !== null && 'slice_type' in (it as Record<string, unknown>));
                        if (looksLikeSlices) {
                            return <SliceZone slices={body as SliceZoneType[]} />;
                        }
                    }
                    return <PrismicRichText field={data.body as unknown as import('@prismicio/client').RichTextField} />;
                })()}
            </article>
        </main>
    );
}
