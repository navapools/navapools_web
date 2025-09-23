import Link from "next/link";

import type { SliceComponentProps } from "@/types/slices";

export default function CallToAction({ slice }: SliceComponentProps) {
	const text = slice.primary?.text as string | undefined;
	const link = slice.primary?.link as { url: string } | undefined;
	if (!text) return null;
	return (
		<section className="p-6 text-center">
			<p className="mb-3">{text}</p>
			{link?.url && (
				<Link href={link.url as unknown as URL} className="px-4 py-2 rounded bg-black text-white inline-block">Go</Link>
			)}
		</section>
	);
}
