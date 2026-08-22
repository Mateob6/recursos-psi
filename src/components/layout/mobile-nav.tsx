"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio", icon: "ψ", isInternal: true },
  { href: "/mapa", label: "Mapa", icon: "📍", isInternal: true },
  {
    href: "https://reconstruir-psi.vercel.app",
    label: "Guías",
    icon: "📚",
    isInternal: false,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = item.isInternal && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

          if (item.isInternal) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          }

          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-[var(--muted)] transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
