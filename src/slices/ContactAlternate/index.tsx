"use client";

import Image from "next/image";
import { useState } from "react";

import type { ContactAlternateContentType } from "@/types/prismic";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // detect locale from path for simple i18n (client-only)
  const detectedLocale = typeof window !== "undefined" ? (window.location.pathname.split("/")[1] || "en") : "en";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const trimmedEmail = String(email || "").trim();
    if (!trimmedEmail) {
      setStatus("ERROR");
      setIsSubmitting(false);
      return;
    }

    // try to detect locale from path (first segment)
  // keep the same detectedLocale from render

      try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: slice.primary.title || "Subscriber",
          email: trimmedEmail,
          message: `${detectedLocale === "es" ? "El usuario solicita información a este correo electrónico." : "The user requests information to this email address."}`,
          type: "subscribe",
          locale: detectedLocale,
        }),
      });

      if (res.ok) {
        setStatus("SUCCESS");
        setEmail("");
        setTimeout(() => setStatus(null), 6000);
      } else {
        console.error("ContactAlternate submit failed", await res.text());
        setStatus("ERROR");
      }
    } catch (err) {
      console.error("ContactAlternate error sending email:", err);
      setStatus("ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isModalOpen = status === "SUCCESS";
  return (
    <section className={`relative min-h-screen flex items-center bg-gradient-to-b from-blue-900 to-blue-800${isModalOpen ? ' pointer-events-none select-none' : ''}`}> 
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
                        placeholder={"Enter your email"}
                      className="flex-grow px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:translate-y-[-2px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (detectedLocale === "es" ? "Enviando..." : "Sending...") : (slice.primary.button_text || "Subscribe")}
                    </button>
                  </div>
                </form>

                {/* Success / Error UI */}
                {status === "SUCCESS" && (
                  <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-[9999] pointer-events-auto select-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
                      <div className="text-center">
                        <div className="text-green-500 text-4xl mb-4">✓</div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">
                          {detectedLocale === "es" ? "Registro exitoso" : "Subscription received"}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {detectedLocale === "es" ? (
                            <>
                              Gracias. Hemos recibido la solicitud y enviaremos información a <strong className="text-blue-900">{email}</strong>. Nuestro equipo se pondrá en contacto a la brevedad.
                            </>
                          ) : (
                            <>
                              Thank you. We&apos;ve received the request and will send information to <strong className="text-blue-900">{email}</strong>. Our team will reach out shortly.
                            </>
                          )}
                        </p>
                        <button 
                          onClick={() => setStatus(null)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {detectedLocale === "es" ? "Cerrar" : "Close"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {status === "ERROR" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    {(detectedLocale === "es" ? "No se pudo enviar. Intenta nuevamente más tarde." : "Failed to send. Please try again later.")}
                  </div>
                )}
              </Reveal>

              {!isModalOpen && (
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
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactAlternate;