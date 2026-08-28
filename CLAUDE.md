# Directorio para recibir apoyos (recursos-psi)

- **URL:** https://recursos-psi.vercel.app
- **Repo:** https://github.com/Mateob6/recursos-psi

## Qué es

Directorio interactivo de recursos de apoyo biopsicosocial para personas afectadas por el terremoto M7.4 de agosto 2026 en Colombia. Parte del **Programa Univalle Contigo**, Facultad de Psicología, Universidad del Valle. Permite buscar, filtrar y contactar servicios psicológicos, de salud, albergues, puntos de acopio y líneas de emergencia. Los datos de contacto (teléfonos, correos) se muestran como texto explícito seleccionable además de botones de acción, para que sean copiables y dictables en emergencias.

## Stack

- Next.js 16 + React 19 + TypeScript (static export)
- Tailwind CSS v4 (tokens semánticos via `@theme inline`)
- Leaflet (mapa interactivo con GPS "Cerca de mí", lazy-loaded via `next/dynamic` solo en secciones con mapa)
- Vercel (hosting estático, auto-deploy on push)
- Vercel Analytics + Speed Insights
- Identidad visual oficial Univalle Contigo: Fuente Poppins (weights 400/600/700), Morado Biopsicosocial (#532888) como acento principal, botones tipo píldora, e iconos SVG oficiales.

## Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # genera /out (static export)
git push         # trigger deploy en Vercel
```

## Datos

Fuente: Google Sheets curado por el equipo del Programa Univalle Contigo (Nelson Molina Valencia, Ph.D).

- **Spreadsheet ID:** `1dZ_LdrQDxj0qI-tL8UNQhiyuohfgax-BgQ1Oz9GSYAg`
- **JSON local:** `src/data/resources.json` (113 recursos, 9 categorías, tags inteligentes)
- **Sync script:** `scripts/sync-sheets.py` — descarga xlsx y regenera el JSON.
  - *Extracción inteligente:* Procesa el texto libre para extraer WhatsApp (`wa.link`), teléfonos (7-10 dígitos y códigos cortos de 3 dígitos ej. 123), correos y URLs válidas.
- **Cron:** GitHub Actions cada 6 horas (`.github/workflows/sync-data.yml`) — si hay cambios, commit + push → Vercel redeploya

```bash
cd scripts && uv run sync-sheets.py    # sync manual
```

### Secciones (6, agrupando 9 categorías)

| Sección | Ruta | Recursos | Categorías agrupadas | Filtros |
|---------|------|----------|---------------------|---------|
| Apoyo Emocional | `/apoyo-emocional` | 48 | psicosocial + lineas_emergencia | ¿Cuándo? ¿Cómo? ¿Dónde? ¿Para quién? |
| Salud | `/salud` | 40 | salud + atencion_primaria | Tipo (EPS/Hospital/Punto/Régimen) + mapa |
| Refugio | `/refugio` | 5 | albergues | Tipo (oficial/comunitario) + mapa |
| Donaciones | `/donaciones` | 9 | acopio | Mapa |
| Guías | `/guias` | 9 | capacitacion + interactivas | Audiencia + Formato |
| Funerarios | `/funerarios` | 2 | funerarios | — |

### Tags inteligentes

Cada recurso tiene `tags` derivados por IA del contenido (no de la estructura del spreadsheet):
- **Apoyo Emocional:** urgencia (ahora/agendar), canales (whatsapp/teléfono/correo/formulario/presencial), cobertura (nacional/cali/otra), población (todos/lgbtiq/mujeres/ninez/persona_mayor/discapacidad/profesionales)
- **Salud:** tipo (eps/hospital/punto_atencion/regimen_especial/informacion)
- **Guías:** audiencia (personas_afectadas/profesionales/comunidad), formato (web/pdf/video)

## Estructura

```
src/
├── app/
│   ├── globals.css              ← tokens morado Univalle Contigo, dark theme lavanda, SVG mask classes
│   ├── layout.tsx               ← Header + Footer + MobileNav + Analytics + Fuente Poppins
│   ├── page.tsx                 ← HOME: Uvardilla + "¿Qué necesitas?" + 6 section cards + stats
│   ├── [section]/page.tsx       ← Página dinámica por sección con Uvardillas dinámicas y filtros
│   ├── mapa/page.tsx            ← Mapa Leaflet con GPS, filtros, "Cómo llegar"
│   ├── icon.svg                 ← Favicon isotipo Univalle Contigo (corazón rojo)
│   ├── opengraph-image.tsx      ← OG image 1200×630 para redes sociales
│   ├── sitemap.ts               ← 8 URLs
│   └── robots.ts                ← allow all + sitemap
├── components/
│   ├── ui/                      ← cn utility
│   ├── layout/                  ← Header, Footer, ThemeToggle, MobileNav
│   └── resources/               ← SectionDirectory, SectionFilters, ResourceCard (contacto explícito + botones), SearchBar, MapView, LazyMapView (wrapper next/dynamic)
├── data/
│   └── resources.json           ← Generado por scripts/sync-sheets.py (con tags + sections)
└── lib/
    └── types.ts                 ← Resource, Section, SECTIONS, SECTION_FILTERS, FilterDimension
scripts/
└── sync-sheets.py               ← Google Sheets → resources.json (cron cada 6h via GitHub Actions)
.github/
└── workflows/sync-data.yml      ← Cron: sync + commit + push si hay cambios
```

## Navegación

| Nivel | Componente | Desktop | Mobile |
|-------|-----------|---------|--------|
| Header | header.tsx | Isotipo corazón + Directorio + Mapa + logo Univalle Contigo + ThemeToggle | Isotipo + Directorio + logo UV + ThemeToggle |
| Bottom nav | mobile-nav.tsx | Oculto | Barra fija: Inicio (Isotipo) / Mapa / Guías |
| Home | page.tsx | 6 cards de sección + stats + banner emergencia | Igual, 1 columna |
| Sección | [section]/page.tsx | Filtros por dimensión + grid 3 cols | Filtros + 1 col |
| Mapa | mapa/page.tsx | Leaflet + filtros + GPS + cards cercanos | Igual, full width |

## Mapa

- 37 puntos geolocalizados en Cali (coordenadas hardcodeadas en `KNOWN_LOCATIONS`)
- Filtros toggle: Atención Primaria / Albergues / Acopio
- GPS "Cerca de mí" con lista de 6 puntos más cercanos ordenados por distancia (Haversine)
- Popups con acciones: WhatsApp, Llamar, Cómo llegar (Google Maps)
- Buscador de markers por nombre/dirección

## Ecosistema terremoto

| Proyecto | Propósito | URL |
|----------|-----------|-----|
| **Directorio para recibir apoyos** (este) | Directorio de recursos de ayuda | recursos-psi.vercel.app |
| reconstruir-psi | Guías educativas basadas en evidencia | reconstruir-psi.vercel.app |
| emergencia-cali (PataMap) | Mascotas perdidas post-sismo | emergencia-cali.web.app |
| bases-datos-emergencia | Análisis datos Univalle Contigo (N=4,644) | local |

Cross-links: recursos-psi → reconstruir-psi (footer únicamente, enlace "Guías de recuperación").

## Identidad institucional

- **Global:** Identidad visual oficial "Univalle Contigo" (Logo completo, isotipo corazón, Uvardilla dinámica por sección, iconos SVG con máscaras de color por estrategia).
- **Autoría (footer):** Mateo Belalcázar Correa (MSc), CIDEAS, Facultad de Psicología, Universidad del Valle

## Performance móvil

Optimizado para lanzamiento masivo a la comunidad Univalle (ago 2026):

- **Imágenes:** Uvardillas en WebP redimensionadas a 2x display size (3.1MB → 16KB, -99.5%). Todas las `<img>` con `width`/`height` explícitos (previene CLS) y `loading="lazy"` en below-fold.
- **Code splitting:** MapView lazy-loaded via `next/dynamic` + `ssr: false` (wrapper `map-view-lazy.tsx`). Solo carga en secciones con mapa (salud, refugio, donaciones).
- **Touch targets:** Mínimo 44px en mobile nav, theme toggle y filter chips (cumple guidelines Apple/Google).
- **Fuentes:** Poppins 3 weights (400/600/700), self-hosted via `next/font/google`.
- **Sin dependencias muertas:** `react-leaflet` removido (nunca se importaba).

## Pendiente: Dominio institucional

El sitio se presentará como uso institucional del Programa Univalle Contigo. El subdominio actual (`recursos-psi.vercel.app`) es técnico/genérico. Opciones a evaluar con Nelson Molina y/o la Universidad:

1. **Subdominio institucional UV** (gratis, burocracia): pedir a TI de Univalle algo como `contigo.univalle.edu.co`
2. **Dominio propio** (~$10-15 USD/año): `univalle-contigo.org`, `recursos-terremoto.co`, etc. Conectar a Vercel es gratis.
3. **Renombrar subdominio Vercel** (gratis, inmediato): `univalle-contigo.vercel.app` o similar

Decisión pendiente de Nelson / Universidad.
