import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://recursos-psi.vercel.app";
  const routes = [
    { path: "", priority: 1 },
    { path: "/apoyo-emocional", priority: 0.9 },
    { path: "/salud", priority: 0.9 },
    { path: "/mapa", priority: 0.8 },
    { path: "/refugio", priority: 0.8 },
    { path: "/donaciones", priority: 0.8 },
    { path: "/guias", priority: 0.7 },
    { path: "/funerarios", priority: 0.7 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: new Date("2026-08-21"),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
}
