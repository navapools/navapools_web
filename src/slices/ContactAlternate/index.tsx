import Image from "next/image";

import type { ContactAlternateContentType } from "@/types/prismic";
import React from "react";
import Reveal from "@/components/Reveal";

/**
 * Props for `ContactAlternate` component
 */
type ContactAlternateProps = {
  slice: ContactAlternateContentType;
};

/**
 * Component for the ContactAlternate slice
 */
const ContactAlternate = ({ slice }: ContactAlternateProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    
    // Here you would typically handle the form submission
    console.log('Form submitted with email:', email);
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-blue-900 to-blue-800">
      {slice.primary.background_image.url && (
        <>
          <div className="absolute inset-0">
            <Image
              src={slice.primary.background_image.url}
              alt={slice.primary.background_image?.alt || slice.primary.title || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
          {/* subtle dark overlay to improve text contrast while keeping photo visible */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </>
      )}
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal direction="up">
            <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
              {slice.primary.title}
            </h2>
          </Reveal>

          <Reveal direction="up" delayMs={80}>
            <div className="bg-white/10 border border-white/10 rounded-xl p-8 md:p-12 backdrop-blur-md shadow-2xl transform hover:scale-[1.01] transition-all">
              <Reveal direction="up" delayMs={120}>
                <p className="text-white/90 text-xl mb-8 drop-shadow-lg">
                  {slice.primary.description}
                </p>
              </Reveal>

              <Reveal direction="up" delayMs={180}>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="flex-grow px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                      required
                    />
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:translate-y-[-2px] shadow-lg"
                    >
                      {slice.primary.button_text || "Subscribe"}
                    </button>
                  </div>
                </form>
              </Reveal>

              <Reveal direction="up" delayMs={260}>
                <div className="flex flex-wrap justify-center gap-8 mt-8">
                  {slice.items.map((item, index) => (
                    <Reveal key={index} direction="up" delayMs={index * 80}>
                      <a
                        href={item.social_link?.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center text-white hover:text-white/90 transition-colors"
                      >
                        {item.social_icon.url && (
                          <div className="w-16 h-16 mb-2 rounded-full flex items-center justify-center bg-white/10">
                            <Image
                              src={item.social_icon.url}
                              alt={item.social_icon?.alt || item.social_text || ""}
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-center text-white">{item.social_text}</span>
                      </a>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactAlternate;