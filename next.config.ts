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
	},
};

export default withNextIntl(nextConfig);
