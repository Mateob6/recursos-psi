"use client";

import { SECTIONS, type Resource } from "@/lib/types";

function ContactActions({ resource }: { resource: Resource }) {
  const c = resource.contact;
  if (!c) return null;

  const actions: { label: string; href: string; icon: string; primary?: boolean }[] = [];

  if (c.whatsapp?.length) {
    actions.push({
      label: "WhatsApp",
      href: c.whatsapp[0],
      icon: "💬",
      primary: true,
    });
  }

  if (c.phones?.length) {
    const phone = c.phones[0].replace(/\s/g, "");
    actions.push({
      label: "Llamar",
      href: `tel:${phone}`,
      icon: "📞",
      primary: !actions.length,
    });
  }

  if (c.emails?.length) {
    actions.push({
      label: "Correo",
      href: `mailto:${c.emails[0]}`,
      icon: "✉️",
    });
  }

  if (c.urls?.length) {
    actions.push({
      label: "Ir al sitio",
      href: c.urls[0],
      icon: "🔗",
    });
  }

  if (!actions.length && resource.url) {
    actions.push({
      label: "Ir al sitio",
      href: resource.url,
      icon: "🔗",
      primary: true,
    });
  }

  if (!actions.length && resource.phone) {
    const phone = resource.phone.replace(/\s/g, "");
    const firstNum = phone.match(/[\d()+]+/)?.[0];
    if (firstNum) {
      actions.push({
        label: "Llamar",
        href: `tel:${firstNum}`,
        icon: "📞",
        primary: true,
      });
    }
  }

  if (!actions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
      {actions.map((a) => (
        <a
          key={a.href}
          href={a.href}
          target={a.href.startsWith("http") ? "_blank" : undefined}
          rel={a.href.startsWith("http") ? "noreferrer" : undefined}
          className={a.primary ? "action-btn action-btn-primary" : "action-btn"}
        >
          <span>{a.icon}</span>
          {a.label}
        </a>
      ))}
    </div>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const cat = SECTIONS.find((s) => s.key === resource.section);

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 space-y-3 transition-all hover:border-[var(--accent)]/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[var(--foreground)] leading-snug">
            {resource.name}
          </h3>
          {resource.center && (
            <p className="text-sm text-[var(--muted)] mt-0.5">{resource.center}</p>
          )}
          {resource.description && (
            <p className="text-sm text-[var(--muted)] mt-0.5 line-clamp-2">{resource.description}</p>
          )}
        </div>
        {cat && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: `${cat.color}15`, color: cat.color }}
          >
            {cat.icon} {cat.label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
        {resource.modality && (
          <span className="flex items-center gap-1">
            {resource.modality === "Virtual" ? "💻" : resource.modality === "Presencial" ? "📍" : "📱"}
            {resource.modality}
          </span>
        )}
        {(resource.city || resource.department) && (
          <span className="flex items-center gap-1">
            📍 {resource.city || resource.department}
          </span>
        )}
        {resource.cost && (
          <span className="flex items-center gap-1">
            {resource.cost === "Gratuito" ? "✅" : "💲"} {resource.cost}
          </span>
        )}
        {resource.status && (
          <span className="flex items-center gap-1">
            {resource.status === "Activo" ? "🟢" : "⚪"} {resource.status}
          </span>
        )}
        {resource.address && (
          <span className="flex items-center gap-1">
            🏢 {resource.address}
          </span>
        )}
      </div>

      {resource.serviceType && (
        <p className="text-sm text-[var(--foreground)]/80">{resource.serviceType}</p>
      )}

      {resource.condition && resource.condition !== "Agendamiento" && (
        <p className="text-xs text-[var(--warning)] bg-[var(--warning-subtle)] rounded-lg px-3 py-1.5">
          ⚠️ {resource.condition}
        </p>
      )}

      {resource.targetPopulation && resource.targetPopulation !== "Personas afectadas directa e indirectamente por el evento sísmico." && (
        <p className="text-xs text-[var(--muted)]">
          👥 {resource.targetPopulation}
        </p>
      )}

      {resource.recommendation && resource.recommendation !== "No cuenta con especificaciones." && (
        <p className="text-xs text-[var(--muted)] italic">
          💡 {resource.recommendation}
        </p>
      )}

      {resource.requirements && (
        <p className="text-xs text-[var(--muted)]">
          📋 {resource.requirements}
        </p>
      )}

      <ContactActions resource={resource} />
    </article>
  );
}
