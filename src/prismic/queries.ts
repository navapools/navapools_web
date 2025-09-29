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
    const prismicLang = localeToPrismicLang(locale);
    
    console.log('Attempting to fetch page:', {
        locale,
        prismicLang,
        uid
    });

    try {
        // Intentar obtener la página directamente con el idioma especificado
        const page = await client.getByUID('page', uid, { lang: prismicLang });
        console.log('Found page in requested language:', {
            id: page.id,
            uid: page.uid,
            lang: page.lang,
            alternate_languages: page.alternate_languages
        });
        return page;
    } catch (error) {
        console.log('Could not find page in requested language, checking alternates...');
        
        try {
            // Si no se encuentra en el idioma solicitado, obtener la página en inglés
            const englishPage = await client.getByUID('page', uid, { lang: 'en-us' });
            
            if (englishPage.alternate_languages?.length > 0) {
                // Buscar la versión en el idioma solicitado en las alternate_languages
                const alternate = englishPage.alternate_languages.find(
                    alt => alt.lang === prismicLang && alt.type === 'page'
                );

                if (alternate?.id) {
                    // Si existe una versión en el idioma solicitado, obtenerla por ID
                    const localizedPage = await client.getByID(alternate.id);
                    console.log('Found localized version:', {
                        id: localizedPage.id,
                        uid: localizedPage.uid,
                        lang: localizedPage.lang,
                        alternate_languages: localizedPage.alternate_languages
                    });
                    return localizedPage;
                }
            }

            // Si no hay alternativa, devolver la página en inglés
            console.log('No localized version found, falling back to English:', {
                id: englishPage.id,
                uid: englishPage.uid,
                lang: englishPage.lang,
                alternate_languages: englishPage.alternate_languages
            });
            return englishPage;
        } catch (innerError) {
            console.error('Error fetching any version of the page:', innerError);
            throw innerError;
        }
    }
}
