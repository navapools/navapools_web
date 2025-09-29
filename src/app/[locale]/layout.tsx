import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Image from "next/image";
import { ReactNode } from "react";
import "../globals.css";
import { getNavigation, getSettings } from "@/prismic/queries";
import type { Navigation, Settings } from "@/types/prismic";
import HamburgerMenu from "@/components/HamburgerMenu";

export const metadata: Metadata = {
	title: "NavaPools",
	description: "Jamstack PWA powered by Next.js, Prismic, and SendGrid",
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
    let nav: Navigation = { data: { items: [] } };
    let settings: Settings = { data: { site_name: "NavaPools", footer_text: "" } };
    try {
        [nav, settings] = await Promise.all([
            getNavigation(locale),
            getSettings(locale),
        ]);
    } catch {}

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen antialiased">
                <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-3">
                        <Image 
                            src="/NavaPools_logo.png" 
                            alt={settings.data.site_name || "NavaPools"} 
                            width={350} 
                            height={116}
                            className="h-24 w-auto"
                            priority
                            unoptimized
                        />
                    </div>
                    <HamburgerMenu items={nav.data.items || []} locale={locale} />
                </header>
                {children}
                <footer className="border-t p-4 text-center text-sm text-neutral-600">{settings.data.footer_text}</footer>
            </div>
        </NextIntlClientProvider>
    );
}
