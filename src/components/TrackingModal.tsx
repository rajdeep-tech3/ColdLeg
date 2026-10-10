import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { X } from 'lucide-react';
import type { GeoPoint, Driver, TransportRequest } from '@/types';
import { getCoordinates, getDistanceKm } from '@/data/locations';

interface TrackingModalProps {
  open: boolean;
  onClose: () => void;
  farmerCoord: GeoPoint;
  mandiCoord: GeoPoint;
  driver: Driver | null;
  request: TransportRequest | null;
  mode: 'vehicle' | 'shipment';
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
  html: '<div style="font-size:30px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35));transition:all 0.5s ease;">🚚</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function TrackingModal({ open, onClose, farmerCoord, mandiCoord, driver, request, mode }: TrackingModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [vehicleCoord, setVehicleCoord] = useState<GeoPoint>(driver?.coordinates ?? farmerCoord);

  const driverStartCoord = driver?.coordinates ?? farmerCoord;
  const driverName = driver?.fullName ?? request?.driverName ?? 'Driver';
  const vehicleType = driver?.vehicleType ?? request?.vehicleType ?? '';
  const vehicleNumber = driver?.vehicleNumber ?? request?.vehicleNumber ?? '';
  const tripStatus = request?.status ?? 'waiting';

  useEffect(() => {
    if (!open || !containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [farmerCoord.lat, farmerCoord.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
      truckMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, [open, farmerCoord]);

  useEffect(() => {
    const map = mapRef.current;
    if (!open || !map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Farm marker
    L.marker([farmerCoord.lat, farmerCoord.lng], { icon: FARM_ICON })
      .addTo(map)
      .bindPopup('<div style="font-weight:600;color:#16a34a;">🌾 Your Farm (Pickup)</div>');

    // Mandi marker
    L.marker([mandiCoord.lat, mandiCoord.lng], { icon: MANDI_ICON })
      .addTo(map)
      .bindPopup('<div style="font-weight:600;color:#2563eb;">🏪 Destination Mandi</div>');

    // Route: driver -> farm -> mandi (for vehicle mode) or farm -> mandi (for shipment mode)
    const routePoints: L.LatLngExpression[] =
      mode === 'vehicle'
        ? [
            [driverStartCoord.lat, driverStartCoord.lng],
            [farmerCoord.lat, farmerCoord.lng],
            [mandiCoord.lat, mandiCoord.lng],
          ]
        : [
            [farmerCoord.lat, farmerCoord.lng],
            [mandiCoord.lat, mandiCoord.lng],
          ];

    const routeLine = L.polyline(routePoints, {
      color: '#22c55e',
      weight: 3,
      dashArray: '8 6',
      opacity: 0.7,
    }).addTo(map);
    routeLineRef.current = routeLine;

    // Truck marker at start position
    const startPos =
      mode === 'vehicle' ? driverStartCoord : farmerCoord;
    const truckMarker = L.marker([startPos.lat, startPos.lng], { icon: TRUCK_ICON })
      .addTo(map)
      .bindPopup(
        `<div style="min-width:160px;padding:4px;">` +
        `<div style="font-weight:700;font-size:14px;color:#1f2937;margin-bottom:2px;">🚚 ${driverName}</div>` +
        `<div style="font-size:12px;color:#6b7280;">${vehicleType}</div>` +
        `<div style="font-size:12px;color:#6b7280;">${vehicleNumber}</div>` +
        `</div>`
      );
    truckMarkerRef.current = truckMarker;

    // Fit bounds
    map.fitBounds(L.latLngBounds(routePoints), { padding: [50, 50] });

    setProgress(0);
    setVehicleCoord(startPos);

    // Animate the truck along the route
    const totalDuration = 15000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / totalDuration, 1);

      let lat: number, lng: number;

      if (mode === 'vehicle') {
        // driver -> farm -> mandi (two segments)
        if (t < 0.5) {
          const segT = t / 0.5;
          lat = lerp(driverStartCoord.lat, farmerCoord.lat, segT);
          lng = lerp(driverStartCoord.lng, farmerCoord.lng, segT);
        } else {
          const segT = (t - 0.5) / 0.5;
          lat = lerp(farmerCoord.lat, mandiCoord.lat, segT);
          lng = lerp(farmerCoord.lng, mandiCoord.lng, segT);
        }
      } else {
        // farm -> mandi (one segment)
        lat = lerp(farmerCoord.lat, mandiCoord.lat, t);
        lng = lerp(farmerCoord.lng, mandiCoord.lng, t);
      }

      truckMarker.setLatLng([lat, lng]);
      setVehicleCoord({ lat, lng });
      setProgress(Math.round(t * 100));

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [open, farmerCoord, mandiCoord, driverStartCoord, mode, driverName, vehicleType, vehicleNumber]);

  if (!open) return null;

  const totalDistance = getDistanceKm(farmerCoord, mandiCoord);
  const driverToFarm = mode === 'vehicle' ? getDistanceKm(driverStartCoord, farmerCoord) : 0;
  const fullRouteDistance = driverToFarm + totalDistance;
  const remainingKm = Math.round((fullRouteDistance * (1 - progress / 100)) * 10) / 10;

  const statusLabel =
    mode === 'shipment'
      ? tripStatus === 'trip_started'
        ? '🟢 Trip Started — En Route to Mandi'
        : tripStatus === 'accepted'
        ? '✓ Load Accepted — Heading to Pickup'
        : '🟡 Waiting for Driver'
      : '📍 Vehicle Approaching Your Farm';

  const statusColor =
    mode === 'shipment'
      ? tripStatus === 'trip_started'
        ? 'text-blue-600 bg-blue-50'
        : tripStatus === 'accepted'
        ? 'text-green-600 bg-green-50'
        : 'text-amber-600 bg-amber-50'
      : 'text-green-600 bg-green-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {mode === 'vehicle' ? '📍 Track Selected Vehicle' : '🚚 Track Active Shipment'}
            </h2>
            <p className="text-sm text-gray-500">{driverName} | {vehicleType}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-100">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Map */}
        <div className="p-4">
          <div
            ref={containerRef}
            style={{ height: 360 }}
            className="w-full rounded-xl overflow-hidden border border-gray-200 z-0"
          />
        </div>

        {/* Info footer */}
        <div className="px-5 pb-5 space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>{mode === 'vehicle' ? 'Driver → Farm → Mandi' : 'Farm → Mandi'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-400 mb-1">Vehicle</p>
              <p className="text-sm font-semibold text-gray-700 truncate">{vehicleNumber || '—'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-400 mb-1">Total Route</p>
              <p className="text-sm font-semibold text-gray-700">{fullRouteDistance} km</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-400 mb-1">Remaining</p>
              <p className="text-sm font-semibold text-green-600">{remainingKm} km</p>
            </div>
          </div>

          {/* Route summary */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-lg">🌾</span>
            <span className="font-medium text-gray-600">Farm</span>
            <span className="flex-1 border-t border-dashed border-gray-300 mx-1" />
            {mode === 'vehicle' && (
              <>
                <span className="text-lg">🚚</span>
                <span className="font-medium text-gray-600">Vehicle</span>
                <span className="flex-1 border-t border-dashed border-gray-300 mx-1" />
              </>
            )}
            <span className="text-lg">🏪</span>
            <span className="font-medium text-gray-600">Mandi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
