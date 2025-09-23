import { createClient } from "@/prismicio";
import { localeToPrismicLang } from "./helpers";
import type { Navigation, Settings } from "@/types/prismic";

export async function getSettings(locale: string): Promise<Settings> {
	const client = createClient();
	const result = await client.getSingle("settings", { lang: localeToPrismicLang(locale) });
	return {
		data: {
			site_name: result.data.site_name as string,
			footer_text: result.data.footer_text as string
		}
	};
}

export async function getNavigation(locale: string): Promise<Navigation> {
	const client = createClient();
	const result = await client.getSingle("navigation", { lang: localeToPrismicLang(locale) });
	return {
		data: {
			items: (result.data.items || []).map((item: { link?: { url?: string }; label?: string }) => ({
				link: { url: item.link?.url || "" },
				label: item.label || ""
			}))
		}
	};
}

export async function getPageByUID(locale: string, uid: string) {
	const client = createClient();
	return await client.getByUID("page", uid, { lang: localeToPrismicLang(locale) });
}
