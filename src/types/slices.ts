import { SliceLike } from "@prismicio/react";
import type * as prismic from "@prismicio/client";

export type PrismicSlice = SliceLike<string> & {
    primary?: Record<string, unknown>;
};

export interface PrismicLink {
    url?: string;
    target?: string;
}

export interface PrismicImage {
    url: string;
    alt?: string;
    dimensions?: {
        width: number;
        height: number;
    };
}

export interface SliceComponentProps {
    slice: prismic.Slice;
}

export type SliceZoneType = prismic.Slice;