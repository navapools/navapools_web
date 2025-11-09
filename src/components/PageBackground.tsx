"use client";

import Image from "next/image";
import VideoBackground from "@/components/VideoBackground";
import type { PrismicImage } from "@/types/slices";

interface PageBackgroundProps {
    background_image?: PrismicImage;
    video_url?: string;
    mobile_video_url?: string;
    className?: string;
}

export default function PageBackground({ 
    background_image, 
    video_url, 
    mobile_video_url,
    className = ""
}: PageBackgroundProps) {
    const normalizedVideoUrl = typeof video_url === 'string' ? video_url.trim() : '';
    const normalizedMobileVideoUrl = typeof mobile_video_url === 'string' ? mobile_video_url.trim() : '';

    return (
        <div className={`absolute inset-0 ${className}`}>
            {/* Background Video or Image */}
            {normalizedVideoUrl ? (
                <VideoBackground
                    videoUrl={normalizedVideoUrl}
                    mobileVideoUrl={normalizedMobileVideoUrl}
                />
                ) : background_image?.url ? (
                <Image
                    src={background_image.url}
                    alt={background_image.alt || ""}
                    fill
                    className="object-cover"
                    // Lower quality for large background images to save bytes on mobile
                    quality={75}
                    // Tell Next how much space the image will take so it can generate
                    // appropriate responsive srcsets. Full-bleed backgrounds occupy
                    // the viewport width on mobile.
                    sizes="100vw"
                />
            ) : (
                // Fallback background cuando no hay video ni imagen
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-blue-800" />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
        </div>
    );
}
