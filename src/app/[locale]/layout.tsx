import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import "../globals.css";
import { getNavigation, getSettings } from "@/prismic/queries";

export const metadata: Metadata = {
	title: "NavaPools",
	description: "Jamstack PWA powered by Next.js, Prismic, and SendGrid",
};

function LanguageSwitcher({ locale }: { locale: string }) {
	const other = locale === "en" ? "es" : "en";
	return (
		<nav className="flex gap-4">
			<Link href={`/${locale}`}>Home</Link>
			<Link href={`/${locale}/contact`}>Contact</Link>
			<Link href={`/${other}`}>{other.toUpperCase()}</Link>
		</nav>
	);
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
    let nav: any = { data: { items: [] } };
    let settings: any = { data: { site_name: "NavaPools", footer_text: "" } };
    try {
        [nav, settings] = await Promise.all([
            getNavigation(locale),
            getSettings(locale),
        ]);
    } catch {}

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen antialiased">
                <header className="flex items-center justify-between p-4 border-b gap-4">
                    <div className="flex items-center gap-3">
                        <Image 
                            src="/NavaPools_logo.png" 
                            alt={settings.data.site_name || "NavaPools"} 
                            width={180} 
                            height={60}
                            className="h-12 w-auto"
                            priority
                            unoptimized
                        />
                    </div>
                    <nav className="flex gap-4">
                        {nav.data.items?.map((it: any, i: number) => (
                            <Link key={i} href={it.link?.url || "#"}>{it.label || "Link"}</Link>
                        ))}
                    </nav>
                    <LanguageSwitcher locale={locale} />
                </header>
                {children}
                <footer className="border-t p-4 text-center text-sm text-neutral-600">{settings.data.footer_text}</footer>
            </div>
        </NextIntlClientProvider>
    );
}
