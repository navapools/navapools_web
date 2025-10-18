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

// --- Blog helpers ---
export async function getAllBlogs(locale: string) {
    const client = createClient();
    const prismicLang = localeToPrismicLang(locale);

    try {
        // getAllByType may not include 'blog' in generated types; use unknown and safe accessors
    const docs = await (client as unknown as { getAllByType: (type: string, opts?: unknown) => Promise<unknown[]> }).getAllByType('blog', { lang: prismicLang });
        // map to basic shape used by the list page
        return (docs || []).map((d: unknown) => {
            const doc = d as Record<string, unknown>;
            const data = (doc.data as Record<string, unknown>) || {};
            const title = Array.isArray(data.title) ? data.title[0]?.text : data.title;
            const subtitle = Array.isArray(data.subtitle) ? data.subtitle[0]?.text : data.subtitle;
            const excerpt = Array.isArray(data.excerpt) ? data.excerpt[0]?.text : data.excerpt;
            const docRec = doc as Record<string, unknown>;
            return {
                id: String(docRec['id'] || ''),
                uid: String(docRec['uid'] || ''),
                title: title || '',
                subtitle: subtitle || '',
                excerpt: excerpt || '',
                url: `/${locale}/blog/${String(docRec['uid'] || '')}`,
                last_publication_date: (docRec['last_publication_date'] as string) || (docRec['first_publication_date'] as string) || null,
            };
        });
    } catch (error) {
        console.warn('Error fetching blogs from Prismic:', error);
        return [];
    }
}

// --- Contact (single) ---
export async function getContact(locale: string) {
    try {
        const client = createClient();
        const result = await client.getSingle('contact', { lang: localeToPrismicLang(locale) });
        const data = result?.data as any;
        return {
            title: data?.title || 'Contact',
            subtitle: data?.subtitle || '',
            description: data?.description || '',
            name_placeholder: data?.name_placeholder || 'Name *',
            email_placeholder: data?.email_placeholder || 'Email *',
            message_placeholder: data?.message_placeholder || 'Message *',
            submit_label: data?.submit_label || 'Send',
            success_title: data?.success_title || 'Message sent!',
            success_message: data?.success_message || "Thank you for contacting us. We'll get back to you soon.",
            error_message: data?.error_message || 'Error sending message. Please try again.',
            seo: {
                title: data?.seo_title || data?.title || 'Contact',
                description: data?.seo_description || data?.description || '',
                imageUrl: data?.seo_image?.url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com'}/NavaPools_logo.png`
            }
        };
    } catch (error) {
        console.warn('Contact not found in Prismic, using defaults:', error);
        return {
            title: 'Contact',
            subtitle: '',
            description: '',
            name_placeholder: 'Name *',
            email_placeholder: 'Email *',
            message_placeholder: 'Message *',
            submit_label: 'Send',
            success_title: 'Message sent!',
            success_message: "Thank you for contacting us. We'll get back to you soon.",
            error_message: 'Error sending message. Please try again.',
            seo: {
                title: 'Contact | NavaPools',
                description: 'Get in touch with NavaPools for quotes and services in Orlando, FL.',
                imageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://navapools.com'}/NavaPools_logo.png`
            }
        };
    }
}

export async function getBlogByUID(locale: string, uid: string) {
    const client = createClient();
    const prismicLang = localeToPrismicLang(locale);

    try {
    const post = await (client as unknown as { getByUID: (type: string, uid: string, opts?: unknown) => Promise<unknown> }).getByUID('blog', uid, { lang: prismicLang });
    return post as unknown;
    } catch (error) {
        console.warn('Could not find blog in requested language, trying alternates...', error);
        try {
            const englishPost = await (client as unknown as { getByUID: (type: string, uid: string, opts?: unknown) => Promise<unknown> }).getByUID('blog', uid, { lang: 'en-us' });
            const englishRec = englishPost as Record<string, unknown> | null;
            const alternates = englishRec?.alternate_languages as Array<Record<string, unknown>> | undefined;
            if (alternates && alternates.length > 0) {
                const alternate = alternates.find(alt => (alt.lang as string) === prismicLang && (alt.type as string) === 'blog');
                if (alternate && alternate.id) {
                    const localized = await (client as unknown as { getByID: (id: string) => Promise<unknown> }).getByID(alternate.id as string);
                    return localized;
                }
            }
            return englishPost;
        } catch (inner) {
            console.error('Error fetching any version of blog:', inner);
            throw inner;
        }
    }
}
