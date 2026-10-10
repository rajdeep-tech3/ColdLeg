import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { GeoPoint, Driver, MatchResult } from '@/types';
import { getDistanceKm } from '@/data/locations';

interface VehicleMarker {
  driver: Driver;
  match: MatchResult;
}

interface LeafletMapProps {
  farmerCoord: GeoPoint;
  mandiCoord: GeoPoint;
  vehicles: VehicleMarker[];
  height?: number;
}

const FARM_ICON = L.divIcon({
  className: 'kcc-map-marker',
  html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🌾</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const MANDI_ICON = L.divIcon({
  className: 'kcc-map-marker',
  html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🏪</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function makeVehicleIcon(isBest: boolean): L.DivIcon {
  const size = isBest ? 36 : 28;
  const ring = isBest ? 'ring-2 ring-green-400 rounded-full' : '';
  return L.divIcon({
    className: 'kcc-map-marker',
    html: `<div style="font-size:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));${isBest ? 'animation:pulse 2s infinite;' : ''}" class="${ring}">🚚</div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
}

export function LeafletMap({ farmerCoord, mandiCoord, vehicles, height = 300 }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [farmerCoord.lat, farmerCoord.lng],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Farmer marker
    L.marker([farmerCoord.lat, farmerCoord.lng], { icon: FARM_ICON })
      .addTo(map)
      .bindPopup('<div style="font-weight:600;color:#16a34a;">🌾 Your Farm</div>');

    // Mandi marker
    L.marker([mandiCoord.lat, mandiCoord.lng], { icon: MANDI_ICON })
      .addTo(map)
      .bindPopup('<div style="font-weight:600;color:#2563eb;">🏪 Destination Mandi</div>');

    // Dashed route line
    L.polyline(
      [
        [farmerCoord.lat, farmerCoord.lng],
        [mandiCoord.lat, mandiCoord.lng],
      ],
      { color: '#3b82f6', weight: 2, dashArray: '6 6', opacity: 0.6 }
    ).addTo(map);

    // Vehicle markers
    vehicles.forEach(({ driver, match }, idx) => {
      const isBest = idx === 0;
      const distance = getDistanceKm(farmerCoord, driver.coordinates);
      const scoreColor = match.score >= 85 ? '#16a34a' : match.score >= 70 ? '#2563eb' : '#d97706';

      L.marker([driver.coordinates.lat, driver.coordinates.lng], { icon: makeVehicleIcon(isBest) })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:180px;padding:4px;">` +
          `<div style="font-weight:700;font-size:14px;color:#1f2937;margin-bottom:4px;">${driver.fullName}</div>` +
          `<div style="font-size:12px;color:#6b7280;margin-bottom:6px;">${driver.vehicleType}</div>` +
          `<div style="display:flex;gap:8px;font-size:12px;color:#4b5563;margin-bottom:2px;">📦 ${driver.vehicleCapacity} kg available</div>` +
          `<div style="display:flex;gap:8px;font-size:12px;color:#4b5563;margin-bottom:2px;">📍 ${distance} km away</div>` +
          `<div style="display:flex;gap:8px;font-size:12px;color:#4b5563;margin-bottom:6px;">🌡 ${driver.refrigerationType}</div>` +
          `<div style="display:inline-block;padding:2px 10px;border-radius:8px;background:${scoreColor}15;color:${scoreColor};font-weight:700;font-size:13px;">Match Score: ${match.score}%</div>` +
          `</div>`
        );
    });

    // Fit bounds to include all markers
    const allCoords: L.LatLngExpression[] = [
      [farmerCoord.lat, farmerCoord.lng],
      [mandiCoord.lat, mandiCoord.lng],
      ...vehicles.map((v) => [v.driver.coordinates.lat, v.driver.coordinates.lng] as L.LatLngExpression),
    ];

    if (vehicles.length > 0) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    } else {
      map.setView([farmerCoord.lat, farmerCoord.lng], 11);
    }
  }, [farmerCoord, mandiCoord, vehicles]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full rounded-xl overflow-hidden border border-gray-200 z-0"
    />
  );
}
