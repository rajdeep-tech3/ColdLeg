import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { ActiveTrip, GeoPoint } from '@/types';
import { getCoordinates, getDistanceKm } from '@/data/locations';
import { getFarmers } from '@/lib/storage';
import { getLivePosition, setLivePosition } from '@/lib/liveTracking';

// How long the simulated trip (pickup -> mandi) takes in the demo.
const DEMO_DURATION_MS = 30000;

interface DriverLiveMapProps {
  trip: ActiveTrip;
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

const TRUCK_ICON = L.divIcon({
  className: 'kcc-map-marker',
  html: '<div style="font-size:30px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35));">🚚</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function DriverLiveMap({ trip }: DriverLiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const farmer = getFarmers().find((f) => f.id === trip.farmerId);
  const farmCoord: GeoPoint = farmer?.coordinates ?? getCoordinates(trip.pickup);
  const mandiCoord: GeoPoint = getCoordinates(trip.destination);

  const started = trip.status === 'trip_started';

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [farmCoord.lat, farmCoord.lng],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    L.marker([farmCoord.lat, farmCoord.lng], { icon: FARM_ICON })
      .addTo(map)
      .bindPopup('🌾 Pickup');
    L.marker([mandiCoord.lat, mandiCoord.lng], { icon: MANDI_ICON })
      .addTo(map)
      .bindPopup('🏪 Mandi');

    const routePoints: L.LatLngExpression[] = [
      [farmCoord.lat, farmCoord.lng],
      [mandiCoord.lat, mandiCoord.lng],
    ];
    L.polyline(routePoints, {
      color: '#22c55e',
      weight: 3,
      dashArray: '8 6',
      opacity: 0.7,
    }).addTo(map);

    // Resume from the saved position if the page was refreshed mid-trip
    const saved = getLivePosition(trip.requestId);
    const startProgress = started ? saved?.progress ?? 0 : 0;
    const startLat = lerp(farmCoord.lat, mandiCoord.lat, startProgress / 100);
    const startLng = lerp(farmCoord.lng, mandiCoord.lng, startProgress / 100);

    const truck = L.marker([startLat, startLng], { icon: TRUCK_ICON })
      .addTo(map)
      .bindPopup(`🚚 ${trip.vehicleNumber}`);

    map.fitBounds(L.latLngBounds(routePoints), { padding: [40, 40] });
    setTimeout(() => map.invalidateSize(), 200);
    setProgress(startProgress);

    let timer: number | undefined;

    if (started) {
      const startTime = Date.now() - (startProgress / 100) * DEMO_DURATION_MS;

      const tick = () => {
        const t = Math.min((Date.now() - startTime) / DEMO_DURATION_MS, 1);
        const lat = lerp(farmCoord.lat, mandiCoord.lat, t);
        const lng = lerp(farmCoord.lng, mandiCoord.lng, t);
        const pct = Math.round(t * 100);

        truck.setLatLng([lat, lng]);
        setProgress(pct);
        setLivePosition({
          requestId: trip.requestId,
          lat,
          lng,
          progress: pct,
          updatedAt: Date.now(),
        });

        if (t >= 1 && timer !== undefined) {
          window.clearInterval(timer);
        }
      };

      tick();
      timer = window.setInterval(tick, 500);
    }

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.requestId, started]);

  const totalKm = getDistanceKm(farmCoord, mandiCoord);
  const remainingKm = Math.round(totalKm * (1 - progress / 100) * 10) / 10;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ height: 300 }}
        className="w-full rounded-xl overflow-hidden border border-gray-200 z-0"
      />

      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>{started ? 'Live GPS: Pickup → Mandi' : 'Press Start Trip to begin live tracking'}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Vehicle</p>
          <p className="text-sm font-semibold text-gray-700 truncate">{trip.vehicleNumber}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Total Route</p>
          <p className="text-sm font-semibold text-gray-700">{totalKm} km</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">Remaining</p>
          <p className="text-sm font-semibold text-blue-600">{remainingKm} km</p>
        </div>
      </div>
    </div>
  );
}