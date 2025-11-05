import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import "../globals.css";
import { getNavigation, getSettings } from "@/prismic/queries";
import type { Navigation, Settings } from "@/types/prismic";
import HamburgerMenu from "@/components/HamburgerMenu";

// NOTE: We provide a generateMetadata function below to produce dynamic, localized
// metadata (Open Graph, Twitter, hreflang alternates, and robots). This helps
// search engines and social previews index the right content per locale.

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    // Use Prismic settings when available to populate title/description
    let settings: Settings = { data: { site_name: 'NavaPools', footer_text: '' } };
    try {
        settings = await getSettings(locale);
    } catch {
        // fallback already set
    }

    const siteName = settings.data.site_name || 'NavaPools';
    const description = settings.data.footer_text || 'NavaPools - Pool builders and services in Orlando, Florida.';
    const baseUrl = DEFAULT_SITE_URL;
    const localeBase = `${baseUrl}/${locale}`;

    return {
        title: siteName,
        description,
        openGraph: {
            title: siteName,
            description,
            url: localeBase,
            siteName,
            type: 'website',
            images: [
                {
                    url: `${baseUrl}/NavaPools_logo.png`,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: siteName,
            description,
        },
        alternates: {
            canonical: baseUrl,
            languages: {
                en: `${baseUrl}/en`,
                es: `${baseUrl}/es`,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
    
    // Usar fallbacks por defecto y luego intentar cargar desde Prismic
    let nav: Navigation = { data: { items: [] } };
    let settings: Settings = { data: { site_name: "NavaPools", footer_text: "" } };
    
    try {
        [nav, settings] = await Promise.all([
            getNavigation(locale),
            getSettings(locale),
        ]);
    } catch (error) {
        console.warn('Using fallback navigation and settings:', error);
        // Los valores por defecto ya están asignados arriba
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen antialiased">
                {/* Header con altura responsiva para controlar el tamaño del logo sin mover el menú */}
                <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 gap-4 h-24 md:h-32 lg:h-40">
                    <div className="flex items-center gap-3">
                        <Link href={`/${locale}`} className="cursor-pointer hover:opacity-80 transition-opacity">
                                <Image 
                                    src="/NavaPools_logo.png" 
                                    alt={settings.data.site_name || "NavaPools"} 
                                    width={700} 
                                    height={232}
                                    className="w-auto object-contain max-h-[80px] md:max-h-[128px] lg:max-h-[192px]"
                                    priority
                                    unoptimized
                                />
                        </Link>
                    </div>
                    <HamburgerMenu items={nav.data.items || []} locale={locale} />
                </header>
                {children}

                {/* JSON-LD structured data for LocalBusiness to help search engines understand
                    this site is a local business in Orlando, Florida. Update phone/email/address
                    values in Prismic or environment variables for accuracy. */}
                <script
                    id="navapools-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        name: settings.data.site_name || 'NavaPools',
                        description: settings.data.footer_text || 'Pool builders and services in Orlando, Florida.',
                        url: DEFAULT_SITE_URL,
                        image: `${DEFAULT_SITE_URL}/NavaPools_logo.png`,
                        telephone: process.env.NEXT_PUBLIC_PHONE || 'YOUR_PHONE_NUMBER',
                        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@navapools.com',
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS || 'Orlando, FL',
                            addressLocality: 'Orlando',
                            addressRegion: 'FL',
                            postalCode: process.env.NEXT_PUBLIC_POSTAL_CODE || '328xx',
                            addressCountry: 'US'
                        },
                        geo: {
                            "@type": "GeoCoordinates",
                            latitude: process.env.NEXT_PUBLIC_LATITUDE || '28.538336',
                            longitude: process.env.NEXT_PUBLIC_LONGITUDE || '-81.379234'
                        },
                        openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || 'Mo-Fr 09:00-17:00'
                    }) }}
                />
                <footer className="border-t p-4 text-center text-sm text-neutral-600">{settings.data.footer_text}</footer>
            </div>
        </NextIntlClientProvider>
    );
}
