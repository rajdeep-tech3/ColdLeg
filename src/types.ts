export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Farmer {
  id: string;
  fullName: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  farmLocation: string;
  coordinates: GeoPoint;
  cropType: string;
  cropQuantity: number;
  preferredMandi: string;
  password: string;
  verified: boolean;
}

export interface Driver {
  id: string;
  fullName: string;
  mobile: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleCapacity: number;
  refrigerationType: string;
  currentDistrict: string;
  currentLocation: string;
  coordinates: GeoPoint;
  typicalRoute: string;
  routeDestination: string;
  password: string;
  verified: boolean;
  available: boolean;
}

export interface MatchReason {
  icon: string;
  text: string;
  positive: boolean;
}

export interface MatchResult {
  score: number;
  reasons: MatchReason[];
  breakdown: {
    route: number;
    distance: number;
    capacity: number;
    refrigeration: number;
    crop: number;
  };
}

export interface TransportRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  driverId: string;
  driverName: string;
  cropType: string;
  cropQuantity: number;
  pickup: string;
  destination: string;
  vehicleType: string;
  vehicleNumber: string;
  status: 'waiting' | 'accepted' | 'rejected' | 'trip_started' | 'completed';
  createdAt: number;
}

export interface ActiveTrip {
  requestId: string;
  farmerId: string;
  farmerName: string;
  driverId: string;
  driverName: string;
  pickup: string;
  destination: string;
  cropType: string;
  cropQuantity: number;
  vehicleCapacity: number;
  vehicleType: string;
  vehicleNumber: string;
  status: 'accepted' | 'trip_started';
  createdAt: number;
}

export type Language = 'en' | 'pa' | 'hi';

export type Portal = 'farmer' | 'driver' | null;
