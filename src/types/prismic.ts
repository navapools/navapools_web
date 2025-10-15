interface NavigationData {
    items: Array<{
        link: {
            url: string;
        };
        label: string;
    }>;
}

interface SettingsData {
    site_name: string;
    footer_text: string;
}

export interface Navigation {
    data: NavigationData;
}

export interface Settings {
    data: SettingsData;
}

interface BlogData {
    title: unknown;
    subtitle?: unknown;
    excerpt?: unknown;
    body?: unknown;
}

export interface Blog {
    id: string;
    uid?: string;
    data: BlogData;
    last_publication_date?: string | null;
}