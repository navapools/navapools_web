import { getContact } from "@/prismic/queries";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const c = await getContact(locale);
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';
	return {
		title: c.seo.title,
		description: c.seo.description,
		openGraph: {
			title: c.seo.title,
			description: c.seo.description,
			url: `${baseUrl}/${locale}/contact`,
			type: 'website',
			images: [{ url: c.seo.imageUrl, width: 1200, height: 630, alt: c.seo.title }]
		},
		twitter: { card: 'summary_large_image', title: c.seo.title, description: c.seo.description }
	};
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const contactCopy = await getContact(locale);

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-1">{contactCopy.title}</h1>
			{contactCopy.subtitle ? (<p className="text-neutral-500 mb-4">{contactCopy.subtitle}</p>) : null}
			{contactCopy.description ? (<p className="text-gray-600 mb-6">{contactCopy.description}</p>) : null}
			<ContactForm locale={locale} copy={contactCopy} />
		</div>
	);
}