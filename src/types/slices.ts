import { SliceLike } from "@prismicio/react";

export type PrismicSlice = SliceLike<string> & {
    primary?: Record<string, unknown>;
};

export interface SliceComponentProps {
    slice: PrismicSlice;
}