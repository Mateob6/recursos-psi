import type { Metadata } from "next";
import type { Resource } from "@/lib/types";
import data from "@/data/resources.json";
import { MapView } from "@/components/resources/map-view";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapa de Recursos",
  description: "Mapa interactivo de puntos de atención, albergues y puntos de acopio en Cali.",
};

export default function MapaPage() {
  const resources = (data.resources as Resource[]).filter((r) =>
    ["atencion_primaria", "albergues", "acopio"].includes(r.category)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div>
        <Link href="/" className="text-sm text-[var(--accent)] hover:underline mb-2 inline-block">
          ← ¿Qué necesitas?
        </Link>
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
          Mapa de Recursos en Cali
        </h1>
        <p className="text-[var(--muted)] mt-1">
          {resources.length} puntos de atención primaria, albergues y acopio. Usa el botón &quot;Cerca de mí&quot; para encontrar el punto más cercano.
        </p>
      </div>

      <MapView resources={resources} />
    </div>
  );
}
