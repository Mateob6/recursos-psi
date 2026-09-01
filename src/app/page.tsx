import Link from "next/link";
import { SECTIONS } from "@/lib/types";
import type { Resource } from "@/lib/types";
import data from "@/data/resources.json";
import { RutaCarousel } from "@/components/resources/ruta-carousel";

export default function HomePage() {
  const resources = data.resources as Resource[];

  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: resources.filter((r) => r.section === s.key).length,
  }));

  const totalGratuitos = resources.filter((r) => r.cost === "Gratuito").length;
  const totalFisicos = resources.filter((r) => r.address).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-14 space-y-10">
      {/* Logo UV + Uvardilla */}
      <div className="flex items-center justify-center gap-4">
        <a href="https://www.univalle.edu.co/" target="_blank" rel="noreferrer" className="hover:scale-105 transition-transform flex items-center">
          <img src="/assets/logo-rojo.svg" alt="Univalle Contigo" className="h-16 md:h-20 w-auto object-contain logo-light" height={80} />
          <img src="/assets/logo-blanco.svg" alt="Univalle Contigo" className="h-16 md:h-20 w-auto object-contain logo-dark" height={80} />
        </a>
        <img
          src="/assets/uvardilla-general.webp"
          alt="Uvardilla"
          className="w-16 md:w-20 h-auto"
          width={170}
          height={256}
        />
      </div>

      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
        <p className="font-mono text-sm tracking-wider uppercase text-[var(--accent)]">
          PROGRAMA UNIVALLE CONTIGO · AGOSTO 2026
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--foreground)]">
          ¿Qué necesitas?
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed">
          {resources.length} recursos verificados de apoyo biopsicosocial para personas afectadas por el terremoto.
        </p>
      </section>

      {/* Quick stats + map CTA */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
          <p className="text-xl font-bold text-[var(--accent)]">{resources.length}</p>
          <p className="text-xs text-[var(--muted)]">Recursos</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
          <p className="text-xl font-bold text-[var(--accent)]">{totalFisicos}</p>
          <p className="text-xs text-[var(--muted)]">Puntos físicos</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
          <p className="text-xl font-bold text-[var(--accent)]">{totalGratuitos}</p>
          <p className="text-xs text-[var(--muted)]">Gratuitos</p>
        </div>
        <Link
          href="/mapa"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center hover:border-[var(--accent)] transition-colors group"
        >
          <p className="text-xl group-hover:text-[var(--accent)] transition-colors">📍</p>
          <p className="text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">Ver mapa</p>
        </Link>
      </div>

      {/* Emergency banner */}
      <div className="bg-[var(--danger-subtle)] border border-[var(--danger)]/20 rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-[var(--danger)]">
          📞 En emergencia inmediata marca{" "}
          <a href="tel:123" className="font-bold underline">123</a>{" "}
          (Emergencias) o{" "}
          <a href="tel:106" className="font-bold underline">106</a>{" "}
          (Apoyo Psicológico Cali)
        </p>
      </div>

      {/* Section cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectionCounts.map((s) => (
          <Link
            key={s.key}
            href={`/${s.key}`}
            className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="svg-icon w-10 h-10" style={{ maskImage: `url(${s.icon})`, WebkitMaskImage: `url(${s.icon})`, color: s.color }} />
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                style={{ background: `${s.color}15`, color: s.color }}
              >
                {s.count}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {s.question}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
              {s.description}
            </p>
            {s.highlight && (
              <p className="text-xs font-medium" style={{ color: s.color }}>
                {s.highlight}
              </p>
            )}
            <span className="absolute bottom-5 right-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      {/* Ruta de atención */}
      <section className="space-y-6 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--foreground)]">
          Rutas de atención Univalle Contigo
        </h2>
        <div className="max-w-3xl mx-auto">
          <RutaCarousel />
        </div>
      </section>

    </div>
  );
}
