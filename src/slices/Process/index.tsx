import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";

// interface Step {
//     icon: PrismicImage;
//     title: string;
//     description: string;
// }

export default function Process({ slice }: SliceComponentProps) {
    const { 
        title = '',
        cta_text = '',
        cta_link = {} as PrismicLink
    } = slice.primary as {
        title: string;
        cta_text: string;
        cta_link: PrismicLink;
    };

    const steps = (slice.items || []).map(item => ({
        icon: item.icon as PrismicImage,
        title: item.title as string,
        description: item.description as string
    }));

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {title && (
                    <h3 className="text-3xl font-bold text-center mb-12">{title}</h3>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            {step.icon?.url && (
                                <div className="mb-4">
                                    <div className="inline-block bg-white p-4 rounded-full shadow-sm">
                                        <Image
                                            src={step.icon.url}
                                            alt={step.icon.alt || ""}
                                            width={48}
                                            height={48}
                                            className="mx-auto"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                {/* Number */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {index + 1}
                                </div>
                                {step.title && (
                                    <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                                )}
                                {step.description && (
                                    <p className="text-gray-600">{step.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {cta_text && cta_link?.url && (
                    <div className="text-center">
                        <Link
                            href={cta_link.url as unknown as URL}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                        >
                            {cta_text}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}