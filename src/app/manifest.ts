import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "NavaPools - Pool Maintenance Service",
		short_name: "NavaPools",
		description: "Professional pool cleaning, repair, and maintenance in Orlando, Florida. NavaPools delivers crystal-clear water and reliable service for your home.",
		start_url: "/en",
		display: "standalone",
		background_color: "#0284c7",
		theme_color: "#0284c7",
		icons: [
			{
				src: "/icons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				// Type is restricted by Next's manifest typing. Use a single token like "maskable".
				purpose: "maskable"
			},
			{
				src: "/icons/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
				// Type is restricted by Next's manifest typing. Use a single token like "maskable".
				purpose: "maskable"
			},
			{
				src: "/icons/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png"
			},
			{
				src: "/icons/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png"
			}
		],
	};
}
