# Recursos Psi

- **URL:** https://recursos-psi.vercel.app
- **Repo:** (pendiente crear en GitHub)

## Qué es

Directorio interactivo de recursos de apoyo biopsicosocial para personas afectadas por el terremoto M7.4 de agosto 2026 en Colombia. Parte del programa **Univalle Contigo** de la Facultad de Psicología, Universidad del Valle. Permite buscar, filtrar y contactar servicios psicológicos, de salud, albergues, puntos de acopio y líneas de emergencia.

## Stack

- Next.js 16 + React 19 + TypeScript (static export)
- Tailwind CSS v4 (tokens semánticos via `@theme inline`)
- Leaflet (mapa interactivo de puntos físicos en Cali)
- Vercel (hosting estático)
- Vercel Analytics + Speed Insights
- Paleta carmesí Univalle (#9B1B30) + warm cream/stone (compartida con reconstruir-psi)

## Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # genera /out (static export)
git push         # trigger deploy en Vercel
```

## Datos

Fuente: Google Sheets curado por el equipo de Univalle Contigo (Nelson Molina Valencia, Ph.D).

- **Spreadsheet ID:** `1dZ_LdrQDxj0qI-tL8UNQhiyuohfgax-BgQ1Oz9GSYAg`
- **JSON local:** `src/data/resources.json` (113 recursos, 9 categorías)
- **Sync script:** `scripts/sync-sheets.py` — descarga xlsx y regenera el JSON

```bash
cd scripts && uv run sync-sheets.py
```

### Categorías (9)

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| psicosocial | 33 | Servicios de atención psicológica y acompañamiento emocional |
| lineas_emergencia | 15 | Líneas telefónicas de atención inmediata |
| salud | 17 | EPS, entidades de gobierno, redes de salud |
| atencion_primaria | 23 | Puntos extramurales, puestos móviles, hospitales (Cali) |
| albergues | 5 | Albergues oficiales y comunitarios (Cali) |
| acopio | 9 | Puntos de donaciones activos (Cali) |
| capacitacion | 7 | Guías, manuales, recursos de formación |
| funerarios | 2 | Servicios funerarios solidarios |
| interactivas | 2 | Plataformas web de ayuda |

## Estructura

```
src/
├── app/
│   ├── globals.css              ← tokens carmesí/cream/stone (idénticos a reconstruir-psi)
│   ├── layout.tsx               ← Header + Footer + Analytics
│   ├── page.tsx                 ← HOME: hero + stats + banner emergencia + directorio
│   └── mapa/
│       └── page.tsx             ← Mapa Leaflet de puntos físicos en Cali
├── components/
│   ├── ui/                      ← cn utility
│   ├── layout/                  ← Header, Footer, ThemeToggle
│   └── resources/               ← ResourceDirectory, ResourceCard, SearchBar, CategoryTabs, MapView
├── data/
│   └── resources.json           ← Generado por scripts/sync-sheets.py
└── lib/
    └── types.ts                 ← Resource, ResourceCategory, CATEGORIES, ContactInfo
scripts/
└── sync-sheets.py               ← Google Sheets → resources.json
```

## Ecosistema terremoto

| Proyecto | Propósito | URL |
|----------|-----------|-----|
| **recursos-psi** (este) | Directorio de recursos de ayuda | recursos-psi.vercel.app |
| reconstruir-psi | Guías educativas basadas en evidencia | reconstruir-psi.vercel.app |
| emergencia-cali (PataMap) | Mascotas perdidas post-sismo | emergencia-cali.web.app |
| bases-datos-emergencia | Análisis datos Univalle Contigo (N=4,644) | local |

## Instituciones

- **Universidad del Valle** — logo1.png
- **Facultad de Psicología** — logo2.png
- **CIDEAS** — Grupo de investigación (texto)
- **Univalle Contigo** — Programa institucional de respuesta al terremoto
