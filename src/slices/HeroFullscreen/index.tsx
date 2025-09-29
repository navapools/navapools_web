import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";

export default function HeroFullscreen({ slice }: SliceComponentProps) {
    const {
        background_image = {} as PrismicImage,
        title = '',
        subtitle = '',
        primary_cta_text = '',
        primary_cta_link = {} as PrismicLink,
        secondary_cta_text = '',
        secondary_cta_link = {} as PrismicLink
    } = {
        background_image: slice.primary?.background_image as PrismicImage,
        title: slice.primary?.title as string,
        subtitle: slice.primary?.subtitle as string,
        primary_cta_text: slice.primary?.primary_cta_text as string,
        primary_cta_link: slice.primary?.primary_cta_link as PrismicLink,
        secondary_cta_text: slice.primary?.secondary_cta_text as string,
        secondary_cta_link: slice.primary?.secondary_cta_link as PrismicLink
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image */}
            {background_image?.url && (
                <Image
                    src={background_image.url}
                    alt={background_image.alt || ""}
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
            
            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 md:px-8">
                <div className="flex justify-start">
                    <div className="max-w-xl text-left text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-100">
                            {subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-start">
                            {primary_cta_text && (
                                <Link 
                                    href={{ pathname: primary_cta_link?.url || '#' }}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 text-center"
                                >
                                    {primary_cta_text}
                                </Link>
                            )}
                            {secondary_cta_text && (
                                <Link 
                                    href={{ pathname: secondary_cta_link?.url || '#' }}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-300 text-center border border-white/30"
                                >
                                    {secondary_cta_text}
                                </Link>
                            )}
                        </div>
                    </div>
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
    );
}