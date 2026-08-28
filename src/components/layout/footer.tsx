export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <a href="https://www.univalle.edu.co/" target="_blank" rel="noreferrer">
            <img src="/logos/logo1.png" alt="Universidad del Valle" className="h-12 w-auto object-contain" height={48} loading="lazy" />
          </a>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Programa Univalle Contigo</strong> · Universidad del Valle
          </p>
          <p className="text-xs text-[var(--muted)]">
            Datos curados por el equipo del Programa Univalle Contigo.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Elaboración técnica por{" "}
            <a href="https://mateob6.github.io/" target="_blank" rel="noreferrer" className="text-[var(--foreground)] font-bold hover:text-[var(--accent)] hover:underline transition-colors">Mateo Belalcázar Correa</a> (MSc),{" "}
            <a href="https://psicologia.univalle.edu.co/?id=834" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">CIDEAS</a>,{" "}
            <a href="https://psicologia.univalle.edu.co/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">Facultad de Psicología</a>,{" "}
            <a href="https://www.univalle.edu.co/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">Universidad del Valle</a>.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a
              href="https://reconstruir-psi.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Guías de recuperación →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
