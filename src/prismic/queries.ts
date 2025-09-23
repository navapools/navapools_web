import { createClient } from "@/prismicio";
import { localeToPrismicLang } from "./helpers";

export async function getSettings(locale: string) {
	const client = createClient();
	return await client.getSingle("settings", { lang: localeToPrismicLang(locale) });
}

export async function getNavigation(locale: string) {
	const client = createClient();
	return await client.getSingle("navigation", { lang: localeToPrismicLang(locale) });
}

export async function getPageByUID(locale: string, uid: string) {
	const client = createClient();
	return await client.getByUID("page", uid, { lang: localeToPrismicLang(locale) });
}
