'use client';

import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";
import VideoBackground from "@/components/VideoBackground";
import Reveal from "@/components/Reveal";
import { useParams } from "next/navigation";

// Helper function to extract URL from Prismic link field
// Prismic LinkField can have different structures:
// - String (direct URL)
// - Object with { link_type: 'Web', url: '...' }
// - Object with { url: '...' }
// - Object with other Prismic-specific properties
function extractUrl(field: unknown): string {
    if (!field) return '';
    
    // If it's already a string, return it
    if (typeof field === 'string') {
        return field.trim();
    }
    
    // If it's an array (unlikely but possible), try first element
    if (Array.isArray(field) && field.length > 0) {
        return extractUrl(field[0]);
    }
    
    // If it's an object, try to get the url property
    if (typeof field === 'object' && field !== null) {
        const obj = field as Record<string, unknown>;
        
        // First, try direct url property (most common)
        if (typeof obj.url === 'string' && obj.url.trim()) {
            return obj.url.trim();
        }
        
        // Try Prismic Link structure with link_type
        if (obj.link_type === 'Web' && typeof obj.url === 'string') {
            return obj.url.trim();
        }
        
        // Try Media link type
        if (obj.link_type === 'Media' && typeof obj.url === 'string') {
            return obj.url.trim();
        }
        
        // Try Document link type (usually has id, not url, but check anyway)
        if (obj.link_type === 'Document' && typeof obj.url === 'string') {
            return obj.url.trim();
        }
        
        // Try other possible property names
        const possibleUrlProps = ['href', 'link', 'src', 'source', 'asLinkUrl'];
        for (const prop of possibleUrlProps) {
            if (typeof obj[prop] === 'string' && obj[prop]) {
                return String(obj[prop]).trim();
            }
        }
    }
    
    return '';
}

export default function HeroFullscreen({ slice }: SliceComponentProps) {
    const params = useParams();
    const locale = params?.locale as string || 'en';
    
    // Extract video URLs with robust helper
    const rawVideoUrl = slice.primary?.video_url;
    const rawMobileVideoUrl = slice.primary?.mobile_video_url;
    const video_url = extractUrl(rawVideoUrl);
    const mobile_video_url = extractUrl(rawMobileVideoUrl);
    
    const {
        background_image = {} as PrismicImage,
        title = '',
        subtitle = '',
        primary_cta_text = '',
        primary_cta_link = {} as PrismicLink,
        secondary_cta_text = '',
        secondary_cta_link = {} as PrismicLink,
    } = {
        background_image: slice.primary?.background_image as PrismicImage,
        title: slice.primary?.title as string,
        subtitle: slice.primary?.subtitle as string,
        primary_cta_text: slice.primary?.primary_cta_text as string || slice.primary?.primary_button_text as string,
        primary_cta_link: slice.primary?.primary_cta_link as PrismicLink || slice.primary?.primary_button_link as PrismicLink,
        secondary_cta_text: slice.primary?.secondary_cta_text as string || slice.primary?.secondary_button_text as string,
        secondary_cta_link: slice.primary?.secondary_cta_link as PrismicLink || slice.primary?.secondary_button_link as PrismicLink,
    };

    // Debug: verificar que la URL del video se está extrayendo correctamente
    if (process.env.NODE_ENV === 'development') {
        console.log('HeroFullscreen - Raw video_url field:', rawVideoUrl);
        console.log('HeroFullscreen - Extracted Video URL:', video_url);
        console.log('HeroFullscreen - Raw mobile_video_url field:', rawMobileVideoUrl);
        console.log('HeroFullscreen - Extracted Mobile Video URL:', mobile_video_url);
        console.log('HeroFullscreen - Full slice.primary:', slice.primary);
    }

    return (
        <>
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Video or Image */}
            {video_url ? (
                <VideoBackground
                    videoUrl={video_url}
                    mobileVideoUrl={mobile_video_url}
                />
                ) : background_image?.url ? (
                <Image
                    src={background_image.url}
                    alt={background_image.alt || ""}
                    fill
                    className="object-cover"
                    // Lower quality for hero background to reduce bytes on mobile
                    quality={75}
                    // Provide sizes for full-bleed hero backgrounds
                    sizes="100vw"
                />
            ) : (
                // Fallback background cuando no hay video ni imagen
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-blue-800" />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
            
            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 sm:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                    <div className="w-full md:w-1/2 text-left text-white">
                        <Reveal direction="left">
                            <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight iphone-se-title">
                                {title}
                            </h1>
                        </Reveal>
                        <Reveal direction="left" delayMs={120}>
                            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-100">
                                {subtitle}
                            </p>
                        </Reveal>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start items-stretch w-full md:w-auto">
                            {primary_cta_text && (
                                <Reveal direction="left" delayMs={200}>
                                    <Link 
                                        href={{ pathname: primary_cta_link?.url || `/${locale}/contact` }}
                                        className="block w-full sm:w-auto m-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-3 lg:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-300 text-center border border-white/30"
                                    >
                                        {primary_cta_text}
                                    </Link>
                                </Reveal>
                            )}
                        </div>
                    </div>
                    
                    {/* Secondary Button - visible on all devices */}
                    {secondary_cta_text && (
                        <div className="w-full md:w-auto">
                            <Reveal direction="right" delayMs={260}>
                                <Link 
                                    href={{ pathname: secondary_cta_link?.url || '#' }}
                                    className="block w-full md:w-auto m-0 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 lg:px-8 py-4 lg:py-5 rounded-lg transition-colors duration-300 text-center text-base lg:text-lg"
                                >
                                    {secondary_cta_text}
                                </Link>
                            </Reveal>
                        </div>
                    )}
                </div>
            </div>

            {/* Wave Effect Overlay */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg 
                    viewBox="0 0 1440 120" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path 
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
                        fill="white"
                        fillOpacity="0.1"
                    />
                </svg>
            </div>
        </section>

        {/* iPhone SE specific override: reduce h1 to text-4xl (2.25rem) only on 375x667 portrait */}
        <style jsx>{`
            @media only screen and (max-width: 375px) and (max-height: 667px) and (orientation: portrait) {
                .iphone-se-title {
                    font-size: 2.25rem !important; /* Tailwind text-4xl */
                    line-height: 1.1 !important;
                }
            }
        `}</style>
        </>
    );
}