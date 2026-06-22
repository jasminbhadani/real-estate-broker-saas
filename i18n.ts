export const locales = ["en", "gu"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];