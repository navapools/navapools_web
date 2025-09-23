import { PrismicRichText } from "@prismicio/react";
import { Content } from "@prismicio/client";
import Link from "next/link";

export default function Hero({ slice }: { slice: Content.PageDocumentDataSlicesHeroItem }) {
	const heading = (slice as any).primary?.heading;
	const subheading = (slice as any).primary?.subheading;
	const ctaLabel = (slice as any).primary?.cta_label;
	const ctaLink = (slice as any).primary?.cta_link;
	return (
		<section className="py-16 text-center">
			{heading && <h2 className="text-3xl font-semibold mb-2">{heading}</h2>}
			{subheading && <p className="text-neutral-600 mb-6">{subheading}</p>}
			{ctaLabel && ctaLink?.url && (
				<Link href={ctaLink.url} className="inline-block px-4 py-2 rounded bg-black text-white">
					{ctaLabel}
				</Link>
			)}
		</section>
	);
}
