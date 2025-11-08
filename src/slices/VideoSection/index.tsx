'use client';

import type { PrismicLink } from "@/types/slices";
import { PrismicRichText } from "@prismicio/react";
import type { RichTextField, AnyRegularField, Slice } from "@prismicio/client";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// Helper function to extract URL from Prismic link field
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
        
        // Try Document link type
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

// Helper function to convert YouTube/Vimeo URLs to embed format
function convertToEmbedUrl(url: string): string {
    if (!url) return '';
    
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If it's already an embed URL or direct video URL, return as is
    return url;
}

type VideoSectionSlice = Slice<
  "video_section",
  {
    title: RichTextField;
    subtitle: RichTextField;
    videoUrl?: AnyRegularField; // Can be Link field or string
    video_url?: AnyRegularField; // Fallback for snake_case
    backgroundOpacity?: number;
    backgroundColor?: string;
    features_list?: string; // List of features separated by newlines
    cta_text?: string;
    cta_link?: AnyRegularField; // Link field from Prismic
  }
>;

interface VideoSectionProps {
  slice: VideoSectionSlice;
}

const VideoSection = ({ slice }: VideoSectionProps) => {
  // Extract video URL - try both camelCase and snake_case
  const rawVideoUrl = slice.primary?.videoUrl || slice.primary?.video_url;
  const extractedUrl = extractUrl(rawVideoUrl);
  const embedUrl = convertToEmbedUrl(extractedUrl);
  
  // Extract other fields
  const featuresList = (slice.primary?.features_list as string) || '';
  const ctaText = (slice.primary?.cta_text as string) || '';
  const ctaLink = (slice.primary?.cta_link as PrismicLink) || {} as PrismicLink;
  
  // Parse features list (split by newlines)
  const features = featuresList
    .split(/\r?\n/)
    .map(f => f.trim())
    .filter(f => f.length > 0);
  
  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('VideoSection - Raw videoUrl field:', rawVideoUrl);
    console.log('VideoSection - Extracted URL:', extractedUrl);
    console.log('VideoSection - Embed URL:', embedUrl);
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* White card container with rounded corners and shadow */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
          {/* Desktop: Two columns (video left, text right) */}
          {/* Mobile: Column (text first, then video) */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
            {/* Video Section - Left on desktop, second on mobile */}
            {embedUrl && (
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <Reveal direction="left" delayMs={0} className="h-full">
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg w-full">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video player"
                    />
                  </div>
                </Reveal>
              </div>
            )}

            {/* Text Content Section - Right on desktop, first on mobile */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col justify-center">
              {/* Title */}
              <Reveal direction="right" delayMs={100}>
                <div className="mb-4">
                  <PrismicRichText
                    field={slice.primary?.title as RichTextField}
                    components={{
                      heading1: ({ children }) => (
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
                          {children}
                        </h2>
                      ),
                    }}
                  />
                </div>
              </Reveal>

              {/* Subtitle/Description */}
              <Reveal direction="right" delayMs={200}>
                <div className="mb-6">
                  <PrismicRichText
                    field={slice.primary?.subtitle as RichTextField}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                          {children}
                        </p>
                      ),
                    }}
                  />
                </div>
              </Reveal>

              {/* Features List */}
              {features.length > 0 && (
                <Reveal direction="right" delayMs={300}>
                  <ul className="mb-6 space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {/* CTA Button */}
              {ctaText && ctaLink?.url && (
                <Reveal direction="right" delayMs={400}>
                  <div className="mt-auto">
                    <Link
                      href={ctaLink.url as unknown as URL}
                      className="inline-block w-full text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      {ctaText}
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;