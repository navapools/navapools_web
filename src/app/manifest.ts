import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "NavaPools",
		short_name: "NavaPools",
		description: "Jamstack PWA with Next.js, Prismic, and SendGrid",
		start_url: "/en",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#111827",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
		],
	};
}
