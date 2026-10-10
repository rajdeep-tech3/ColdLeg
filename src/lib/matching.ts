import type { Farmer, Driver, MatchResult, MatchReason } from '@/types';
import { getDistanceKm, PUNJAB_MANDIS } from '@/data/locations';

const CROP_TEMP_MAP: Record<string, string> = {
  Tomato: 'chilled',
  Potato: 'chilled',
  Cauliflower: 'chilled',
  Peas: 'frozen',
  Carrot: 'chilled',
  Capsicum: 'chilled',
  Onion: 'ambient',
  Apple: 'chilled',
  Mango: 'ambient',
  Wheat: 'ambient',
  Rice: 'ambient',
};

function isRouteCompatible(farmer: Farmer, driver: Driver): boolean {
  const farmerMandi = farmer.preferredMandi.toLowerCase();
  const driverDest = driver.routeDestination.toLowerCase();
  const driverRoute = driver.typicalRoute.toLowerCase();

  if (driverDest.includes(farmerMandi) || farmerMandi.includes(driverDest)) return true;

  for (const mandi of PUNJAB_MANDIS) {
    const m = mandi.toLowerCase();
    if (driverDest.includes(m) && farmerMandi.includes(m)) return true;
    if (driverRoute.includes(m) && farmerMandi.includes(m)) return true;
  }

  const farmerDistrict = farmer.district.toLowerCase();
  const driverDistrict = driver.currentDistrict.toLowerCase();
  if (farmerDistrict === driverDistrict) return true;

  return false;
}

function routeScore(farmer: Farmer, driver: Driver): { score: number; compatible: boolean } {
  const compatible = isRouteCompatible(farmer, driver);
  if (!compatible) return { score: 0, compatible: false };

  const farmerMandi = farmer.preferredMandi.toLowerCase();
  const driverDest = driver.routeDestination.toLowerCase();

  if (driverDest.includes(farmerMandi) || farmerMandi.includes(driverDest)) {
    return { score: 100, compatible: true };
  }

  for (const mandi of PUNJAB_MANDIS) {
    const m = mandi.toLowerCase();
    if (driverDest.includes(m) && farmerMandi.includes(m)) {
      return { score: 90, compatible: true };
    }
  }

  if (farmer.district.toLowerCase() === driver.currentDistrict.toLowerCase()) {
    return { score: 75, compatible: true };
  }

  return { score: 50, compatible: true };
}

function distanceScore(farmer: Farmer, driver: Driver): { score: number; distance: number } {
  const distance = getDistanceKm(farmer.coordinates, driver.coordinates);
  if (distance <= 5) return { score: 100, distance };
  if (distance <= 10) return { score: 90, distance };
  if (distance <= 20) return { score: 75, distance };
  if (distance <= 35) return { score: 55, distance };
  if (distance <= 50) return { score: 35, distance };
  return { score: 15, distance };
}

function capacityScore(farmer: Farmer, driver: Driver): { score: number; fits: boolean } {
  if (driver.vehicleCapacity >= farmer.cropQuantity) {
    const ratio = farmer.cropQuantity / driver.vehicleCapacity;
    if (ratio >= 0.5) return { score: 100, fits: true };
    if (ratio >= 0.3) return { score: 85, fits: true };
    return { score: 70, fits: true };
  }
  return { score: 0, fits: false };
}

function isRefrigerationCompatible(farmer: Farmer, driver: Driver): boolean {
  const cropTemp = CROP_TEMP_MAP[farmer.cropType] ?? 'chilled';
  const refType = driver.refrigerationType.toLowerCase();

  if (cropTemp === 'ambient') return true;
  if (cropTemp === 'chilled' && (refType.includes('refriger') || refType.includes('multi') || refType.includes('frozen'))) return true;
  if (cropTemp === 'frozen' && (refType.includes('frozen') || refType.includes('multi'))) return true;
  return false;
}

function refrigerationScore(farmer: Farmer, driver: Driver): { score: number; compatible: boolean } {
  const compatible = isRefrigerationCompatible(farmer, driver);
  return { score: compatible ? 100 : 0, compatible };
}

function cropScore(farmer: Farmer, driver: Driver): { score: number; suitable: boolean } {
  const cropTemp = CROP_TEMP_MAP[farmer.cropType] ?? 'chilled';
  const refType = driver.refrigerationType.toLowerCase();

  if (cropTemp === 'ambient') return { score: 100, suitable: true };
  if (cropTemp === 'chilled' && (refType.includes('refriger') || refType.includes('multi'))) return { score: 100, suitable: true };
  if (cropTemp === 'frozen' && (refType.includes('frozen') || refType.includes('multi'))) return { score: 100, suitable: true };
  if (cropTemp === 'chilled' && refType.includes('frozen')) return { score: 80, suitable: true };
  return { score: 40, suitable: false };
}

export function calculateMatch(farmer: Farmer, driver: Driver): MatchResult {
  const route = routeScore(farmer, driver);
  const dist = distanceScore(farmer, driver);
  const cap = capacityScore(farmer, driver);
  const refrig = refrigerationScore(farmer, driver);
  const crop = cropScore(farmer, driver);

  const score = Math.round(
    route.score * 0.35 +
    dist.score * 0.25 +
    cap.score * 0.20 +
    refrig.score * 0.10 +
    crop.score * 0.10
  );

  const reasons: MatchReason[] = [];

  if (cap.fits) {
    reasons.push({ icon: '✓', text: 'Enough capacity for your crop', positive: true });
  } else {
    reasons.push({ icon: '✗', text: 'Insufficient capacity', positive: false });
  }

  if (refrig.compatible) {
    reasons.push({ icon: '✓', text: 'Suitable refrigerated vehicle', positive: true });
  } else {
    reasons.push({ icon: '✗', text: 'Refrigeration not compatible', positive: false });
  }

  if (dist.distance <= 15) {
    reasons.push({ icon: '✓', text: `Nearby pickup (${dist.distance} km away)`, positive: true });
  } else {
    reasons.push({ icon: '!', text: `Pickup is ${dist.distance} km away`, positive: false });
  }

  if (route.compatible) {
    reasons.push({ icon: '✓', text: 'Same or compatible route', positive: true });
  } else {
    reasons.push({ icon: '✗', text: 'Route not directly compatible', positive: false });
  }

  return {
    score,
    reasons,
    breakdown: {
      route: route.score,
      distance: dist.score,
      capacity: cap.score,
      refrigeration: refrig.score,
      crop: crop.score,
    },
  };
}

export interface FarmerDriverMatch {
  driver: Driver;
  match: MatchResult;
}

export function findBestDriversForFarmer(farmer: Farmer, drivers: Driver[]): FarmerDriverMatch[] {
  const availableDrivers = drivers.filter((d) => d.available);
  const matches = availableDrivers.map((driver) => ({
    driver,
    match: calculateMatch(farmer, driver),
  }));
  matches.sort((a, b) => b.match.score - a.match.score);
  return matches;
}

export interface DriverFarmerMatch {
  farmer: Farmer;
  match: MatchResult;
}

export function findBestFarmersForDriver(driver: Driver, farmers: Farmer[]): DriverFarmerMatch[] {
  const matches = farmers.map((farmer) => ({
    farmer,
    match: calculateMatch(farmer, driver),
  }));
  matches.sort((a, b) => b.match.score - a.match.score);
  return matches;
}
