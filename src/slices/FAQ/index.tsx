'use client';

import type { SliceComponentProps, PrismicImage } from "@/types/slices";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useState } from "react";

type FaqItem = {
    question?: string;
    answer?: string;
};

export default function FAQ({ slice }: SliceComponentProps) {
    const primary = (slice.primary || {}) as unknown as {
        section_title?: string;
        background_image?: PrismicImage;
        side_image?: PrismicImage;
        faqs?: FaqItem[];
    };

    const sectionTitle = primary.section_title || ("Frequently Asked Questions");
    const backgroundImage = (primary.background_image || {}) as PrismicImage;
    const sideImage = (primary.side_image || {}) as PrismicImage;
    interface PrismicText {
        text?: string;
    }

    interface RawFaqItem {
        question?: string | PrismicText[];
        answer?: string | PrismicText[];
    }

    const faqs: FaqItem[] = (Array.isArray(primary.faqs) ? primary.faqs : []).map((it: RawFaqItem) => ({
        question: Array.isArray(it?.question) ? (it?.question?.[0]?.text || '') : (it?.question || ''),
        answer: Array.isArray(it?.answer) ? (it?.answer?.[0]?.text || '') : (it?.answer || ''),
    }));

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section 
            className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700"
        >
            {/* Background image (optional) over the gradient to match Reviews aesthetic */}
            {backgroundImage?.url && (
                <Image
                    src={backgroundImage.url}
                    alt={backgroundImage.alt || ''}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            )}

            {/* Decorative angled shapes (same style as Reviews) */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-[-20%] w-[70%] h-56 bg-white/90 backdrop-blur-sm shadow-xl rotate-[-6deg] rounded-2xl" />
                <div className="absolute -top-16 right-[-10%] w-[60%] h-40 bg-blue-600/70 rotate-[-6deg] rounded-2xl" />
            </div>

            {/* Contrast overlay for readability (radial gradient like Reviews) */}
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                    background:
                        'radial-gradient(1100px 360px at 50% 0%, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)'
                }}
            />

            <div className="relative z-10 container mx-auto px-4 md:px-8 pt-28 pb-16 md:pt-36 md:pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Left: copy + accordion */}
                    <div>
                        <Reveal direction="up">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {sectionTitle}
                            </h2>
                        </Reveal>

                        <div className="space-y-3">
                            {faqs.length === 0 ? (
                                <div className="text-gray-600">
                                    Configure preguntas y respuestas en Prismic para mostrarlas aquí.
                                </div>
                            ) : (
                                faqs.map((item, index) => {
                                    const isOpen = openIndex === index;
                                    return (
                                        <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                            <button
                                                className="w-full flex items-center justify-between text-left px-4 py-4 md:px-5 md:py-5"
                                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                                aria-expanded={isOpen}
                                            >
                                                <span className="font-semibold text-gray-900">{item.question || ''}</span>
                                                <svg
                                                    className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {isOpen && (
                                                <div className="px-4 pb-4 md:px-5 md:pb-5 text-gray-700">
                                                    {item.answer || ''}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: decorative/side image */}
                    <Reveal direction="right">
                        <div className="relative w-full h-64 md:h-[420px]">
                            {sideImage?.url ? (
                                <Image
                                    src={sideImage.url}
                                    alt={sideImage.alt || 'FAQ'}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src="/window.svg"
                                        alt="FAQ"
                                        fill
                                        className="object-contain opacity-80"
                                    />
                                </div>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}


