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