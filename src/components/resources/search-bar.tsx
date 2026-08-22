"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  total: number;
  filtered: number;
}

export function SearchBar({ value, onChange, total, filtered }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre, tipo de atención, ciudad..."
        className="search-input pl-12 pr-20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-14 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ✕
        </button>
      )}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] tabular-nums">
        {filtered}/{total}
      </span>
    </div>
  );
}
