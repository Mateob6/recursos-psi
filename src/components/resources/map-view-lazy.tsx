"use client";

import dynamic from "next/dynamic";
import type { Resource } from "@/lib/types";

const MapView = dynamic(
  () => import("@/components/resources/map-view").then((m) => ({ default: m.MapView })),
  { ssr: false }
);

export function LazyMapView({ resources }: { resources: Resource[] }) {
  return <MapView resources={resources} />;
}
