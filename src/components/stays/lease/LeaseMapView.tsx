import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxToken } from "@/hooks/use-mapbox-token";
import { Link } from "react-router-dom";
import { createRoot, type Root } from "react-dom/client";

export interface MapListing {
  id: string;
  title: string;
  city: string;
  state: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  photos?: string[];
  latitude?: number | null;
  longitude?: number | null;
}

interface Props {
  listings: MapListing[];
  height?: string;
}

const cityFallback: Record<string, [number, number]> = {
  chicago: [-87.6298, 41.8781],
  atlanta: [-84.388, 33.749],
  detroit: [-83.0458, 42.3314],
  houston: [-95.3698, 29.7604],
  "los angeles": [-118.2437, 34.0522],
  "new york": [-74.006, 40.7128],
  philadelphia: [-75.1652, 39.9526],
  memphis: [-90.049, 35.1495],
  baltimore: [-76.6122, 39.2904],
  "washington": [-77.0369, 38.9072],
};

const coordFor = (l: MapListing): [number, number] | null => {
  if (l.latitude != null && l.longitude != null) {
    return [Number(l.longitude), Number(l.latitude)];
  }
  const key = l.city?.toLowerCase().trim();
  if (key && cityFallback[key]) {
    // Spread out markers in same city with tiny jitter from id hash
    const base = cityFallback[key];
    const hash = Array.from(l.id).reduce((a, c) => a + c.charCodeAt(0), 0);
    const jx = ((hash % 100) - 50) / 1500;
    const jy = (((hash >> 3) % 100) - 50) / 1500;
    return [base[0] + jx, base[1] + jy];
  }
  return null;
};

const LeaseMapView: React.FC<Props> = ({ listings, height = "600px" }) => {
  const { token, loading } = useMapboxToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRootsRef = useRef<Array<{ el: HTMLElement; root: Root }>>([]);

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-87.6298, 41.8781],
      zoom: 3.5,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupRootsRef.current.forEach(({ root }) => root.unmount());
      popupRootsRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRootsRef.current.forEach(({ root }) => root.unmount());
    popupRootsRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let added = 0;

    listings.forEach((l) => {
      const c = coordFor(l);
      if (!c) return;

      const el = document.createElement("div");
      el.className =
        "cursor-pointer bg-mansagold text-black font-bold text-xs px-2.5 py-1.5 rounded-full shadow-lg border-2 border-black hover:scale-110 transition-transform";
      el.textContent = `$${Math.round(Number(l.monthly_rent) / 100) / 10}k`;
      if (l.monthly_rent < 10000) el.textContent = `$${Math.round(Number(l.monthly_rent))}`;

      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);
      root.render(
        <Link to={`/stays/lease/${l.id}`} className="block w-48 group">
          <div className="aspect-video bg-gray-200 overflow-hidden">
            {l.photos?.[0] ? (
              <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No photo</div>
            )}
          </div>
          <div className="p-2 bg-white">
            <div className="font-bold text-[#003366] text-sm">${Number(l.monthly_rent).toLocaleString()}/mo</div>
            <div className="text-xs text-gray-700 line-clamp-1">{l.title}</div>
            <div className="text-[11px] text-gray-500">
              {l.bedrooms}bd · {l.bathrooms}ba · {l.city}, {l.state}
            </div>
          </div>
        </Link>
      );
      popupRootsRef.current.push({ el: popupContainer, root });

      const popup = new mapboxgl.Popup({ offset: 16, closeButton: false }).setDOMContent(popupContainer);
      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(c)
        .setPopup(popup)
        .addTo(map);
      markersRef.current.push(marker);
      bounds.extend(c);
      added++;
    });

    if (added > 0) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 11, duration: 600 });
    }
  }, [listings]);

  if (loading) {
    return (
      <div style={{ height }} className="bg-white/5 rounded-xl flex items-center justify-center text-white/60">
        Loading map…
      </div>
    );
  }
  if (!token) {
    return (
      <div style={{ height }} className="bg-white/5 rounded-xl flex items-center justify-center text-white/60 text-sm text-center p-6">
        Map unavailable. Mapbox token not configured.
      </div>
    );
  }

  return <div ref={containerRef} style={{ height }} className="rounded-xl overflow-hidden border border-white/10" />;
};

export default LeaseMapView;
