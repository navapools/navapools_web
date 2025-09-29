import type { SliceComponentProps } from "@/types/slices";
import Image from "next/image";

export default function TrustBar({ slice }: SliceComponentProps) {
    const items = (slice.items || []).map(item => ({
        icon: item.icon as { url: string; alt: string },
        text: item.text as string
    }));

    return (
        <section className="bg-white py-8 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {item.icon?.url && (
                                <Image
                                    src={item.icon.url}
                                    alt={item.icon.alt || ""}
                                    width={40}
                                    height={40}
                                    className="mb-3"
                                />
                            )}
                            {item.text && (
                                <span className="text-sm text-gray-600">
                                    {item.text}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}