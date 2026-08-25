import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, type Resource, type Section } from "@/lib/types";
import data from "@/data/resources.json";
import { SectionDirectory } from "@/components/resources/section-directory";
import { MapView } from "@/components/resources/map-view";

const SECTIONS_WITH_MAP: Section[] = ["salud", "refugio", "donaciones"];

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const meta = SECTIONS.find((s) => s.key === section);
  if (!meta) return {};
  return {
    title: meta.label,
    description: meta.description,
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const sectionKey = section as Section;
  const meta = SECTIONS.find((s) => s.key === sectionKey);
  if (!meta) notFound();

  const resources = (data.resources as Resource[]).filter(
    (r) => r.section === sectionKey
  );

  const showMap = SECTIONS_WITH_MAP.includes(sectionKey);
  const mapResources = showMap
    ? resources.filter((r) => r.address)
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-sm text-[var(--accent)] hover:underline mb-3 inline-block"
        >
          ← ¿Qué necesitas?
        </Link>
        <div className="flex items-center gap-3">
          <span className="svg-icon w-10 h-10" style={{ maskImage: `url(${meta.icon})`, WebkitMaskImage: `url(${meta.icon})`, color: meta.color }} />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
              {meta.label}
            </h1>
            <p className="text-[var(--muted)] text-sm mt-0.5">
              {resources.length} recursos · {meta.description}
            </p>
          </div>
        </div>
        {meta.highlight && (
          <p
            className="mt-3 text-sm font-medium rounded-lg px-3 py-2 inline-block"
            style={{ background: `${meta.color}10`, color: meta.color }}
          >
            {meta.highlight}
          </p>
        )}
      </div>

      {/* Map for physical sections */}
      {showMap && mapResources.length > 0 && (
        <MapView resources={mapResources} />
      )}

      {/* Directory with section-specific filters */}
      <SectionDirectory resources={resources} section={sectionKey} />
    </div>
  );
}
