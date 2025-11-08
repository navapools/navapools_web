import { getBlogByUID } from '@/prismic/queries';
import SliceZone from '@/components/SliceZone';
import { PrismicRichText } from '@prismicio/react';
import type { SliceZoneType } from '@/types/slices';
import PageBackground from '@/components/PageBackground';
import type { PrismicImage, PrismicLink } from '@/types/slices';
import { getHeroBackgroundData } from '@/prismic/heroBackground';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export default async function BlogDetail({ params }: { params: Promise<{ locale: string; uid: string }> }) {
    const { locale, uid } = await params;
    const postRaw = await getBlogByUID(locale, uid);
    const postRec = postRaw as Record<string, unknown> | null;

    if (!postRec) {
        notFound();
    }

    const data = (postRec['data'] as Record<string, unknown>) || {};
    const title = Array.isArray(data['title']) ? ((data['title'] as Array<Record<string, unknown>>)[0]?.text as string) || '' : (data['title'] as string) || '';
    const subtitle = Array.isArray(data['subtitle']) ? ((data['subtitle'] as Array<Record<string, unknown>>)[0]?.text as string) || '' : (data['subtitle'] as string) || '';
    
    // Extract background data del blog
    const blogBackgroundImage = data['background_image'] as PrismicImage;
    const blogVideoUrl = (data['video_url'] as PrismicLink)?.url || data['video_url'] as string || '';
    const blogMobileVideoUrl = (data['mobile_video_url'] as PrismicLink)?.url || data['mobile_video_url'] as string || '';
    
    // Obtener el background del HERO como fallback
    const heroBackground = await getHeroBackgroundData(locale);
    
    // Usar el background del blog si existe, sino usar el del HERO
    const background_image = blogBackgroundImage?.url ? blogBackgroundImage : heroBackground.background_image;
    const video_url = blogVideoUrl || heroBackground.video_url || '';
    const mobile_video_url = blogMobileVideoUrl || heroBackground.mobile_video_url || '';

    return (
        <main className="relative min-h-screen">
            {/* Background */}
            <PageBackground 
                background_image={background_image}
                video_url={video_url}
                mobile_video_url={mobile_video_url}
            />
            
            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto p-6 pt-28 md:pt-32">
                <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
                {subtitle && <h2 className="text-lg text-gray-200 mb-4">{subtitle}</h2>}

                <article className="prose prose-invert max-w-none">
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
            </div>
        </main>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; uid: string }> }): Promise<Metadata> {
    const { locale, uid } = await params;
    const postRaw = await getBlogByUID(locale, uid);
    const postRec = postRaw as Record<string, unknown> | null;

    if (!postRec) {
        return {
            title: 'Not Found',
        };
    }

    const data = (postRec['data'] as Record<string, unknown>) || {};
    const title = Array.isArray(data['title']) 
        ? ((data['title'] as Array<Record<string, unknown>>)[0]?.text as string) || '' 
        : (data['title'] as string) || '';
    const description = Array.isArray(data['subtitle']) 
        ? ((data['subtitle'] as Array<Record<string, unknown>>)[0]?.text as string) || '' 
        : (data['subtitle'] as string) || '';

    return {
        title: title || 'Blog Post',
        description: description || '',
    };
}
