import Link from "next/link";
import type { SliceComponentProps } from "@/types/slices";

export default function Hero({ slice }: SliceComponentProps) {
	const { primary } = slice;
	const heading = primary?.heading as string | undefined;
	const subheading = primary?.subheading as string | undefined;
	const ctaLabel = primary?.cta_label as string | undefined;
	const ctaLink = primary?.cta_link as { url: string } | undefined;
	return (
		<section className="py-16 text-center">
			{heading && <h2 className="text-3xl font-semibold mb-2">{heading}</h2>}
			{subheading && <p className="text-neutral-600 mb-6">{subheading}</p>}
			{ctaLabel && ctaLink?.url && (
				<Link href={ctaLink.url as unknown as URL} className="inline-block px-4 py-2 rounded bg-black text-white">
					{ctaLabel}
				</Link>
			)}
		</section>
	);
}
