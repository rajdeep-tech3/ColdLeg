import { useState, useCallback } from 'react';
import { LogOut, Wheat, Truck, Search, Edit3, CheckCircle2, X, MapPin, Clock, ArrowRight, LocateFixed, Navigation, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DemoBadge } from '@/components/DemoBadge';
import { MatchCard } from '@/components/MatchCard';
import { LeafletMap } from '@/components/LeafletMap';
import { TrackingModal } from '@/components/TrackingModal';
import { findBestDriversForFarmer, type FarmerDriverMatch } from '@/lib/matching';
import { getDistanceKm, PUNJAB_CROPS, PUNJAB_MANDIS, PUNJAB_LOCATIONS, getCoordinates } from '@/data/locations';
import { getCurrentPosition } from '@/lib/geo';
import type { Farmer, Driver, TransportRequest, GeoPoint } from '@/types';

type View = 'home' | 'matches' | 'request' | 'sent' | 'myrequest' | 'editcrop';

export function FarmerDashboard() {
  const { language, currentFarmer, logout, updateCurrentFarmer, drivers, sendTransportRequest, farmerRequests } = useApp();
  const [view, setView] = useState<View>('home');
  const [matches, setMatches] = useState<FarmerDriverMatch[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [sentRequest, setSentRequest] = useState<TransportRequest | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [liveCoords, setLiveCoords] = useState<GeoPoint | null>(null);
  const [trackingMode, setTrackingMode] = useState<'vehicle' | 'shipment' | null>(null);
  const [trackedDriver, setTrackedDriver] = useState<Driver | null>(null);
  const [editForm, setEditForm] = useState({
    cropType: currentFarmer?.cropType || 'Tomato',
    cropQuantity: String(currentFarmer?.cropQuantity || ''),
    preferredMandi: currentFarmer?.preferredMandi || 'Khanna Grain Market',
    farmLocation: currentFarmer?.farmLocation || '',
    village: currentFarmer?.village || '',
  });

  if (!currentFarmer) return null;

  const effectiveCoords = liveCoords ?? currentFarmer.coordinates;

  const handleUseMyLocation = async () => {
    setGeoLoading(true);
    setGeoError('');
    try {
      const point = await getCurrentPosition();
      setLiveCoords(point);
    } catch {
      setGeoError(t(language, 'locationDenied'));
    } finally {
      setGeoLoading(false);
    }
  };

  const handleFindTransport = useCallback(() => {
    const farmerForMatch: Farmer = liveCoords
      ? { ...currentFarmer, coordinates: liveCoords }
      : currentFarmer;
    const results = findBestDriversForFarmer(farmerForMatch, drivers);
    setMatches(results);
    setView('matches');
  }, [currentFarmer, drivers, liveCoords]);

  const handleRequestVehicle = (driver: Driver) => {
    setSelectedDriver(driver);
    setView('request');
  };

  const handleConfirmRequest = () => {
    if (!selectedDriver) return;
    const req = sendTransportRequest(selectedDriver);
    if (req) {
      setSentRequest(req);
      setView('sent');
    }
  };

  const handleSaveCrop = () => {
    const updated: Farmer = {
      ...currentFarmer,
      cropType: editForm.cropType,
      cropQuantity: parseInt(editForm.cropQuantity, 10) || 0,
      preferredMandi: editForm.preferredMandi,
      farmLocation: editForm.farmLocation || `${editForm.village} Village`,
      village: editForm.village,
      coordinates: getCoordinates(editForm.village),
    };
    updateCurrentFarmer(updated);
    setView('home');
  };

  const handleLogout = () => {
    logout();
  };

  const bestMatch = matches[0];
  const otherMatches = matches.slice(1);
  const visibleOthers = showAllMatches ? otherMatches : otherMatches.slice(0, 2);
  const activeRequest = farmerRequests[farmerRequests.length - 1];
  const hasActiveTrip = activeRequest && (activeRequest.status === 'accepted' || activeRequest.status === 'trip_started');

  const openTracking = (mode: 'vehicle' | 'shipment', driver: Driver | null) => {
    setTrackedDriver(driver);
    setTrackingMode(mode);
  };
  const closeTracking = () => {
    setTrackingMode(null);
    setTrackedDriver(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <DemoBadge />
            <LanguageSelector compact />
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
              <LogOut size={16} /> {t(language, 'logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            {t(language, 'welcome')}, {currentFarmer.fullName}
          </h1>
          <p className="text-sm text-gray-500">{currentFarmer.id} | {currentFarmer.village}, {currentFarmer.district}</p>
        </div>

        {view === 'home' && (
          <div className="space-y-4">
            {/* Card 1: My Crop */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50">
                    <Wheat size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{t(language, 'myCrop')}</h2>
                    <p className="text-sm text-gray-500">{currentFarmer.cropType} | {currentFarmer.cropQuantity} kg</p>
                  </div>
                </div>
                <button onClick={() => setView('editcrop')} className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700">
                  <Edit3 size={16} /> {t(language, 'editCropDetails')}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{t(language, 'pickup')}: {currentFarmer.farmLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ArrowRight size={16} className="text-gray-400" />
                  <span>{t(language, 'destination')}: {currentFarmer.preferredMandi}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Find Transport (HERO) */}
            <div className="relative rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-xl shadow-green-500/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <Truck size={32} />
                  <h2 className="text-lg font-bold">{t(language, 'findTransport')}</h2>
                </div>
                <p className="text-green-50 text-sm mb-4">Find the best nearby vehicle for your crop.</p>
                <button
                  onClick={handleFindTransport}
                  className="w-full rounded-xl bg-white text-green-700 py-3.5 text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Search size={20} /> {t(language, 'findBestVehicle')}
                </button>
              </div>
            </div>

            {/* Card 3: Active Request */}
            {activeRequest && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-gray-800 mb-3">{t(language, 'myRequest')}</h2>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    activeRequest.status === 'waiting' ? 'bg-amber-50' :
                    activeRequest.status === 'accepted' || activeRequest.status === 'trip_started' ? 'bg-green-50' :
                    'bg-gray-50'
                  }`}>
                    {activeRequest.status === 'waiting' ? <Clock size={20} className="text-amber-500" /> :
                     <CheckCircle2 size={20} className="text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{activeRequest.driverName}</p>
                    <p className="text-xs text-gray-500">{activeRequest.vehicleType}</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    activeRequest.status === 'waiting' ? 'bg-amber-50 text-amber-600' :
                    activeRequest.status === 'accepted' ? 'bg-green-50 text-green-600' :
                    activeRequest.status === 'trip_started' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {activeRequest.status === 'waiting' ? '🟡 ' + t(language, 'waitingForDriver') :
                     activeRequest.status === 'accepted' ? '✓ ' + t(language, 'requestAccepted') :
                     activeRequest.status === 'trip_started' ? '🟢 ' + t(language, 'tripStarted') :
                     activeRequest.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  {activeRequest.pickup} → {activeRequest.destination} | {activeRequest.cropType}, {activeRequest.cropQuantity} kg
                </div>

                {/* Tracking buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      const reqDriver = drivers.find((d) => d.id === activeRequest.driverId) ?? null;
                      openTracking('vehicle', reqDriver);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all"
                  >
                    <Navigation size={16} /> 📍 Track Vehicle
                  </button>
                  <button
                    onClick={() => {
                      const reqDriver = drivers.find((d) => d.id === activeRequest.driverId) ?? null;
                      openTracking('shipment', reqDriver);
                    }}
                    disabled={!hasActiveTrip}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      hasActiveTrip
                        ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Package size={16} /> 🚚 Track Shipment
                  </button>
                </div>
              </div>
            )}

            {/* Map */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-600">{t(language, 'pickup')} & {t(language, 'destination')}</h2>
                <button
                  onClick={handleUseMyLocation}
                  disabled={geoLoading}
                  className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <LocateFixed size={14} /> {geoLoading ? '...' : t(language, 'useMyLocation')}
                </button>
              </div>
              {geoError && (
                <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                  {geoError}
                </div>
              )}
              <LeafletMap
                farmerCoord={effectiveCoords}
                mandiCoord={getCoordinates(currentFarmer.preferredMandi)}
                vehicles={[]}
                height={180}
              />
            </div>
          </div>
        )}

        {view === 'matches' && (
          <div className="space-y-4">
            <button onClick={() => setView('home')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
              <X size={18} /> {t(language, 'back')}
            </button>

            {matches.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-white border border-gray-200">
                <p className="text-gray-500">{t(language, 'noMatchesFound')}</p>
              </div>
            ) : (
              <>
                {/* Interactive Map with Nearby Vehicles */}
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-600">Nearby Refrigerated Vehicles</h2>
                    <button
                      onClick={handleUseMyLocation}
                      disabled={geoLoading}
                      className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <LocateFixed size={14} /> {geoLoading ? '...' : t(language, 'useMyLocation')}
                    </button>
                  </div>
                  {geoError && (
                    <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                      {geoError}
                    </div>
                  )}
                  <LeafletMap
                    farmerCoord={effectiveCoords}
                    mandiCoord={getCoordinates(currentFarmer.preferredMandi)}
                    vehicles={matches.slice(0, 6).map((m) => ({ driver: m.driver, match: m.match }))}
                    height={320}
                  />
                  <p className="mt-2 text-xs text-gray-400 text-center">Tap a 🚚 marker to see vehicle details and match score</p>
                </div>

                {bestMatch && (
                  <>
                    <MatchCard
                      name={bestMatch.driver.fullName}
                      subtitle={bestMatch.driver.vehicleType}
                      details={[
                        { icon: '📍', text: `${getDistanceKm(currentFarmer.coordinates, bestMatch.driver.coordinates)} ${t(language, 'kmAway')}` },
                        { icon: '📦', text: `${bestMatch.driver.vehicleCapacity} ${t(language, 'kgAvailable')}` },
                        { icon: '🌡', text: bestMatch.driver.refrigerationType },
                        { icon: '🛣', text: bestMatch.driver.typicalRoute },
                      ]}
                      match={bestMatch.match}
                      isBest
                      actionLabel={t(language, 'requestVehicle')}
                      onAction={() => handleRequestVehicle(bestMatch.driver)}
                      accentColor="green"
                    />

                    {/* Track selected vehicle button */}
                    <button
                      onClick={() => openTracking('vehicle', bestMatch.driver)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all"
                    >
                      <Navigation size={16} /> 📍 Track Selected Vehicle
                    </button>
                  </>
                )}

                {visibleOthers.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-500 pt-2">{t(language, 'otherMatches')}</p>
                    {visibleOthers.map((m) => (
                      <MatchCard
                        key={m.driver.id}
                        name={m.driver.fullName}
                        subtitle={m.driver.vehicleType}
                        details={[
                          { icon: '📍', text: `${getDistanceKm(currentFarmer.coordinates, m.driver.coordinates)} ${t(language, 'kmAway')}` },
                          { icon: '📦', text: `${m.driver.vehicleCapacity} kg` },
                          { icon: '🌡', text: m.driver.refrigerationType },
                        ]}
                        match={m.match}
                        actionLabel={t(language, 'requestVehicle')}
                        onAction={() => handleRequestVehicle(m.driver)}
                        accentColor="green"
                      />
                    ))}
                    {!showAllMatches && otherMatches.length > 2 && (
                      <button onClick={() => setShowAllMatches(true)} className="w-full text-center text-sm font-medium text-green-600 hover:text-green-700 py-2">
                        {t(language, 'viewAllMatches')} ({otherMatches.length})
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {view === 'request' && selectedDriver && (
          <div className="space-y-4">
            <button onClick={() => setView('matches')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
              <X size={18} /> {t(language, 'back')}
            </button>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{t(language, 'requestConfirmation')}</h2>
              <p className="text-base font-semibold text-green-700 mb-4">{selectedDriver.fullName}?</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t(language, 'trip')}</span>
                  <span className="font-medium text-gray-700">{currentFarmer.farmLocation} → {currentFarmer.preferredMandi}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t(language, 'crop')}</span>
                  <span className="font-medium text-gray-700">{currentFarmer.cropType}, {currentFarmer.cropQuantity} kg</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t(language, 'vehicle')}</span>
                  <span className="font-medium text-gray-700">{selectedDriver.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t(language, 'vehicleNo')}</span>
                  <span className="font-medium text-gray-700">{selectedDriver.vehicleNumber}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setView('matches')} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-all">
                  {t(language, 'cancel')}
                </button>
                <button onClick={handleConfirmRequest} className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
                  {t(language, 'confirmRequest')}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'sent' && sentRequest && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(language, 'requestSent')} ✓</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your transport request has been sent to {sentRequest.driverName}.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 mb-6">
              <Clock size={16} /> 🟡 {t(language, 'waitingForDriver')}
            </div>
            <div>
              <button onClick={() => setView('home')} className="w-full max-w-xs rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-all">
                {t(language, 'home')}
              </button>
            </div>
          </div>
        )}

        {view === 'editcrop' && (
          <div className="space-y-4">
            <button onClick={() => setView('home')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
              <X size={18} /> {t(language, 'back')}
            </button>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-800">{t(language, 'editCropDetails')}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">{t(language, 'village')}</label>
                <select
                  value={editForm.village}
                  onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                >
                  {Object.keys(PUNJAB_LOCATIONS).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">{t(language, 'farmLocation')}</label>
                <input type="text" value={editForm.farmLocation} onChange={(e) => setEditForm({ ...editForm, farmLocation: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{t(language, 'cropType')}</label>
                  <select value={editForm.cropType} onChange={(e) => setEditForm({ ...editForm, cropType: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none">
                    {PUNJAB_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{t(language, 'cropQuantity')}</label>
                  <input type="number" value={editForm.cropQuantity} onChange={(e) => setEditForm({ ...editForm, cropQuantity: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">{t(language, 'preferredMandi')}</label>
                <select value={editForm.preferredMandi} onChange={(e) => setEditForm({ ...editForm, preferredMandi: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none">
                  {PUNJAB_MANDIS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <button onClick={handleSaveCrop} className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
                {t(language, 'editCropDetails')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {trackingMode && (
        <TrackingModal
          open={!!trackingMode}
          onClose={closeTracking}
          farmerCoord={effectiveCoords}
          mandiCoord={getCoordinates(currentFarmer.preferredMandi)}
          driver={trackedDriver}
          request={activeRequest}
          mode={trackingMode}
        />
      )}
    </div>
  );
}
