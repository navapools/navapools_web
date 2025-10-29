import { SliceZone as PrismicSliceZone } from "@prismicio/react";
import HeroFullscreen from "@/slices/HeroFullscreen";
import TrustBar from "@/slices/TrustBar";
import Benefits from "@/slices/Benefits";
import Solutions from "@/slices/Solutions";
import Process from "@/slices/Process";
import Testimonials from "@/slices/Testimonials";
import CallToActionFull from "@/slices/CallToActionFull";
import Plans from "@/slices/Plans";
import Reviews from "@/slices/Reviews";
import RichText from "@/slices/RichText";
import Paragraph from "@/slices/Paragraph";
import ImageSlice from "@/slices/Image";
import FAQ from "@/slices/FAQ";
import { SliceZoneType } from "@/types/slices";

const components = {
	hero_fullscreen: HeroFullscreen,
	trust_bar: TrustBar,
	benefits: Benefits,
	solutions: Solutions,
	process: Process,
	testimonials: Testimonials,
	call_to_action_full: CallToActionFull,
	plans: Plans,
	reviews: Reviews,
	rich_text: RichText,
    paragraph: Paragraph,
    image: ImageSlice,
    faq: FAQ,
};

export default function SliceZone({ slices }: { slices: SliceZoneType[] }) {
	return <PrismicSliceZone slices={slices} components={components} />;
}
