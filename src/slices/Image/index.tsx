import NextImage from "next/image";

import type { SliceComponentProps, PrismicImage } from "@/types/slices";

export default function ImageSlice({ slice }: SliceComponentProps) {
	const img = slice.primary?.image as unknown as PrismicImage | undefined;
	const alt = img?.alt || "";
	const url = img?.url || "";
	const width = img?.dimensions?.width || 1200;
	const height = img?.dimensions?.height || 630;

	if (!url) return null;

	return (
		<div className="mx-auto my-6 max-w-3xl">
			<NextImage src={url} alt={alt} width={width} height={height} className="w-full h-auto rounded" />
		</div>
	);
}


