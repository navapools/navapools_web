import { createClient } from "@/prismicio";
import { localeToPrismicLang } from "./helpers";
import type { Navigation, Settings } from "@/types/prismic";

interface NavigationItem {
	link?: { url?: string };
	label?: string;
}

export async function getSettings(locale: string): Promise<Settings> {
	try {
		const client = createClient();
		const result = await client.getSingle("settings", { lang: localeToPrismicLang(locale) });
		return {
			data: {
				site_name: result.data.site_name as string || "NavaPools",
				footer_text: result.data.footer_text as string || ""
			}
		};
	} catch (error) {
		console.warn('Settings not found in Prismic, using fallback:', error);
		return {
			data: {
				site_name: "NavaPools",
				footer_text: ""
			}
		};
	}
}

export async function getNavigation(locale: string): Promise<Navigation> {
	try {
		const client = createClient();
		const result = await client.getSingle("navigation", { lang: localeToPrismicLang(locale) });
		return {
			data: {
				items: (result.data.items || []).map((item: unknown) => {
					const navItem = item as NavigationItem;
					return {
						link: { url: navItem.link?.url || "" },
						label: navItem.label || ""
					};
				})
			}
		};
	} catch (error) {
		console.warn('Navigation not found in Prismic, using fallback:', error);
		return {
			data: {
				items: []
			}
		};
	}
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
        console.log('Could not find page in requested language, checking alternates...', error);
        
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

export async function getAllPages(locale: string) {
    const client = createClient();
    const prismicLang = localeToPrismicLang(locale);

    try {
        // Traer todos los documentos de tipo `page` (paginados por si hay muchos)
        const pages = await client.getAllByType('page', { lang: prismicLang });
        return pages.map(p => ({
            id: p.id,
            uid: p.uid,
            url: `/${locale}/${p.uid}`,
            last_publication_date: p.last_publication_date || p.first_publication_date || null,
        }));
    } catch (error) {
        console.warn('Error fetching all pages for sitemap:', error);
        return [];
    }
}
