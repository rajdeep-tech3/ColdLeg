import type { GeoPoint } from '@/types';

interface MapViewProps {
  points: { coord: GeoPoint; label: string; color: string }[];
  height?: number;
}

export function MapView({ points, height = 200 }: MapViewProps) {
  if (points.length === 0) return null;

  const minLat = Math.min(...points.map((p) => p.coord.lat));
  const maxLat = Math.max(...points.map((p) => p.coord.lat));
  const minLng = Math.min(...points.map((p) => p.coord.lng));
  const maxLng = Math.max(...points.map((p) => p.coord.lng));

  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;
  const padding = 0.15;

  const toXY = (coord: GeoPoint) => {
    const x = ((coord.lng - minLng) / lngRange) * (100 - 2 * padding * 100) + padding * 100;
    const y = (1 - (coord.lat - minLat) / latRange) * (100 - 2 * padding * 100) + padding * 100;
    return { x, y };
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-green-50"
      style={{ height }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#d1fae5" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {points.length >= 2 && (
          <line
            x1={toXY(points[0].coord).x}
            y1={toXY(points[0].coord).y}
            x2={toXY(points[1].coord).x}
            y2={toXY(points[1].coord).y}
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
        )}

        {points.map((p, i) => {
          const { x, y } = toXY(p.coord);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="2.5" fill={p.color} opacity="0.3" />
              <circle cx={x} cy={y} r="1.5" fill={p.color} />
              <text x={x} y={y - 3} fontSize="3" textAnchor="middle" fill="#374151" fontWeight="600">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
