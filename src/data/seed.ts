import type { Farmer, Driver } from '@/types';
import { PUNJAB_LOCATIONS, PUNJAB_MANDIS, PUNJAB_CROPS, VEHICLE_TYPES, REFRIGERATION_TYPES, getCoordinates } from '@/data/locations';

const FIRST_NAMES = [
  'Gurpreet', 'Jarnail', 'Teja', 'Malkit', 'Harjeet', 'Sukhdev', 'Balwinder', 'Manjit',
  'Kulwant', 'Darshan', 'Pargat', 'Surjit', 'Bhupinder', 'Amarjit', 'Gurbax', 'Jaswant',
  'Karnail', 'Mohan', 'Ranjit', 'Devinder', 'Charan', 'Gurmel', 'Harchand', 'Nirmal',
  'Prithipal', 'Sewa', 'Ude', 'Waryam', 'Zora', 'Avtar',
];

const LAST_NAMES = [
  'Singh', 'Kaur', 'Singh', 'Singh', 'Singh', 'Singh', 'Kaur', 'Singh',
  'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh',
  'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh',
  'Singh', 'Singh', 'Singh', 'Singh', 'Singh', 'Singh',
];

const VILLAGES = [
  'Doraha', 'Samrala', 'Khanna', 'Jagraon', 'Moga', 'Phagwara', 'Barnala',
  'Sangrur', 'Hoshiarpur', 'Nawanshahr', 'Kapurthala', 'Patiala', 'Amritsar',
  'Ludhiana', 'Jalandhar',
];

const DISTRICTS = [
  'Ludhiana', 'Ludhiana', 'Ludhiana', 'Ludhiana', 'Moga', 'Kapurthala', 'Barnala',
  'Sangrur', 'Hoshiarpur', 'Shahid Bhagat Singh Nagar', 'Kapurthala', 'Patiala', 'Amritsar',
  'Ludhiana', 'Jalandhar',
];

const ROUTES = [
  { route: 'Ludhiana → Khanna Grain Mandi', dest: 'Khanna Grain Market' },
  { route: 'Ludhiana → Ludhiana Mandi', dest: 'Ludhiana Mandi' },
  { route: 'Jagraon → Jagraon Mandi', dest: 'Jagraon Mandi' },
  { route: 'Moga → Moga Mandi', dest: 'Moga Mandi' },
  { route: 'Jalandhar → Jalandhar Mandi', dest: 'Jalandhar Mandi' },
  { route: 'Phagwara → Phagwara Mandi', dest: 'Phagwara Mandi' },
  { route: 'Samrala → Samrala Mandi', dest: 'Samrala Mandi' },
  { route: 'Amritsar → Amritsar Mandi', dest: 'Amritsar Mandi' },
  { route: 'Patiala → Patiala Mandi', dest: 'Patiala Mandi' },
  { route: 'Sangrur → Sangrur Mandi', dest: 'Sangrur Mandi' },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickIndex<T>(arr: T[]): number {
  return Math.floor(rand() * arr.length);
}

function generateFarmers(): Farmer[] {
  const farmers: Farmer[] = [];
  for (let i = 0; i < 30; i++) {
    const name = `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`;
    const locIdx = i % VILLAGES.length;
    const village = VILLAGES[locIdx];
    const district = DISTRICTS[locIdx];
    const crop = PUNJAB_CROPS[i % PUNJAB_CROPS.length];
    const mandi = PUNJAB_MANDIS[i % PUNJAB_MANDIS.length];
    const coords = getCoordinates(village);

    farmers.push({
      id: `KCC-F-${String(i + 1).padStart(3, '0')}`,
      fullName: name,
      mobile: `98${String(10000000 + i * 137).slice(0, 8)}`,
      village,
      district,
      state: 'Punjab',
      farmLocation: `${village} Village, ${district}`,
      coordinates: { lat: coords.lat + (rand() - 0.5) * 0.05, lng: coords.lng + (rand() - 0.5) * 0.05 },
      cropType: crop,
      cropQuantity: 200 + Math.floor(rand() * 1800),
      preferredMandi: mandi,
      password: 'farmer123',
      verified: true,
    });
  }
  return farmers;
}

function generateDrivers(): Driver[] {
  const drivers: Driver[] = [];
  for (let i = 0; i < 30; i++) {
    const name = `${FIRST_NAMES[(i + 5) % FIRST_NAMES.length]} ${LAST_NAMES[(i + 5) % LAST_NAMES.length]}`;
    const locIdx = i % VILLAGES.length;
    const location = VILLAGES[locIdx];
    const district = DISTRICTS[locIdx];
    const routeIdx = i % ROUTES.length;
    const route = ROUTES[routeIdx];
    const coords = getCoordinates(location);

    const vehicleType = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
    const capacity = 500 + Math.floor(rand() * 2500);
    const refrig = REFRIGERATION_TYPES[pickIndex(REFRIGERATION_TYPES)];

    drivers.push({
      id: `KCC-D-${String(i + 1).padStart(3, '0')}`,
      fullName: name,
      mobile: `99${String(10000000 + i * 137).slice(0, 8)}`,
      vehicleNumber: `PB-10-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 3) % 26))}-${1000 + i}`,
      vehicleType,
      vehicleCapacity: capacity,
      refrigerationType: refrig,
      currentDistrict: district,
      currentLocation: location,
      coordinates: { lat: coords.lat + (rand() - 0.5) * 0.05, lng: coords.lng + (rand() - 0.5) * 0.05 },
      typicalRoute: route.route,
      routeDestination: route.dest,
      password: 'driver123',
      verified: true,
      available: rand() > 0.2,
    });
  }
  return drivers;
}

export function generateSeedFarmers(): Farmer[] {
  return generateFarmers();
}

export function generateSeedDrivers(): Driver[] {
  return generateDrivers();
}
