export interface ContactData {
    title: string;
    subtitle: string;
    description: string;
    name_placeholder: string;
    email_placeholder: string;
    message_placeholder: string;
    submit_label: string;
    success_title: string;
    success_message: string;
    error_message: string;
    about_title: string;
    about_subtitle: string;
    about_description: import('@prismicio/client').RichTextField | null; // Prismic RichText field
    about_image: {
        url: string;
        alt?: string;
        dimensions?: {
            width: number;
            height: number;
        };
    };
    seo: {
        title: string;
        description: string;
        imageUrl: string;
    };
}

export interface Contact {
    data: ContactData;
}