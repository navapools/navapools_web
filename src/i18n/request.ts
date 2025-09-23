import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
	const supported = ["en", "es"] as const;
	const resolved = supported.includes(locale as any) ? (locale as "en" | "es") : "en";
	const messages = (await import(`./messages/${resolved}.json`)).default;
	return { locale: resolved, messages } as const;
});
