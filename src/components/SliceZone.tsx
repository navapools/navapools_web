import SliceZoneClient from "./SliceZone.client";
import { SliceZoneType } from "@/types/slices";

export default function SliceZone({ slices }: { slices: SliceZoneType[] }) {
    return <SliceZoneClient slices={slices} />;
}
