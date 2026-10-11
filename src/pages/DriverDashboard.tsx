import { useState, useCallback, useEffect } from 'react';
import { LogOut, Truck, User, CheckCircle2, X, MapPin, Navigation, Clock, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DemoBadge } from '@/components/DemoBadge';
import { MatchCard } from '@/components/MatchCard';
import { DriverLiveMap } from '@/components/DriverLiveMap';
import { findBestFarmersForDriver, type DriverFarmerMatch } from '@/lib/matching';
import { getDistanceKm } from '@/data/locations';
import type { TransportRequest } from '@/types';

type View = 'home' | 'matches' | 'requests' | 'trip';

export function DriverDashboard() {
  const { language, currentDriver, logout, updateCurrentDriver, farmers, activeTrip, driverRequests, acceptRequest, rejectRequest, startTrip, refreshRequests } = useApp();
  const [view, setView] = useState<View>('home');
  const [matches, setMatches] = useState<DriverFarmerMatch[]>([]);
  const [showAllMatches, setShowAllMatches] = useState(false);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  const handleFindMatches = useCallback(() => {
    if (!currentDriver) return;
    const results = findBestFarmersForDriver(currentDriver, farmers);
    setMatches(results);
    setView('matches');
  }, [currentDriver, farmers]);

  // All hooks are above this line, so this early return is safe
  if (!currentDriver) return null;

  const toggleAvailability = () => {
    updateCurrentDriver({ ...currentDriver, available: !currentDriver.available });
  };

  const handleAcceptRequest = (req: TransportRequest) => {
    acceptRequest(req);
    setView('home');
  };

  const handleStartTrip = () => {
    if (activeTrip) {
      startTrip(activeTrip);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const bestMatch = matches[0];
  const otherMatches = matches.slice(1);
  const visibleOthers = showAllMatches ? otherMatches : otherMatches.slice(0, 3);
  const pendingRequests = driverRequests.filter((r) => r.status === 'waiting');
  const remainingCapacity = activeTrip ? activeTrip.vehicleCapacity - activeTrip.cropQuantity : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
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
            {t(language, 'welcome')}, {currentDriver.fullName}
          </h1>
          <p className="text-sm text-gray-500">{currentDriver.id} | {currentDriver.vehicleType}</p>
        </div>

        {view === 'home' && (
          <div className="space-y-4">
            {/* 1. Driver Status */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50">
                    <Truck size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{currentDriver.fullName}</h2>
                    <p className="text-sm text-gray-500">{currentDriver.vehicleType} | {currentDriver.vehicleNumber}</p>
                  </div>
                </div>
                <button
                  onClick={toggleAvailability}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    currentDriver.available
                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentDriver.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {currentDriver.available ? t(language, 'available') : t(language, 'unavailable')}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Navigation size={16} className="text-gray-400" />
                  <span>{t(language, 'route')}: {currentDriver.typicalRoute}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{currentDriver.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">📦</span>
                  <span>{t(language, 'emptyCapacity')}: {currentDriver.vehicleCapacity} kg</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">🌡</span>
                  <span>{currentDriver.refrigerationType}</span>
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                <h2 className="text-base font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Clock size={20} /> {pendingRequests.length} Transport {pendingRequests.length > 1 ? 'Requests' : 'Request'} Waiting
                </h2>
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="rounded-xl bg-white border border-amber-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{req.farmerName}</p>
                          <p className="text-sm text-gray-500">{req.cropType}, {req.cropQuantity} kg | {req.pickup} → {req.destination}</p>
                        </div>
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition-all"
                        >
                          {t(language, 'acceptLoad')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Best Farmer Match (HERO) */}
            {currentDriver.available && !activeTrip && (
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl shadow-blue-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={28} />
                    <h2 className="text-lg font-bold">{t(language, 'bestFarmerMatch')}</h2>
                  </div>
                  <p className="text-blue-50 text-sm mb-4">Find farmers needing transport on your route.</p>
                  <button
                    onClick={handleFindMatches}
                    className="w-full rounded-xl bg-white text-blue-700 py-3.5 text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    {t(language, 'bestMatches')}
                  </button>
                </div>
              </div>
            )}

            {/* 4. Active Trip */}
            {activeTrip && (
              <div className="rounded-2xl bg-white border-2 border-blue-200 shadow-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50">
                    <Truck size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{t(language, 'activeTrip')}</h2>
                    <p className="text-sm text-gray-500">{t(language, 'farmer')}: {activeTrip.farmerName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{t(language, 'pickup')}</span>
                    <span className="font-medium text-gray-700">{activeTrip.pickup}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{t(language, 'destination')}</span>
                    <span className="font-medium text-gray-700">{activeTrip.destination}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{t(language, 'load')}</span>
                    <span className="font-medium text-gray-700">{activeTrip.cropType}, {activeTrip.cropQuantity} kg</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{t(language, 'capacity')}</span>
                    <span className="font-medium text-gray-700">{activeTrip.vehicleCapacity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t(language, 'remainingCapacity')}</span>
                    <span className="font-medium text-green-600">{remainingCapacity} kg</span>
                  </div>
                </div>

                <div className="mt-4">
                  {activeTrip.status === 'accepted' ? (
                    <button
                      onClick={handleStartTrip}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Play size={20} /> {t(language, 'startTrip')}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3.5 text-base font-bold text-green-700">
                      <CheckCircle2 size={20} /> 🟢 {t(language, 'tripStarted')} (Pickup → Mandi)
                    </div>
                  )}
                </div>

                {/* Live GPS map (replaces the old MapView) */}
                <div className="mt-4">
                  <DriverLiveMap trip={activeTrip} />
                </div>
              </div>
            )}

            {/* No Active Trip */}
            {!activeTrip && pendingRequests.length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 text-center">
                <p className="text-sm text-gray-500">{t(language, 'noActiveTrip')}</p>
              </div>
            )}
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
                {bestMatch && (
                  <MatchCard
                    name={bestMatch.farmer.fullName}
                    subtitle={`${bestMatch.farmer.village}, ${bestMatch.farmer.district}`}
                    details={[
                      { icon: '🌾', text: `${bestMatch.farmer.cropType}, ${bestMatch.farmer.cropQuantity} kg` },
                      { icon: '📍', text: `${getDistanceKm(currentDriver.coordinates, bestMatch.farmer.coordinates)} ${t(language, 'kmAway')}` },
                      { icon: '🛣', text: `→ ${bestMatch.farmer.preferredMandi}` },
                    ]}
                    match={bestMatch.match}
                    isBest
                    actionLabel={t(language, 'acceptLoad')}
                    onAction={() => {
                      const req: TransportRequest = {
                        id: `REQ-${Date.now()}`,
                        farmerId: bestMatch.farmer.id,
                        farmerName: bestMatch.farmer.fullName,
                        driverId: currentDriver.id,
                        driverName: currentDriver.fullName,
                        cropType: bestMatch.farmer.cropType,
                        cropQuantity: bestMatch.farmer.cropQuantity,
                        pickup: bestMatch.farmer.farmLocation,
                        destination: bestMatch.farmer.preferredMandi,
                        vehicleType: currentDriver.vehicleType,
                        vehicleNumber: currentDriver.vehicleNumber,
                        status: 'waiting',
                        createdAt: Date.now(),
                      };
                      handleAcceptRequest(req);
                    }}
                    accentColor="blue"
                  />
                )}

                {visibleOthers.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-500 pt-2">{t(language, 'otherMatches')}</p>
                    {visibleOthers.map((m) => (
                      <MatchCard
                        key={m.farmer.id}
                        name={m.farmer.fullName}
                        subtitle={`${m.farmer.village}, ${m.farmer.district}`}
                        details={[
                          { icon: '🌾', text: `${m.farmer.cropType}, ${m.farmer.cropQuantity} kg` },
                          { icon: '📍', text: `${getDistanceKm(currentDriver.coordinates, m.farmer.coordinates)} ${t(language, 'kmAway')}` },
                          { icon: '🛣', text: `→ ${m.farmer.preferredMandi}` },
                        ]}
                        match={m.match}
                        actionLabel={t(language, 'acceptLoad')}
                        onAction={() => {
                          const req: TransportRequest = {
                            id: `REQ-${Date.now()}`,
                            farmerId: m.farmer.id,
                            farmerName: m.farmer.fullName,
                            driverId: currentDriver.id,
                            driverName: currentDriver.fullName,
                            cropType: m.farmer.cropType,
                            cropQuantity: m.farmer.cropQuantity,
                            pickup: m.farmer.farmLocation,
                            destination: m.farmer.preferredMandi,
                            vehicleType: currentDriver.vehicleType,
                            vehicleNumber: currentDriver.vehicleNumber,
                            status: 'waiting',
                            createdAt: Date.now(),
                          };
                          handleAcceptRequest(req);
                        }}
                        accentColor="blue"
                      />
                    ))}
                    {!showAllMatches && otherMatches.length > 3 && (
                      <button onClick={() => setShowAllMatches(true)} className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
                        {t(language, 'viewMore')} ({otherMatches.length})
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}