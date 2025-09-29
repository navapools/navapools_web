import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales: ["en-us", "es-us"],
    defaultLocale: "en-us",
    localePrefix: "always"
});

export const config = {
    matcher: ["/", "/(en-us|es-us)/:path*"]
};
