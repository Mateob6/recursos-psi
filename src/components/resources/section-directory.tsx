"use client";

import { useState, useMemo } from "react";
import type { Resource, Section, FilterDimension } from "@/lib/types";
import { SECTION_FILTERS } from "@/lib/types";
import { SearchBar } from "./search-bar";
import { SectionFilters } from "./section-filters";
import { ResourceCard } from "./resource-card";

interface SectionDirectoryProps {
  resources: Resource[];
  section: Section;
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function matchesFilter(resource: Resource, key: string, value: string): boolean {
  const tags = resource.tags;
  if (!tags) return false;

  const tagValue = (tags as Record<string, unknown>)[key];

  if (Array.isArray(tagValue)) {
    return tagValue.includes(value);
  }

  return tagValue === value;
}

export function SectionDirectory({ resources, section }: SectionDirectoryProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  const dimensions = SECTION_FILTERS[section] || [];

  const filtered = useMemo(() => {
    let result = resources;

    for (const [key, value] of Object.entries(activeFilters)) {
      if (value) {
        result = result.filter((r) => matchesFilter(r, key, value));
      }
    }

    if (search.trim()) {
      const q = normalize(search.trim());
      result = result.filter((r) => {
        const haystack = normalize(
          [r.name, r.center, r.description, r.city, r.department, r.address, r.serviceType, r.modality, r.targetPopulation, r.contact?.raw]
            .filter(Boolean)
            .join(" ")
        );
        return haystack.includes(q);
      });
    }

    return result;
  }, [resources, activeFilters, search]);

  const handleFilterChange = (key: string, value: string | null) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean) || search.trim();

  return (
    <div className="space-y-5">
      <SearchBar
        value={search}
        onChange={setSearch}
        total={resources.length}
        filtered={filtered.length}
      />

      {dimensions.length > 0 && (
        <SectionFilters
          dimensions={dimensions}
          active={activeFilters}
          onChange={handleFilterChange}
        />
      )}

      {hasActiveFilters && filtered.length < resources.length && (
        <button
          onClick={() => { setSearch(""); setActiveFilters({}); }}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          ✕ Limpiar filtros ({filtered.length} de {resources.length})
        </button>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-4xl">🔍</p>
          <p className="text-[var(--muted)]">No se encontraron recursos con esos criterios.</p>
          <button
            onClick={() => { setSearch(""); setActiveFilters({}); }}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
