import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";

// interface Solution {
//     image: PrismicImage;
//     subtitle: string;
//     text: string;
//     cta_text: string;
//     cta_link: PrismicLink;
// }

export default function Solutions({ slice }: SliceComponentProps) {
    const { title = '' } = slice.primary as { title: string };
    const solutions = (slice.items || []).map(item => ({
        image: item.image as PrismicImage,
        subtitle: item.subtitle as string,
        text: item.text as string,
        cta_text: item.cta_text as string,
        cta_link: item.cta_link as PrismicLink
    }));

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {title && (
                    <h3 className="text-3xl font-bold text-center mb-12">{title}</h3>
                )}

                <div className="space-y-16">
                    {solutions.map((solution, index) => (
                        <div 
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2 relative aspect-video">
                                {solution.image?.url && (
                                    <Image
                                        src={solution.image.url}
                                        alt={solution.image.alt || ""}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2">
                                {solution.subtitle && (
                                    <h4 className="text-2xl font-semibold mb-4">
                                        {solution.subtitle}
                                    </h4>
                                )}
                                {solution.text && (
                                    <p className="text-gray-600 mb-6">
                                        {solution.text}
                                    </p>
                                )}
                                {solution.cta_text && solution.cta_link?.url && (
                                    <Link
                                        href={solution.cta_link.url as unknown as URL}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        {solution.cta_text}
                                        <svg
                                            className="w-5 h-5 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}