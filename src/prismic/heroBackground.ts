import { getPageByUID } from './queries';
import type { PrismicImage, PrismicLink } from '@/types/slices';

interface PrismicPageData {
    slices?: Array<{
        slice_type: string;
        primary?: Record<string, unknown>;
    }>;
}

interface PrismicPage {
    type: string;
    data?: PrismicPageData;
}

interface HeroBackgroundData {
    background_image?: PrismicImage;
    video_url?: string;
    mobile_video_url?: string;
}

export async function getHeroBackgroundData(locale: string): Promise<HeroBackgroundData> {
    try {
        const page = (await getPageByUID(locale, "nava-pools-page")) as PrismicPage;
        
        if (!page || page.type !== 'page' || !page.data?.slices) {
            return {};
        }

        // Buscar el slice de HeroFullscreen en los slices de la página
        const heroSlice = page.data.slices.find((slice: unknown) => 
            slice && typeof slice === 'object' && 'slice_type' in slice && 
            (slice as { slice_type: string }).slice_type === 'hero_fullscreen'
        );

        if (!heroSlice || typeof heroSlice !== 'object' || !('primary' in heroSlice)) {
            return {};
        }

        const primary = heroSlice.primary as Record<string, unknown>;
        
        return {
            background_image: primary.background_image as PrismicImage,
            video_url: (primary.video_url as PrismicLink)?.url || primary.video_url as string || '',
            mobile_video_url: (primary.mobile_video_url as PrismicLink)?.url || primary.mobile_video_url as string || ''
        };
    } catch (error) {
        console.error('Error fetching hero background data:', error);
        return {};
    }
}
