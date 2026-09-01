"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface RutaItem {
  title: string;
  src: string;
  alt: string;
}

const ITEMS: RutaItem[] = [
  {
    title: "Fase 1: Salud Física",
    src: "/assets/ruta/ruta-salud-fisica.webp",
    alt: "Ruta de atención - Fase 1: Salud Física",
  },
  {
    title: "Fase 1: Psicosocial",
    src: "/assets/ruta/ruta-psicosocial.webp",
    alt: "Ruta de atención - Fase 1: Psicosocial",
  },
  {
    title: "Fase 2: Guía de Contactos",
    src: "/assets/ruta/ruta-contactos.webp",
    alt: "Ruta de atención - Fase 2: Guía de Contactos",
  },
];

const AUTO_ADVANCE_INTERVAL = 6000;

export function RutaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? ITEMS.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === ITEMS.length - 1 ? 0 : prev + 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || lightboxIndex !== null) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, lightboxIndex, nextSlide]);

  // Handle ESC and Arrow keys for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === 0 ? ITEMS.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === ITEMS.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {ITEMS.map((item, index) => (
              <div
                key={item.src}
                className="w-full flex-shrink-0 cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                <div className="relative aspect-[2339/1654] w-full bg-[var(--surface)]">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Subtle hover hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/10 pointer-events-none">
                    <span className="rounded-full bg-[var(--surface)]/90 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-md backdrop-blur-sm flex items-center gap-1.5 border border-[var(--border)]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                      Clic para ampliar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button (Desktop hover) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Diapositiva anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--foreground)] opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-[var(--surface)] group-hover:opacity-100 focus:opacity-100 border border-[var(--border)]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button (Desktop hover) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Siguiente diapositiva"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--foreground)] opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-[var(--surface)] group-hover:opacity-100 focus:opacity-100 border border-[var(--border)]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Footer info & dots */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
            {ITEMS[currentIndex].title}
          </p>

          {/* Navigation Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Selector de diapositivas">
            {ITEMS.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Ir a ${item.title}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-[var(--accent)]"
                      : "w-2.5 bg-[var(--muted)]/40 hover:bg-[var(--muted)]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-6 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative flex flex-col max-h-full max-w-5xl w-full items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls Header */}
            <div className="flex w-full items-center justify-between pb-3 text-white">
              <span className="text-sm sm:text-base font-semibold drop-shadow">
                {ITEMS[lightboxIndex].title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">
                  {lightboxIndex + 1} / {ITEMS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Cerrar vista previa"
                  className="rounded-full bg-white/20 p-1.5 text-white transition hover:bg-white/30 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Image container */}
            <div className="relative w-full max-h-[85vh] overflow-auto rounded-xl bg-black/40 flex items-center justify-center">
              <img
                src={ITEMS[lightboxIndex].src}
                alt={ITEMS[lightboxIndex].alt}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg"
              />

              {/* Modal Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev === 0 ? ITEMS.length - 1 : prev - 1) : 0
                  );
                }}
                aria-label="Imagen anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev === ITEMS.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                aria-label="Siguiente imagen"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
