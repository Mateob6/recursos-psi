import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://recursos-psi.vercel.app"),
  title: {
    default: "Recursos Psi — Programa Univalle Contigo",
    template: "%s — Recursos Psi",
  },
  description:
    "Directorio de recursos de apoyo biopsicosocial para personas afectadas por el terremoto de agosto 2026 en Colombia. Servicios psicológicos, salud, albergues, líneas de emergencia y más.",
  keywords: [
    "terremoto",
    "Colombia",
    "psicosocial",
    "recursos",
    "salud mental",
    "Univalle",
    "Cali",
    "2026",
    "apoyo psicológico",
    "albergues",
    "líneas de emergencia",
  ],
  authors: [{ name: "Programa Univalle Contigo — Facultad de Psicología, Universidad del Valle" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Recursos Psi",
    title: "Recursos Psi — Programa Univalle Contigo",
    description:
      "Directorio de recursos de apoyo biopsicosocial para personas afectadas por el terremoto de agosto 2026.",
    url: "https://recursos-psi.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos Psi — Programa Univalle Contigo",
    description:
      "Directorio de recursos de apoyo biopsicosocial post-terremoto. Servicios psicológicos, salud, albergues y más.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col font-sans bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1 w-full pb-16 sm:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
