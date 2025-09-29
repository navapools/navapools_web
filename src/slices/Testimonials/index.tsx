"use client";

import type { SliceComponentProps, PrismicImage } from "@/types/slices";
import Image from "next/image";
import { useState } from "react";

export default function Testimonials({ slice }: SliceComponentProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { title = '' } = slice.primary as { title: string };
    
    const testimonials = (slice.items || []).map(item => ({
        image: item.image as PrismicImage,
        quote: item.quote as string,
        author_name: item.author_name as string,
        author_location: item.author_location as string
    }));

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {title && (
                    <h3 className="text-3xl font-bold text-center mb-12">{title}</h3>
                )}

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Testimonial */}
                        <div className="text-center">
                            {testimonials[currentIndex].image?.url && (
                                <div className="mb-6">
                                    <Image
                                        src={testimonials[currentIndex].image.url}
                                        alt={testimonials[currentIndex].image.alt || ""}
                                        width={80}
                                        height={80}
                                        className="rounded-full mx-auto"
                                    />
                                </div>
                            )}
                            <blockquote className="text-xl text-gray-700 mb-6">
                                &ldquo;{testimonials[currentIndex].quote}&rdquo;
                            </blockquote>
                            <cite className="not-italic">
                                <span className="font-semibold">
                                    {testimonials[currentIndex].author_name}
                                </span>
                                {testimonials[currentIndex].author_location && (
                                    <span className="text-gray-500">
                                        , {testimonials[currentIndex].author_location}
                                    </span>
                                )}
                            </cite>
                        </div>

                        {/* Navigation Buttons */}
                        {testimonials.length > 1 && (
                            <>
                                <button
                                    onClick={prevTestimonial}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                                    aria-label="Previous testimonial"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                                    aria-label="Next testimonial"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dots */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-6">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full ${
                                        index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}