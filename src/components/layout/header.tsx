import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="shrink-0 group-hover:opacity-80 transition-opacity">
            <img src="/assets/isotipo-rojo.svg" alt="" className="w-8 h-8 object-contain logo-light" />
            <img src="/assets/isotipo-blanco.svg" alt="" className="w-8 h-8 object-contain logo-dark" />
          </div>
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

          <div className="flex items-center gap-2">
            <a href="https://www.univalle.edu.co/" target="_blank" rel="noreferrer" className="flex items-center">
              <img src="/assets/logo-rojo.svg" alt="Univalle Contigo" className="h-10 w-auto object-contain logo-light" />
              <img src="/assets/logo-blanco.svg" alt="Univalle Contigo" className="h-10 w-auto object-contain logo-dark" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
