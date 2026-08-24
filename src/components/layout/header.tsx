import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl font-bold text-[var(--accent)] group-hover:opacity-80 transition-opacity">
            ψ
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[var(--foreground)] leading-tight">
              Directorio para recibir apoyos
            </span>
            <span className="text-[11px] text-[var(--muted)] leading-tight hidden sm:block">
              Programa Univalle Contigo
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/mapa"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Mapa
          </Link>

          <a
            href="https://reconstruir-psi.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Guías
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="flex items-center gap-2">
            <a href="https://www.univalle.edu.co/" target="_blank" rel="noreferrer">
              <img src="/logos/logo1.png" alt="Universidad del Valle" className="h-8 w-auto object-contain" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
