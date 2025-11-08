import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

type Badge = {
  icon: PrismicImage;
  label: string;
  sublabel?: string;
};

type Plan = {
  image?: PrismicImage;
  name: string;
  description?: string;
  price?: string;
  features?: string; // newline-separated or bullets
  cta_text?: string;
  cta_link?: PrismicLink;
};

export default function Plans({ slice }: SliceComponentProps) {
  const primary = slice.primary as unknown as {
    section_title?: string;
    section_subtitle?: string;
    badges?: Array<{
      icon?: PrismicImage;
      label?: string;
      sublabel?: string;
    }>;
    plans?: Array<{
      image?: PrismicImage;
      name?: string;
      description?: string;
      price?: string;
      features?: string; // can be list text
      cta_text?: string;
      cta_link?: PrismicLink;
    }>;
  };

  const sectionTitle = primary?.section_title || "";
  const sectionSubtitle = primary?.section_subtitle || "";
  const badges: Badge[] = (primary?.badges || []).map((b) => ({
    icon: (b.icon || {}) as PrismicImage,
    label: b.label || "",
    sublabel: b.sublabel || "",
  }));
  const plans: Plan[] = (primary?.plans || []).map((p) => ({
    image: (p.image || {}) as PrismicImage,
    name: p.name || "",
    description: p.description || "",
    price: p.price || "",
    features: p.features || "",
    cta_text: p.cta_text || "",
    cta_link: (p.cta_link || {}) as PrismicLink,
  }));

  const renderFeatures = (features?: string) => {
    if (!features) return null;
    const lines = features
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return null;
    return (
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-600" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section id="plans" className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
      {/* Diagonal background elements */}
      <div className="absolute inset-0">
        {/* Top diagonal band */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-100 via-blue-200 to-transparent transform -skew-y-1 origin-top-left"></div>
        {/* Bottom accent */}
        <div className="absolute bottom-0 right-0 w-1/3 h-20 bg-gradient-to-tl from-blue-200 to-transparent transform skew-y-1 origin-bottom-right"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Top badges section */}
        {badges.length > 0 && (
          <div className="mb-16">
            <Reveal direction="up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {badges.map((b, i) => (
                  <Reveal key={i} direction="up" delayMs={i * 80}>
                    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {b.icon?.url && (
                        <div className="relative w-full h-64">
                          <Image
                            src={b.icon.url}
                            alt={b.icon.alt || ""}
                            fill
                            className="object-cover rounded-t-xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-t-xl"></div>
                        </div>
                      )}
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">
                          {b.label}
                        </h3>
                        {b.sublabel && (
                          <p className="text-gray-600 leading-relaxed">
                            {b.sublabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="space-y-6">
            {sectionTitle && (
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <div className="space-y-4">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {sectionSubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Plans cards */}
          <div className="lg:max-w-xl lg:mx-auto w-full">
            <div className="grid grid-cols-1 gap-6">
              {plans.map((plan, idx) => (
                <Reveal key={idx} direction="up" delayMs={idx * 100}>
                  <div className="group bg-white rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                    {plan.image?.url && (
                      <Reveal direction="up" delayMs={idx * 100 + 60}>
                        <div className="relative h-48">
                          <Image
                            src={plan.image.url}
                            alt={plan.image.alt || plan.name || ""}
                            fill
                            className="object-cover"
                            priority={idx === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                      </Reveal>
                    )}
                    <div className="p-8 flex flex-col grow">
                      <div className="flex items-baseline justify-between gap-3 mb-4">
                        <Reveal direction="up" delayMs={idx * 100 + 120}>
                          <h3 className="text-2xl font-bold text-blue-900">
                            {plan.name}
                          </h3>
                        </Reveal>
                        {plan.price && (
                          <Reveal direction="up" delayMs={idx * 100 + 140}>
                            <span className="text-2xl text-indigo-700 font-bold">
                              {plan.price}
                            </span>
                          </Reveal>
                        )}
                      </div>
                      {plan.description && (
                        <Reveal direction="up" delayMs={idx * 100 + 180}>
                          <p className="mt-2 text-gray-600 text-sm">
                            {plan.description}
                          </p>
                        </Reveal>
                      )}

                      {renderFeatures(plan.features)}

                      {(plan.cta_text || plan.cta_link?.url) && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Reveal direction="up" delayMs={idx * 100 + 220}>
                            <Link
                              href={{ pathname: (plan.cta_link?.url as unknown as string) || "#" }}
                              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-colors"
                            >
                              {plan.cta_text || "Seleccionar"}
                            </Link>
                          </Reveal>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              {plans.length === 0 && (
                <div className="col-span-full text-gray-500">
                  Configure los planes en Prismic para mostrarlos aquí.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


