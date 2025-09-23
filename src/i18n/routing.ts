export const locales = ["en", "es"] as const;
export type AppLocale = typeof locales[number];

export const defaultLocale: AppLocale = "en";

export const localePrefix = "always" as const; // URLs prefixed with locale
