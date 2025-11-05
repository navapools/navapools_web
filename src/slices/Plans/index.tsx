import type { SliceComponentProps, PrismicImage, PrismicLink } from "@/types/slices";
import Image from "next/image";
import Link from "next/link";

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-4"
                >
                  {b.icon?.url && (
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                      <Image
                        src={b.icon.url}
                        alt={b.icon.alt || ""}
                        width={80}
                        height={80}
                        className="shrink-0"
                      />
                    </div>
                  )}
                  <div className="leading-tight">
                    <div className="text-lg font-bold text-gray-800 mb-1">
                      {b.label}
                    </div>
                    {b.sublabel && (
                      <div className="text-sm text-gray-600">{b.sublabel}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left copy */}
          <div className="lg:col-span-5">
            {sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-gray-600 leading-relaxed mb-8">
                {sectionSubtitle}
              </p>
            )}
          </div>

          {/* Plans cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
                >
                  {plan.image?.url && (
                    <div className="relative h-40">
                      <Image
                        src={plan.image.url}
                        alt={plan.image.alt || plan.name || ""}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      {plan.price && (
                        <span className="text-indigo-700 font-bold">
                          {plan.price}
                        </span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-2 text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    )}

                    {renderFeatures(plan.features)}

                    {(plan.cta_text || plan.cta_link?.url) && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link
                          href={{ pathname: (plan.cta_link?.url as unknown as string) || "#" }}
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-colors"
                        >
                          {plan.cta_text || "Seleccionar"}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
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


