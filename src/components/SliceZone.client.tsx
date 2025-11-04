"use client";

import { SliceZone as PrismicSliceZone } from "@prismicio/react";
import dynamic from "next/dynamic";
import { SliceZoneType } from "@/types/slices";

// Dynamically import slices so the mapping lives on the client and
// functions (components) are not passed as props from the server.
const HeroFullscreen = dynamic(() => import("@/slices/HeroFullscreen"));
const TrustBar = dynamic(() => import("@/slices/TrustBar"));
const Benefits = dynamic(() => import("@/slices/Benefits"));
const Solutions = dynamic(() => import("@/slices/Solutions"));
const Process = dynamic(() => import("@/slices/Process"));
const Testimonials = dynamic(() => import("@/slices/Testimonials"));
const CallToActionFull = dynamic(() => import("@/slices/CallToActionFull"));
const Plans = dynamic(() => import("@/slices/Plans"));
const Reviews = dynamic(() => import("@/slices/Reviews"));
const RichText = dynamic(() => import("@/slices/RichText"));
const Paragraph = dynamic(() => import("@/slices/Paragraph"));
const ImageSlice = dynamic(() => import("@/slices/Image"));
const FAQ = dynamic(() => import("@/slices/FAQ"));
const ContactAlternate = dynamic(() => import("@/slices/ContactAlternate"));

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
  contact_alternate: ContactAlternate,
};

export default function SliceZoneClient({ slices }: { slices: SliceZoneType[] }) {
  return <PrismicSliceZone slices={slices} components={components} />;
}
