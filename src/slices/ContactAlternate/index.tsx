import Image from "next/image";
import type { SliceComponentProps } from "@/types/slices";
import type { ContactAlternateContentType } from "@/types/prismic";
import React from "react";

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
    <section className="relative py-16 bg-gradient-to-b from-blue-900 to-blue-800">
      {slice.primary.background_image.url && (
        <>
          <div className="absolute inset-0">
            <Image
              src={slice.primary.background_image.url}
              alt={slice.primary.background_image?.alt || slice.primary.title || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {/* subtle dark overlay to improve text contrast while keeping photo visible */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </>
      )}
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
            {slice.primary.title}
          </h2>
          
          <div className="bg-white/10 border border-white/10 rounded-lg p-8 backdrop-blur-md shadow-lg">
            <p className="text-white/90 text-lg mb-6 drop-shadow">
              {slice.primary.description}
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow"
                >
                  {slice.primary.button_text || "Subscribe"}
                </button>
              </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {slice.items.map((item, index) => (
                <a
                  key={index}
                  href={item.social_link?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-white hover:text-white/90 transition-colors"
                >
                  {item.social_icon.url && (
                    <div className="w-10 h-10 mb-2 rounded-full flex items-center justify-center bg-white/10">
                      <Image
                        src={item.social_icon.url}
                        alt={item.social_icon?.alt || item.social_text || ""}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium text-center text-white">{item.social_text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactAlternate;