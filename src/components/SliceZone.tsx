import { SliceZone as PrismicSliceZone } from "@prismicio/react";
import Hero from "@/slices/Hero";
import RichText from "@/slices/RichText";
import CallToAction from "@/slices/CallToAction";
import type { SliceComponentProps } from "@/types/slices";

const components = {
	hero: Hero,
	rich_text: RichText,
	call_to_action: CallToAction,
};

export default function SliceZone({ slices }: { slices: SliceComponentProps['slice'][] }) {
	return <PrismicSliceZone slices={slices} components={components} />;
}
