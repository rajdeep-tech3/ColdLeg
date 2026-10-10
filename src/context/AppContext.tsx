import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Farmer, Driver, Language, TransportRequest, ActiveTrip } from '@/types';
import {
  initStorage,
  getFarmers,
  getDrivers,
  authenticateFarmer,
  authenticateDriver,
  setSession,
  getSession,
  clearSession,
  addFarmer,
  addDriver,
  updateDriver,
  updateFarmer,
  getNextFarmerId,
  getNextDriverId,
  getRequests,
  addRequest,
  updateRequest,
  getTripForDriver,
  addTrip,
  updateTrip,
  getRequestsForDriver,
  getRequestsForFarmer,
} from '@/lib/storage';
import type { Language as LangCode } from '@/types';

type Portal = 'farmer' | 'driver' | null;

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  portal: Portal;
  setPortal: (portal: Portal) => void;
  currentFarmer: Farmer | null;
  currentDriver: Driver | null;
  farmers: Farmer[];
  drivers: Driver[];
  requests: TransportRequest[];
  activeTrip: ActiveTrip | null;
  loginFarmer: (id: string, password: string) => boolean;
  loginDriver: (id: string, password: string) => boolean;
  registerFarmer: (farmer: Omit<Farmer, 'id' | 'verified'>) => Farmer;
  registerDriver: (driver: Omit<Driver, 'id' | 'verified' | 'available'>) => Driver;
  logout: () => void;
  updateCurrentFarmer: (farmer: Farmer) => void;
  updateCurrentDriver: (driver: Driver) => void;
  sendTransportRequest: (driver: Driver) => TransportRequest | null;
  acceptRequest: (request: TransportRequest) => void;
  rejectRequest: (request: TransportRequest) => void;
  startTrip: (trip: ActiveTrip) => void;
  refreshRequests: () => void;
  driverRequests: TransportRequest[];
  farmerRequests: TransportRequest[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [portal, setPortalState] = useState<Portal>(null);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [driverRequests, setDriverRequests] = useState<TransportRequest[]>([]);
  const [farmerRequests, setFarmerRequests] = useState<TransportRequest[]>([]);

  useEffect(() => {
    initStorage();
    setFarmers(getFarmers());
    setDrivers(getDrivers());

    const savedLang = localStorage.getItem('kcc_lang') as Language | null;
    if (savedLang) setLanguageState(savedLang);

    const session = getSession();
    if (session) {
      if (session.portal === 'farmer') {
        const farmer = getFarmers().find((f) => f.id === session.userId);
        if (farmer) {
          setCurrentFarmer(farmer);
          setPortalState('farmer');
        }
      } else if (session.portal === 'driver') {
        const driver = getDrivers().find((d) => d.id === session.userId);
        if (driver) {
          setCurrentDriver(driver);
          setPortalState('driver');
          setActiveTrip(getTripForDriver(driver.id));
        }
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kcc_lang', lang);
  }, []);

  const setPortal = useCallback((p: Portal) => {
    setPortalState(p);
  }, []);

  const loginFarmer = useCallback((id: string, password: string): boolean => {
    const farmer = authenticateFarmer(id, password);
    if (farmer) {
      setCurrentFarmer(farmer);
      setPortalState('farmer');
      setSession({ portal: 'farmer', userId: farmer.id });
      setFarmerRequests(getRequestsForFarmer(farmer.id));
      return true;
    }
    return false;
  }, []);

  const loginDriver = useCallback((id: string, password: string): boolean => {
    const driver = authenticateDriver(id, password);
    if (driver) {
      setCurrentDriver(driver);
      setPortalState('driver');
      setSession({ portal: 'driver', userId: driver.id });
      setActiveTrip(getTripForDriver(driver.id));
      setDriverRequests(getRequestsForDriver(driver.id));
      return true;
    }
    return false;
  }, []);

  const registerFarmer = useCallback((data: Omit<Farmer, 'id' | 'verified'>): Farmer => {
    const id = getNextFarmerId();
    const farmer: Farmer = { ...data, id, verified: true };
    addFarmer(farmer);
    setFarmers(getFarmers());
    return farmer;
  }, []);

  const registerDriver = useCallback((data: Omit<Driver, 'id' | 'verified' | 'available'>): Driver => {
    const id = getNextDriverId();
    const driver: Driver = { ...data, id, verified: true, available: true };
    addDriver(driver);
    setDrivers(getDrivers());
    return driver;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentFarmer(null);
    setCurrentDriver(null);
    setPortalState(null);
    setActiveTrip(null);
    setFarmerRequests([]);
    setDriverRequests([]);
  }, []);

  const updateCurrentFarmer = useCallback((farmer: Farmer) => {
    updateFarmer(farmer);
    setCurrentFarmer(farmer);
    setFarmers(getFarmers());
  }, []);

  const updateCurrentDriver = useCallback((driver: Driver) => {
    updateDriver(driver);
    setCurrentDriver(driver);
    setDrivers(getDrivers());
  }, []);

  const refreshRequests = useCallback(() => {
    setRequests(getRequests());
    if (currentDriver) {
      setDriverRequests(getRequestsForDriver(currentDriver.id));
    }
    if (currentFarmer) {
      setFarmerRequests(getRequestsForFarmer(currentFarmer.id));
    }
  }, [currentDriver, currentFarmer]);

  const sendTransportRequest = useCallback((driver: Driver): TransportRequest | null => {
    if (!currentFarmer) return null;
    const request: TransportRequest = {
      id: `REQ-${Date.now()}`,
      farmerId: currentFarmer.id,
      farmerName: currentFarmer.fullName,
      driverId: driver.id,
      driverName: driver.fullName,
      cropType: currentFarmer.cropType,
      cropQuantity: currentFarmer.cropQuantity,
      pickup: currentFarmer.farmLocation,
      destination: currentFarmer.preferredMandi,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      status: 'waiting',
      createdAt: Date.now(),
    };
    addRequest(request);
    setRequests(getRequests());
    setFarmerRequests(getRequestsForFarmer(currentFarmer.id));
    return request;
  }, [currentFarmer]);

  const acceptRequest = useCallback((request: TransportRequest) => {
    if (!currentDriver) return;
    const updated: TransportRequest = { ...request, status: 'accepted' };
    updateRequest(updated);
    setRequests(getRequests());
    setDriverRequests(getRequestsForDriver(currentDriver.id));

    const trip: ActiveTrip = {
      requestId: request.id,
      farmerId: request.farmerId,
      farmerName: request.farmerName,
      driverId: request.driverId,
      driverName: request.driverName,
      pickup: request.pickup,
      destination: request.destination,
      cropType: request.cropType,
      cropQuantity: request.cropQuantity,
      vehicleCapacity: currentDriver.vehicleCapacity,
      vehicleType: request.vehicleType,
      vehicleNumber: request.vehicleNumber,
      status: 'accepted',
      createdAt: Date.now(),
    };
    addTrip(trip);
    setActiveTrip(trip);

    const updatedDriver: Driver = { ...currentDriver, available: false };
    updateCurrentDriver(updatedDriver);

    if (currentFarmer) {
      setFarmerRequests(getRequestsForFarmer(currentFarmer.id));
    }
  }, [currentDriver, currentFarmer, updateCurrentDriver]);

  const rejectRequest = useCallback((request: TransportRequest) => {
    const updated: TransportRequest = { ...request, status: 'rejected' };
    updateRequest(updated);
    setRequests(getRequests());
    if (currentDriver) {
      setDriverRequests(getRequestsForDriver(currentDriver.id));
    }
  }, [currentDriver]);

  const startTrip = useCallback((trip: ActiveTrip) => {
    const updated: ActiveTrip = { ...trip, status: 'trip_started' };
    updateTrip(updated);
    setActiveTrip(updated);

    const req = getRequests().find((r) => r.id === trip.requestId);
    if (req) {
      updateRequest({ ...req, status: 'trip_started' });
      setRequests(getRequests());
    }
  }, []);

  const value: AppContextValue = {
    language,
    setLanguage,
    portal,
    setPortal,
    currentFarmer,
    currentDriver,
    farmers,
    drivers,
    requests,
    activeTrip,
    loginFarmer,
    loginDriver,
    registerFarmer,
    registerDriver,
    logout,
    updateCurrentFarmer,
    updateCurrentDriver,
    sendTransportRequest,
    acceptRequest,
    rejectRequest,
    startTrip,
    refreshRequests,
    driverRequests,
    farmerRequests,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
