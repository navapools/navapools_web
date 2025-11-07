'use client';

import type { SliceComponentProps } from "@/types/slices";
import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";
import type { Slice } from "@prismicio/client";

interface VideoSectionSlice extends Slice {
  primary: {
    title: RichTextField;
    subtitle: RichTextField;
    video_url?: string;
  }
}

interface VideoSectionProps extends SliceComponentProps {
  slice: VideoSectionSlice;
}

const VideoSection = ({ slice }: VideoSectionProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0 bg-black/70" />

      <div className="relative z-10 container mx-auto px-4 py-12 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <PrismicRichText
              field={slice.primary?.title as RichTextField}
              components={{
                heading1: ({ children }) => (
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    {children}
                  </h2>
                ),
              }}
            />
          </div>

          <div className="mb-8">
            <PrismicRichText
              field={slice.primary?.subtitle as RichTextField}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-lg md:text-xl text-gray-200">
                    {children}
                  </p>
                ),
              }}
            />
          </div>

          {slice.primary?.video_url && (
            <div className="relative aspect-video max-w-4xl mx-auto">
              <div className="absolute inset-0">
                <iframe
                  src={slice.primary.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;