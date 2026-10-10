import type { GeoPoint } from '@/types';
import { PUNJAB_LOCATIONS } from '@/data/locations';

export function getCurrentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

export function findNearestLocation(point: GeoPoint): string {
  let nearest = '';
  let minDist = Infinity;
  for (const [name, info] of Object.entries(PUNJAB_LOCATIONS)) {
    const dLat = info.coordinates.lat - point.lat;
    const dLng = info.coordinates.lng - point.lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDist) {
      minDist = dist;
      nearest = name;
    }
  }
  return nearest;
}
