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

export function initStorage(): void {
  if (localStorage.getItem(KEYS.initialized)) return;
  const farmers = generateSeedFarmers();
  const drivers = generateSeedDrivers();
  write(KEYS.farmers, farmers);
  write(KEYS.drivers, drivers);
  write(KEYS.requests, []);
  write(KEYS.trips, []);
  localStorage.setItem(KEYS.initialized, 'true');
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

export function setSession(session: Session): void {
  write(KEYS.session, session);
}

export function getSession(): Session | null {
  return read<Session | null>(KEYS.session, null);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session);
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
