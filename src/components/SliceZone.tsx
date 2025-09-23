import { SliceZone as PrismicSliceZone } from "@prismicio/react";
import Hero from "@/slices/Hero";
import RichText from "@/slices/RichText";
import CallToAction from "@/slices/CallToAction";

const components = {
	hero: Hero as any,
	rich_text: RichText as any,
	call_to_action: CallToAction as any,
};

export default function SliceZone({ slices }: { slices: any[] }) {
	return <PrismicSliceZone slices={slices} components={components as any} />;
}
