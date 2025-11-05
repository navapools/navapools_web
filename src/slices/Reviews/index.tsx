'use client';

import type { SliceComponentProps, PrismicImage } from "@/types/slices";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useState, useEffect } from "react";

type Review = {
  pool_image?: PrismicImage;
  client_name: string;
  rating: number;
  review_text: string;
  city: string;
  index?: number;
};

export default function Reviews({ slice }: SliceComponentProps) {
  const primary = slice.primary as unknown as {
    section_title?: string;
    section_subtitle?: string;
    main_image?: PrismicImage;
    reviews?: Array<{
      pool_image?: PrismicImage;
      client_name?: string;
      rating?: number;
      review_text?: string;
      city?: string;
    }>;
  };

  const sectionTitle = primary?.section_title || "";
  const sectionSubtitle = primary?.section_subtitle || "";
  const mainImage = primary?.main_image as PrismicImage;
  const reviews: Review[] = (primary?.reviews || []).map((r) => ({
    pool_image: (r.pool_image || {}) as PrismicImage,
    client_name: r.client_name || "",
    rating: r.rating || 5,
    review_text: r.review_text || "",
    city: r.city || "",
  }));

  const [currentReview, setCurrentReview] = useState(0);

  // Build a Prismic/Imgix URL that requests a specific width and quality.
  // Prismic image CDN supports Imgix query params like `?w=1200&q=80&auto=compress,format`.
  const getPrismicUrl = (url?: string, width?: number, quality?: number) => {
    if (!url) return url || '';
    try {
      // Parse the URL and replace any existing Imgix/Prismic params
      const parsed = new URL(url);
      // Remove params we will override
      parsed.searchParams.delete('w');
      parsed.searchParams.delete('q');
      parsed.searchParams.delete('auto');
      // Remove any fixed height so our requested width can scale properly
      parsed.searchParams.delete('h');

      if (width) parsed.searchParams.set('w', String(width));
      if (quality) parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('auto', 'compress,format');

      return parsed.toString();
    } catch {
      return url;
    }
  };

  // Use a deterministic default width on the server to avoid hydration mismatch.
  // We'll adjust on the client after mount.
  const [bigImageWidth, setBigImageWidth] = useState<number>(1400);

  useEffect(() => {
    // compute client width once after mount and on resize
    const compute = () => {
      const ratio = window.devicePixelRatio || 1;
      const w = Math.min(2000, Math.max(800, Math.round(window.innerWidth * 0.5 * ratio)));
      setBigImageWidth(w);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Log URLs for debugging on the client only
  useEffect(() => {
    const currentReviewData = reviews[currentReview];
    if (!currentReviewData) return;
    try {
      console.log('Big image original URL (review):', currentReviewData.pool_image?.url);
      console.log('Big image requested URL (review):', getPrismicUrl(currentReviewData.pool_image?.url, bigImageWidth, 90));
      if (mainImage?.url) {
        console.log('Big image original URL (main):', mainImage.url);
        console.log('Big image requested URL (main):', getPrismicUrl(mainImage.url, bigImageWidth, 90));
      }
    } catch {
      // ignore
    }
  }, [reviews, currentReview, mainImage, bigImageWidth]);

  // Debug state changes
  useEffect(() => {
    console.log('Current review changed to:', currentReview);
  }, [currentReview]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    console.log('Swipe detected:', { distance, isLeftSwipe, isRightSwipe, reviewsLength: reviews.length });

    if (isLeftSwipe && reviews.length > 1) {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }
    if (isRightSwipe && reviews.length > 1) {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  // Get visible reviews (3 at a time)
  const getVisibleReviews = (): (Review & { index: number })[] => {
    const visible: (Review & { index: number })[] = [];
    if (reviews.length === 0) return visible;

    // show up to 3 cards centered on currentReview
    const windowSize = Math.min(3, reviews.length);
    const centerPos = Math.floor(windowSize / 2); // 0,1

    for (let i = 0; i < windowSize; i++) {
      // offset relative to center (e.g. -1,0,1)
      const offset = i - centerPos;
      // wrap properly
      const index = (currentReview + offset + reviews.length) % reviews.length;
      visible.push({ ...reviews[index], index });
    }

    return visible;
  };

  const visibleReviews = getVisibleReviews();

  // Debug log
  console.log('Reviews state:', { 
    currentReview, 
    reviewsLength: reviews.length, 
    visibleReviewsLength: visibleReviews.length,
    visibleReviews: visibleReviews.map(r => ({ name: r.client_name, index: r.index }))
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (reviews.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center text-gray-500">
            Configure las reseñas en Prismic para mostrarlas aquí.
          </div>
        </div>
      </section>
    );
  }

  const currentReviewData = reviews[currentReview];

  // Debug log for image
  console.log('Current review data:', {
    currentReview,
    currentReviewData: currentReviewData ? {
      name: currentReviewData.client_name,
      hasPoolImage: !!currentReviewData.pool_image?.url,
      poolImageUrl: currentReviewData.pool_image?.url
    } : null,
    mainImageUrl: mainImage?.url
  });

  return (
    <>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-45 {
          transform: rotateY(45deg);
        }
        .-rotate-y-45 {
          transform: rotateY(-45deg);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <section 
        id="testimonials"
        className="min-h-screen flex flex-col justify-center py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700"
      >
      {/* Decorative angled shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-20%] w-[70%] h-56 bg-white/90 backdrop-blur-sm shadow-xl rotate-[-6deg] rounded-2xl" />
        <div className="absolute -top-16 right-[-10%] w-[60%] h-40 bg-blue-600/70 rotate-[-6deg] rounded-2xl" />
      </div>
      {/* Contrast overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(1100px 360px at 50% 0%, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)'
        }}
      />
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        {(sectionTitle || sectionSubtitle) && (
          <Reveal direction="up">
            <div className="text-center mb-16">
              {sectionTitle && (
                <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg mb-4">
                  {sectionTitle}
                </h2>
              )}
              {sectionSubtitle && (
                <p className="text-white/95 text-shadow max-w-2xl mx-auto">
                  {sectionSubtitle}
                </p>
              )}
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main image (changes with selected review) */}
          <Reveal direction="left">
          <div className="order-2 lg:order-1">
            {currentReviewData.pool_image?.url ? (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-visible">
                <div className="relative h-full skew-y-3 rounded-2xl ring-4 ring-white/90 shadow-2xl overflow-hidden">
                  <div className="relative h-full -skew-y-3">
                    <Image
                  // key ensures Next remounts the Image when src changes so a fresh high-res request is made
                  key={getPrismicUrl(currentReviewData.pool_image.url, bigImageWidth, 90)}
                  src={getPrismicUrl(currentReviewData.pool_image.url, bigImageWidth, 90)}
                  alt={currentReviewData.pool_image.alt || "Pool showcase"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                  </div>
                </div>
              </div>
            ) : mainImage?.url ? (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-visible">
                <div className="relative h-full skew-y-3 rounded-2xl ring-4 ring-white/90 shadow-2xl overflow-hidden">
                  <div className="relative h-full -skew-y-3">
                    <Image
                  key={getPrismicUrl(mainImage.url, bigImageWidth, 90)}
                  src={getPrismicUrl(mainImage.url, bigImageWidth, 90)}
                  alt={mainImage.alt || "Pool showcase"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center border-4 border-white">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🏊‍♂️</div>
                  <p>Imagen principal de piscina</p>
                  <p className="text-sm mt-2">Review: {currentReviewData?.client_name || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
          </Reveal>

          {/* Right side - 3D Carousel */}
          <Reveal direction="right">
          <div className="order-1 lg:order-2">
            {/* 3D Carousel Container */}
            <div 
              className="relative h-[60vh] perspective-1000 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                  {visibleReviews.map((review, i) => {
                    const centerIndex = Math.floor(visibleReviews.length / 2);
                    const isCenter = i === centerIndex;
                    const isLeft = i < centerIndex;
                    // right is inferred when i > centerIndex; don't create unused bindings

                    console.log('Rendering card:', {
                      i,
                      isCenter,
                      reviewName: review.client_name,
                      reviewIndex: review.index,
                      currentReview,
                    });

                    return (
                      <div
                        key={review.index}
                        className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${
                          isCenter
                            ? 'z-30 scale-100 opacity-100 translate-x-0'
                            : isLeft
                            ? 'z-20 scale-75 opacity-70 -translate-x-16 rotate-y-45'
                            : 'z-20 scale-75 opacity-70 translate-x-16 -rotate-y-45'
                        }`}
                        onClick={() => {
                          console.log('Card clicked, selecting index:', review.index);
                          // Select clicked review directly so left big image updates to its high-res
                          setCurrentReview(review.index);
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isCenter
                            ? 'translateX(0) scale(1) rotateY(0deg)'
                            : isLeft
                            ? 'translateX(-80px) scale(0.75) rotateY(45deg)'
                            : 'translateX(80px) scale(0.75) rotateY(-45deg)'
                        }}
                      >
                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 w-64 h-72 flex flex-col items-center justify-center skew-y-1">
                          {/* Pool image */}
                          {review.pool_image?.url && (
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden -skew-y-1">
                              <Image
                                  src={getPrismicUrl(review.pool_image.url, 80, 40)}
                                  alt={review.pool_image.alt || "Pool"}
                                  width={80}
                                  height={80}
                                  className="object-cover"
                                  quality={40}
                                  loading={isCenter ? 'eager' : 'lazy'}
                                />
                            </div>
                          )}

                          {/* Rating */}
                          <div className="flex justify-center mb-3">
                            {renderStars(review.rating)}
                          </div>

                          {/* Client info */}
                          <div className="text-center mb-4">
                            <div className="font-semibold text-gray-900 text-sm mb-1">
                              {review.client_name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {review.city}
                            </div>
                          </div>

                          {/* Review preview */}
                          <div className="text-xs text-gray-600 text-center italic line-clamp-3">
                            &quot;{review.review_text.substring(0, 80)}...&quot;
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Debug button */}
                {/* <div className="absolute top-4 left-4 z-50">
                  <button
                    onClick={() => {
                      console.log('Debug: Changing to next review');
                      setCurrentReview((prev) => (prev + 1) % reviews.length);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Debug Next
                  </button>
                </div> */}

                {/* Navigation arrows */}
                {reviews.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        console.log('Previous button clicked');
                        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        console.log('Next button clicked');
                        setCurrentReview((prev) => (prev + 1) % reviews.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('Dot clicked:', index);
                    setCurrentReview(index);
                  }}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    index === currentReview
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
    </>
  );
}
