import type { SliceComponentProps, PrismicLink } from "@/types/slices";
import Link from "next/link";

export default function CallToActionFull({ slice }: SliceComponentProps) {
    const {
        title = '',
        subtitle = '',
        cta_text = '',
        cta_link = {} as PrismicLink,
        phone = '',
        email = '',
        service_area = ''
    } = slice.primary as {
        title: string;
        subtitle: string;
        cta_text: string;
        cta_link: PrismicLink;
        phone: string;
        email: string;
        service_area: string;
    };

    return (
        <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4 text-center">
                {title && (
                    <h2 className="text-4xl font-bold mb-4">{title}</h2>
                )}
                {subtitle && (
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
                {cta_text && cta_link?.url && (
                    <Link
                        href={cta_link.url as unknown as URL}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors mb-12"
                    >
                        {cta_text}
                    </Link>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {phone && (
                        <div className="flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-gray-600">{phone}</span>
                        </div>
                    )}
                    {email && (
                        <div className="flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-600">{email}</span>
                        </div>
                    )}
                    {service_area && (
                        <div className="flex flex-col items-center">
                            <svg className="w-8 h-8 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-600">{service_area}</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}