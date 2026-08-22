"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  function cycle() {
    const next: Theme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    if (next === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    }
  }

  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻";

  return (
    <button
      onClick={cycle}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm transition-colors hover:border-[var(--accent)]"
      aria-label={`Tema: ${theme}`}
      title={`Tema: ${theme}`}
    >
      {icon}
    </button>
  );
}
