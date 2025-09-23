export function localeToPrismicLang(locale: string): string {
	switch (locale) {
		case "en":
			return "en-us";
		case "es":
			return "es-es";
		default:
			return "en-us";
	}
}
