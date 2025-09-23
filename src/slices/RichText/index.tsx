import { PrismicRichText } from "@prismicio/react";

export default function RichTextSlice({ slice }: { slice: any }) {
	return (
		<section className="prose mx-auto p-6">
			<PrismicRichText field={slice.primary?.content} />
		</section>
	);
}
