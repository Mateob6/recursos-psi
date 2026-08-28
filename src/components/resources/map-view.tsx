"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Resource, ResourceCategory } from "@/lib/types";
import { track } from "@/lib/analytics";

const CALI_CENTER: [number, number] = [3.4372, -76.5225];

const KNOWN_LOCATIONS: Record<string, [number, number]> = {
  "Coliseo de Hockey": [3.4246, -76.5375],
  "Coliseo Metropolitano del Norte": [3.4935, -76.5175],
  "CIDIES Parque Los Pinos": [3.3584, -76.5705],
  "Barrio Chiminangos": [3.4799, -76.5030],
  "Bueno Madrid": [3.4448, -76.5344],
  "Ciudadela Petronio / Unidad Deportiva Alberto Galindo": [3.4173, -76.5427],
  "Plazoleta Jairo Varela": [3.4522, -76.5336],
  "Banco de Alimentos": [3.4889, -76.4916],
  "Arena Cañaveralejo / Plaza de Toros": [3.4201, -76.5461],
  "La Casa del Pueblo": [3.4465, -76.5399],
  "Fundación Comedor Comunitario Santa Isabel": [3.4372, -76.5350],
  "Unicentro Cali": [3.3740, -76.5622],
  "Templo de la Moda": [3.4427, -76.5294],
  "Centro Deportivo Universitario CDU San Fernando": [3.4302, -76.5380],
  "Punto Capri": [3.4066, -76.5461],
  "Punto Palmetto": [3.4143, -76.5399],
  "Diamante de Béisbol": [3.4322, -76.5382],
  "Barrio El Lido": [3.4293, -76.5430],
  "Barrio El Refugio": [3.4209, -76.5536],
  "Barrio Pampalinda": [3.4256, -76.5471],
  "Barrio Los Cámbulos": [3.4370, -76.5434],
  "Hospital Cañaveralejo (Red Ladera)": [3.4314, -76.5549],
  "Hospital San Juan de Dios": [3.4476, -76.5362],
  "Hospital Primitivo Iglesias (Red Centro)": [3.4569, -76.5217],
  "Hospital Carlos Holmes Trujillo (Red Oriente)": [3.4576, -76.4799],
  "Hospital Isaías Duarte Cancino": [3.4723, -76.4756],
  "Hospital Mario Correa Rengifo": [3.4223, -76.5567],
  "Punto Red Ladera - Calle 4": [3.4253, -76.5535],
  "Punto Red Ladera - Meléndez/El Refugio": [3.4214, -76.5478],
  "Punto Red Ladera - Capri/Pasoancho": [3.4046, -76.5522],
  "Punto Red Ladera - Tequendama": [3.4283, -76.5396],
  "Sector de Tequendama": [3.4298, -76.5390],
  "Sector Nueva Tequendama": [3.4283, -76.5417],
  "Sector de Alameda": [3.4407, -76.5303],
};

export function getCoords(resource: Resource): [number, number] | null {
  if (resource.coordinates) return [resource.coordinates.lat, resource.coordinates.lng];
  return KNOWN_LOCATIONS[resource.name] || null;
}

const CAT_META: Record<string, { label: string; color: string; icon: string }> = {
  atencion_primaria: { label: "Atención Primaria", color: "#C20E1A", icon: "/assets/icon-corazon.svg" },
  albergues: { label: "Albergues", color: "#AA087C", icon: "/assets/icon-construccion.svg" },
  acopio: { label: "Puntos de Acopio", color: "#DC9122", icon: "/assets/icon-donacion.svg" },
};

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function directionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ", Cali, Colombia")}`;
}

interface MapViewProps {
  resources: Resource[];
  onSelectResource?: (id: string) => void;
}

export function MapView({ resources, onSelectResource }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: L.Marker; resource: Resource }>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [ready, setReady] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<ResourceCategory>>(
    new Set(["atencion_primaria", "albergues", "acopio"])
  );
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [search, setSearch] = useState("");
  const LRef = useRef<typeof import("leaflet") | null>(null);

  const mappable = resources.filter((r) => getCoords(r));

  const toggleCategory = useCallback((cat: ResourceCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  // Update marker visibility when filters/search change
  useEffect(() => {
    const searchLower = search.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    markersRef.current.forEach(({ marker, resource }) => {
      const catVisible = activeCategories.has(resource.category);
      const matchesSearch = !searchLower ||
        (resource.name + " " + (resource.address || "")).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(searchLower);

      const el = marker.getElement();
      if (el) {
        el.style.display = catVisible && matchesSearch ? "" : "none";
      }
    });
  }, [activeCategories, search]);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");
      LRef.current = L;

      const map = L.map(mapRef.current!, {
        center: CALI_CENTER,
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      mappable.forEach((r) => {
        const coords = getCoords(r)!;
        const catMeta = CAT_META[r.category] || { label: "Otro", color: "#9B1B30", icon: "📍" };

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 32px; height: 32px; border-radius: 50%;
            background: ${catMeta.color}; border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; cursor: pointer;
          "><span style="display:block;width:16px;height:16px;background-color:white;mask-image:url(${catMeta.icon});-webkit-mask-image:url(${catMeta.icon});mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;mask-position:center;-webkit-mask-position:center;"></span></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker(coords, { icon });

        let popup = `<div style="min-width:220px;max-width:300px;font-family:system-ui">`;
        popup += `<div style="font-size:15px;font-weight:600;margin-bottom:4px">${r.name}</div>`;
        if (r.address) popup += `<div style="font-size:12px;color:#666;margin-bottom:6px">📍 ${r.address}</div>`;
        if (r.serviceType) popup += `<div style="font-size:12px;margin-bottom:6px">${r.serviceType}</div>`;
        popup += `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">`;

        if (r.contact?.whatsapp?.length) {
          popup += `<a href="${r.contact.whatsapp[0]}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;background:#25D36615;color:#25D366;font-size:12px;font-weight:600;text-decoration:none">💬 WhatsApp</a>`;
        }
        if (r.contact?.phones?.length) {
          popup += `<a href="tel:${r.contact.phones[0].replace(/\s/g, "")}" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;background:#0284c715;color:#0284c7;font-size:12px;font-weight:600;text-decoration:none">📞 Llamar</a>`;
        }
        if (r.address) {
          popup += `<a href="${directionsUrl(r.address)}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;background:#ea433515;color:#ea4335;font-size:12px;font-weight:600;text-decoration:none">🗺️ Cómo llegar</a>`;
        }

        popup += `</div>`;
        popup += `<div style="margin-top:8px"><span style="font-size:11px;padding:2px 8px;border-radius:9px;background:${catMeta.color}15;color:${catMeta.color};display:inline-flex;align-items:center;gap:4px;"><span style="display:block;width:12px;height:12px;background-color:currentColor;mask-image:url(${catMeta.icon});-webkit-mask-image:url(${catMeta.icon});mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;mask-position:center;-webkit-mask-position:center;"></span> ${catMeta.label}</span></div>`;
        popup += `</div>`;

        marker.bindPopup(popup);
        marker.on("click", () => {
          onSelectResource?.(r.id);
        });
        marker.addTo(map);
        markersRef.current.set(r.id, { marker, resource: r });
      });

      mapInstance.current = map;
      setReady(true);
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
      markersRef.current.clear();
    };
  }, [resources]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation || !mapInstance.current || !LRef.current) return;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const L = LRef.current!;
        const map = mapInstance.current!;
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(latlng);
        setLocating(false);
        track("gps");

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(latlng);
        } else {
          const icon = L.divIcon({
            className: "user-marker",
            html: `<div style="
              width: 18px; height: 18px; border-radius: 50%;
              background: #3b82f6; border: 3px solid white;
              box-shadow: 0 0 0 6px rgba(59,130,246,0.2), 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });
          userMarkerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 })
            .bindPopup("<strong>Tu ubicación</strong>")
            .addTo(map);
        }

        map.setView(latlng, 15);
      },
      () => {
        setLocating(false);
        alert("No se pudo obtener tu ubicación.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Sort resources by distance to user
  const sortedByDistance = userPos
    ? [...mappable]
        .map((r) => {
          const coords = getCoords(r)!;
          return { resource: r, distance: haversine(userPos, coords) };
        })
        .sort((a, b) => a.distance - b.distance)
    : null;

  const focusMarker = useCallback((id: string) => {
    const entry = markersRef.current.get(id);
    if (entry && mapInstance.current) {
      const coords = getCoords(entry.resource);
      if (coords) {
        mapInstance.current.setView(coords, 16);
        entry.marker.openPopup();
      }
    }
  }, []);

  const catCounts = {
    atencion_primaria: mappable.filter((r) => r.category === "atencion_primaria").length,
    albergues: mappable.filter((r) => r.category === "albergues").length,
    acopio: mappable.filter((r) => r.category === "acopio").length,
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.entries(CAT_META) as [ResourceCategory, typeof CAT_META[string]][]).map(([key, meta]) => (
          <button
            key={key}
            className="category-chip text-xs"
            data-active={activeCategories.has(key)}
            onClick={() => toggleCategory(key)}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
            {meta.label}
            <span className="opacity-60">{catCounts[key as keyof typeof catCounts]}</span>
          </button>
        ))}

        <div className="flex-1" />

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en el mapa..."
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs w-44 focus:border-[var(--accent)] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-[var(--border)]" />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] rounded-xl">
            <p className="text-[var(--muted)]">Cargando mapa...</p>
          </div>
        )}

        {/* GPS FAB */}
        <button
          onClick={locateMe}
          disabled={locating}
          className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-sm font-medium shadow-md hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all disabled:opacity-50"
          title="Encontrar mi ubicación"
        >
          {locating ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          )}
          <span className="hidden sm:inline">Cerca de mí</span>
        </button>
      </div>

      {/* Nearest resources when GPS active */}
      {sortedByDistance && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            📍 Más cercanos a tu ubicación
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sortedByDistance
              .filter(({ resource }) => activeCategories.has(resource.category))
              .slice(0, 6)
              .map(({ resource, distance }) => {
                const meta = CAT_META[resource.category];
                return (
                  <button
                    key={resource.id}
                    onClick={() => focusMarker(resource.id)}
                    className="text-left rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 hover:border-[var(--accent)]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
                        {resource.name}
                      </p>
                      <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: meta?.color }}>
                        {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                      </span>
                    </div>
                    {resource.address && (
                      <p className="text-xs text-[var(--muted)] mt-1">📍 {resource.address}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-[10px] rounded-full px-2 py-0.5 flex items-center gap-1"
                        style={{ background: `${meta?.color}15`, color: meta?.color }}
                      >
                        <span className="svg-icon w-3 h-3" style={{ maskImage: `url(${meta?.icon})`, WebkitMaskImage: `url(${meta?.icon})` }} /> {meta?.label}
                      </span>
                      {resource.address && (
                        <a
                          href={directionsUrl(resource.address)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => { e.stopPropagation(); track("como-llegar", { recurso: resource.name }); }}
                          className="text-[10px] text-[#ea4335] font-medium hover:underline"
                        >
                          🗺️ Cómo llegar
                        </a>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
