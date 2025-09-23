import Link from "next/link";

export default function CallToAction({ slice }: { slice: any }) {
	const text = slice.primary?.text;
	const link = slice.primary?.link;
	if (!text) return null;
	return (
		<section className="p-6 text-center">
			<p className="mb-3">{text}</p>
			{link?.url && (
				<Link href={link.url} className="px-4 py-2 rounded bg-black text-white inline-block">Go</Link>
			)}
		</section>
	);
}
