import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	reactStrictMode: true,
	typedRoutes: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.prismic.io" },
			{ protocol: "https", hostname: "navapools.cdn.prismic.io" }
		],
		// Prefer modern formats where supported; Next will still fall back to
		// supported formats for older browsers.
		formats: ['image/avif', 'image/webp'],
	},
	// Temporarily disabled to avoid potential build chunking issues that
	// can surface as "Cannot find module './XXXX.js'" during prerender.
	// Re-enable if needed after diagnosing build issues.
	// experimental: {
	//     optimizePackageImports: ['@prismicio/client', '@prismicio/react'],
	// },
};

export default withNextIntl(nextConfig);
