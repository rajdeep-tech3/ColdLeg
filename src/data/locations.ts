import type { GeoPoint } from '@/types';

export interface LocationInfo {
  name: string;
  district: string;
  coordinates: GeoPoint;
}

export const PUNJAB_LOCATIONS: Record<string, LocationInfo> = {
  Ludhiana: { name: 'Ludhiana', district: 'Ludhiana', coordinates: { lat: 30.9010, lng: 75.8573 } },
  Khanna: { name: 'Khanna', district: 'Ludhiana', coordinates: { lat: 30.6966, lng: 76.2228 } },
  Samrala: { name: 'Samrala', district: 'Ludhiana', coordinates: { lat: 30.8369, lng: 76.2000 } },
  Doraha: { name: 'Doraha', district: 'Ludhiana', coordinates: { lat: 30.8450, lng: 76.0020 } },
  Jagraon: { name: 'Jagraon', district: 'Ludhiana', coordinates: { lat: 30.7800, lng: 75.3200 } },
  Moga: { name: 'Moga', district: 'Moga', coordinates: { lat: 30.8100, lng: 75.1700 } },
  Jalandhar: { name: 'Jalandhar', district: 'Jalandhar', coordinates: { lat: 31.3260, lng: 75.5710 } },
  Phagwara: { name: 'Phagwara', district: 'Kapurthala', coordinates: { lat: 31.2200, lng: 75.7700 } },
  Amritsar: { name: 'Amritsar', district: 'Amritsar', coordinates: { lat: 31.6340, lng: 74.8723 } },
  Patiala: { name: 'Patiala', district: 'Patiala', coordinates: { lat: 30.3398, lng: 76.3869 } },
  Sangrur: { name: 'Sangrur', district: 'Sangrur', coordinates: { lat: 30.2460, lng: 75.8400 } },
  Barnala: { name: 'Barnala', district: 'Barnala', coordinates: { lat: 30.3800, lng: 75.5500 } },
  Hoshiarpur: { name: 'Hoshiarpur', district: 'Hoshiarpur', coordinates: { lat: 31.5300, lng: 75.9200 } },
  Nawanshahr: { name: 'Nawanshahr', district: 'Shahid Bhagat Singh Nagar', coordinates: { lat: 31.1300, lng: 76.1300 } },
  Kapurthala: { name: 'Kapurthala', district: 'Kapurthala', coordinates: { lat: 31.3800, lng: 75.3800 } },
};

export const PUNJAB_MANDIS = [
  'Khanna Grain Market',
  'Ludhiana Mandi',
  'Jagraon Mandi',
  'Moga Mandi',
  'Jalandhar Mandi',
  'Phagwara Mandi',
  'Samrala Mandi',
  'Amritsar Mandi',
  'Patiala Mandi',
  'Sangrur Mandi',
];

export const PUNJAB_CROPS = [
  'Tomato',
  'Potato',
  'Cauliflower',
  'Peas',
  'Carrot',
  'Capsicum',
  'Onion',
  'Apple',
  'Mango',
  'Wheat',
  'Rice',
];

export const VEHICLE_TYPES = [
  'Mahindra Bolero Maxi Reefer',
  'Tata 407 Refrigerated',
  'Ashok Leyland Dost Reefer',
  'Force Traveller Cold',
  'Maruti Suzuki Super Carry Reefer',
  'Tata Ace Refrigerated',
  'Eicher Pro 3015 Reefer',
  'BharatBenz 1217R Reefer',
];

export const REFRIGERATION_TYPES = [
  'Refrigerated',
  'Frozen',
  'Ambient',
  'Multi-Temperature',
];

export function getCoordinates(locationName: string): GeoPoint {
  const key = Object.keys(PUNJAB_LOCATIONS).find(
    (k) => locationName.toLowerCase().includes(k.toLowerCase())
  );
  if (key) return PUNJAB_LOCATIONS[key].coordinates;
  return PUNJAB_LOCATIONS.Ludhiana.coordinates;
}

export function getDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}
