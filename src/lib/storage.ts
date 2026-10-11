import type { Farmer, Driver, TransportRequest, ActiveTrip } from '@/types';
import { generateSeedFarmers, generateSeedDrivers } from '@/data/seed';

const KEYS = {
  farmers: 'kcc_farmers',
  drivers: 'kcc_drivers',
  session: 'kcc_session',
  requests: 'kcc_requests',
  trips: 'kcc_trips',
  initialized: 'kcc_initialized',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function getFarmers(): Farmer[] {
  return read<Farmer[]>(KEYS.farmers, []);
}

export function getDrivers(): Driver[] {
  return read<Driver[]>(KEYS.drivers, []);
}

export function saveFarmers(farmers: Farmer[]): void {
  write(KEYS.farmers, farmers);
}

export function saveDrivers(drivers: Driver[]): void {
  write(KEYS.drivers, drivers);
}

// ---------------------------------------------------------------------------
// DEMO DATA: a farmer and a driver in the same location (Sangrur)
// Farmer login: KCC-F-901 / demo123
// Driver login: KCC-D-901 / demo123
// ---------------------------------------------------------------------------

function ensureDemoData(): void {
  if (localStorage.getItem('kcc_demo') === 'v2') return;

  const demoFarmer: Farmer = {
    id: 'KCC-F-901',
    fullName: 'Rajdeep Singh',
    mobile: '9812345678',
    village: 'Sangrur',
    district: 'Sangrur',
    state: 'Punjab',
    farmLocation: 'Sangrur Village, Sangrur',
    coordinates: { lat: 30.2458, lng: 75.8421 },
    cropType: 'Tomato',
    cropQuantity: 1200,
    preferredMandi: 'Khanna Grain Market',
    password: 'demo123',
    verified: true,
  };

  const demoDriver: Driver = {
    id: 'KCC-D-901',
    fullName: 'Khushpal Singh',
    mobile: '9912345678',
    vehicleNumber: 'PB-10-XX-1200',
    vehicleType: 'Mahindra Bolero Maxi Reefer',
    vehicleCapacity: 1250,
    refrigerationType: 'Refrigerated',
    currentDistrict: 'Sangrur',
    currentLocation: 'Sangrur',
    coordinates: { lat: 30.25, lng: 75.845 },
    typicalRoute: 'Ludhiana → Khanna Grain Mandi',
    routeDestination: 'Khanna Grain Market',
    password: 'demo123',
    verified: true,
    available: true,
  };

  saveFarmers([...getFarmers().filter((f) => f.id !== demoFarmer.id), demoFarmer]);
  saveDrivers([...getDrivers().filter((d) => d.id !== demoDriver.id), demoDriver]);

  // clear old test requests and trips, which can leave the driver page stuck
  write(KEYS.requests, []);
  write(KEYS.trips, []);
  localStorage.setItem('kcc_demo', 'v2');
}

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.initialized)) {
    write(KEYS.farmers, generateSeedFarmers());
    write(KEYS.drivers, generateSeedDrivers());
    write(KEYS.requests, []);
    write(KEYS.trips, []);
    localStorage.setItem(KEYS.initialized, 'true');
  }
  ensureDemoData();
}

// ---------------------------------------------------------------------------

export function addFarmer(farmer: Farmer): void {
  const farmers = getFarmers();
  farmers.push(farmer);
  saveFarmers(farmers);
}

export function addDriver(driver: Driver): void {
  const drivers = getDrivers();
  drivers.push(driver);
  saveDrivers(drivers);
}

export function updateDriver(driver: Driver): void {
  const drivers = getDrivers();
  const idx = drivers.findIndex((d) => d.id === driver.id);
  if (idx >= 0) {
    drivers[idx] = driver;
    saveDrivers(drivers);
  }
}

export function updateFarmer(farmer: Farmer): void {
  const farmers = getFarmers();
  const idx = farmers.findIndex((f) => f.id === farmer.id);
  if (idx >= 0) {
    farmers[idx] = farmer;
    saveFarmers(farmers);
  }
}

export function getNextFarmerId(): string {
  const farmers = getFarmers();
  const maxNum = farmers.reduce((max, f) => {
    const num = parseInt(f.id.replace('KCC-F-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `KCC-F-${String(maxNum + 1).padStart(3, '0')}`;
}

export function getNextDriverId(): string {
  const drivers = getDrivers();
  const maxNum = drivers.reduce((max, d) => {
    const num = parseInt(d.id.replace('KCC-D-', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `KCC-D-${String(maxNum + 1).padStart(3, '0')}`;
}

export function authenticateFarmer(id: string, password: string): Farmer | null {
  const farmers = getFarmers();
  const farmer = farmers.find((f) => f.id === id && f.password === password);
  return farmer ?? null;
}

export function authenticateDriver(id: string, password: string): Driver | null {
  const drivers = getDrivers();
  const driver = drivers.find((d) => d.id === id && d.password === password);
  return driver ?? null;
}

export interface Session {
  portal: 'farmer' | 'driver';
  userId: string;
}

// Session is stored per tab (sessionStorage), so a farmer and a driver
// can be logged in at the same time in two tabs/windows of one browser.
// Farmers, drivers, requests and trips stay shared through localStorage.
export function setSession(session: Session): void {
  try {
    sessionStorage.setItem(KEYS.session, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function getSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEYS.session);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(KEYS.session);
}

export function getRequests(): TransportRequest[] {
  return read<TransportRequest[]>(KEYS.requests, []);
}

export function saveRequests(requests: TransportRequest[]): void {
  write(KEYS.requests, requests);
}

export function addRequest(request: TransportRequest): void {
  const requests = getRequests();
  requests.push(request);
  saveRequests(requests);
}

export function updateRequest(updated: TransportRequest): void {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === updated.id);
  if (idx >= 0) {
    requests[idx] = updated;
    saveRequests(requests);
  }
}

export function getTrips(): ActiveTrip[] {
  return read<ActiveTrip[]>(KEYS.trips, []);
}

export function saveTrips(trips: ActiveTrip[]): void {
  write(KEYS.trips, trips);
}

export function addTrip(trip: ActiveTrip): void {
  const trips = getTrips();
  trips.push(trip);
  saveTrips(trips);
}

export function updateTrip(updated: ActiveTrip): void {
  const trips = getTrips();
  const idx = trips.findIndex((t) => t.requestId === updated.requestId);
  if (idx >= 0) {
    trips[idx] = updated;
    saveTrips(trips);
  }
}

export function getTripForDriver(driverId: string): ActiveTrip | null {
  const trips = getTrips();
  return trips.find((t) => t.driverId === driverId) ?? null;
}

export function getRequestsForDriver(driverId: string): TransportRequest[] {
  return getRequests().filter((r) => r.driverId === driverId);
}

export function getRequestsForFarmer(farmerId: string): TransportRequest[] {
  return getRequests().filter((r) => r.farmerId === farmerId);
}