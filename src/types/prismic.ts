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

export type ContactAlternateContentType = {
    slice_type: "contact_alternate";
    slice_label: null;
    primary: {
        title: string;
        description: string;
        background_image: {
            url: string;
            dimensions: { width: number; height: number };
            alt?: string;
        };
        button_text: string;
    };
    items: Array<{
        social_icon: {
            url: string;
            dimensions: { width: number; height: number };
            alt?: string;
        };
        social_text: string;
        social_link: { url: string };
    }>;
};

declare module "@prismicio/client" {
    interface Content {
        ContactAlternateSlice: ContactAlternateContentType;
    }
}