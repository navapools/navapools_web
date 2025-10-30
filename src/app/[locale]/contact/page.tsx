import { getContact } from "@/prismic/queries";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const c = await getContact(locale);
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com';
	return {
		title: c.seo.title || 'Contact',
		description: c.seo.description || '',
		openGraph: {
			title: c.seo.title || 'Contact',
			description: c.seo.description || '',
			url: `${baseUrl}/${locale}/contact`,
			type: 'website',
			images: [{ url: c.seo.imageUrl, width: 1200, height: 630, alt: c.seo.title || 'Contact' }]
		},
		twitter: { card: 'summary_large_image', title: c.seo.title || 'Contact', description: c.seo.description || '' }
	};
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const contactCopy = await getContact(locale);

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700">
			{/* Decorative shapes (different from FAQ): soft blurred circle + subtle tilted panel */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-20 left-[-8%] w-72 h-72 bg-white/80 rounded-full filter blur-3xl opacity-60" />
				<div className="absolute -bottom-24 right-[-14%] w-[48%] h-72 bg-blue-900/20 rounded-3xl transform rotate-12" />
			</div>

			{/* Light radial highlight for readability */}
			<div
				className="absolute inset-0 pointer-events-none"
				aria-hidden="true"
				style={{
					background:
						'radial-gradient(900px 320px at 12% 6%, rgba(255,255,255,0.12), rgba(255,255,255,0) 36%)'
				}}
			/>

			<div className="relative z-10 max-w-xl mx-auto px-6 pt-24 md:pt-28 pb-16">
				<h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{contactCopy.title}</h1>
				{contactCopy.subtitle ? (
					<p className="text-sky-100 mb-4">{contactCopy.subtitle}</p>
				) : null}
				{contactCopy.description ? (
					<p className="text-sky-100/90 mb-6">{contactCopy.description}</p>
				) : null}

				{/* White card for the form to ensure accessibility and contrast */}
				<div className="mt-6 bg-white/95 p-6 rounded-xl shadow-lg">
					<ContactForm locale={locale} copy={contactCopy} />
				</div>
			</div>
		</section>
	);
}