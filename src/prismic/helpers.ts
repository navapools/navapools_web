export function localeToPrismicLang(locale: string): string {
	// Normalizar el locale a minúsculas
	const normalizedLocale = locale.toLowerCase();
	
	// Si ya es un locale completo (como 'en-us'), devolverlo tal cual
	if (normalizedLocale.includes('-')) {
		return normalizedLocale;
	}
	
	// Si es un locale corto, convertirlo al formato de Prismic
	switch (normalizedLocale) {
		case "en":
			return "en-us";
		case "es":
			return "es-us";
		default:
			return "en-us";
	}
}
