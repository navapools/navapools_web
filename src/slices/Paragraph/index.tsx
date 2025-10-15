import { PrismicRichText } from "@prismicio/react";

import type { SliceComponentProps } from "@/types/slices";

export default function ParagraphSlice({ slice }: SliceComponentProps) {
	return (
		<section className="prose mx-auto p-6">
			<PrismicRichText field={slice.primary?.text as import("@prismicio/client").RichTextField} />
		</section>
	);
}
