"use client";

import type { FilterDimension } from "@/lib/types";

interface SectionFiltersProps {
  dimensions: FilterDimension[];
  active: Record<string, string | null>;
  onChange: (key: string, value: string | null) => void;
}

export function SectionFilters({ dimensions, active, onChange }: SectionFiltersProps) {
  if (!dimensions.length) return null;

  return (
    <div className="space-y-3">
      {dimensions.map((dim) => (
        <div key={dim.key} className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--muted)] w-20 shrink-0">
            {dim.label}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              className="category-chip text-xs"
              data-active={!active[dim.key]}
              onClick={() => onChange(dim.key, null)}
            >
              Todos
            </button>
            {dim.options.map((opt) => (
              <button
                key={opt.value}
                className="category-chip text-xs"
                data-active={active[dim.key] === opt.value}
                onClick={() =>
                  onChange(dim.key, active[dim.key] === opt.value ? null : opt.value)
                }
              >
                {opt.icon && <span>{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
