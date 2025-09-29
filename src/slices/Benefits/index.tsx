import type { SliceComponentProps, PrismicLink, PrismicImage } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";

export default function Benefits({ slice }: SliceComponentProps) {
    const { 
        title = '',
        subtitle = '',
        cta_text = '',
        cta_link = {} as PrismicLink 
    } = slice.primary as {
        title: string;
        subtitle: string;
        cta_text: string;
        cta_link: PrismicLink;
    };
    
    const benefits = (slice.items || []).map(item => ({
        icon: item.icon as PrismicImage,
        title: item.title as string,
        description: item.description as string
    }));

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    {title && (
                        <h3 className="text-3xl font-bold mb-4">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
                    )}
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-sm text-center"
                        >
                            {benefit.icon?.url && (
                                <div className="mb-4">
                                    <Image
                                        src={benefit.icon.url}
                                        alt={benefit.icon.alt || ""}
                                        width={64}
                                        height={64}
                                        className="mx-auto"
                                    />
                                </div>
                            )}
                            {benefit.title && (
                                <h4 className="text-xl font-semibold mb-3">
                                    {benefit.title}
                                </h4>
                            )}
                            {benefit.description && (
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                {cta_text && cta_link?.url && (
                    <div className="text-center">
                        <Link
                            href={cta_link.url as unknown as URL}
                            className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            {cta_text}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}