import { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DemoBadge } from '@/components/DemoBadge';
import { PUNJAB_LOCATIONS, VEHICLE_TYPES, REFRIGERATION_TYPES, PUNJAB_MANDIS, getCoordinates } from '@/data/locations';
import { getCurrentPosition, findNearestLocation } from '@/lib/geo';
import type { GeoPoint } from '@/types';

type Mode = 'signin' | 'signup' | 'verify' | 'success';

export function DriverAuth() {
  const { language, loginDriver, registerDriver, setPortal } = useApp();

  const [mode, setMode] = useState<Mode>('signin');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newDriverId, setNewDriverId] = useState('');
  const [newDriverName, setNewDriverName] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const [signInForm, setSignInForm] = useState({ driverId: '', password: '' });

  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    mobile: '',
    vehicleNumber: '',
    vehicleType: VEHICLE_TYPES[0],
    vehicleCapacity: '',
    refrigerationType: 'Refrigerated',
    currentDistrict: '',
    currentLocation: '',
    typicalRoute: 'Ludhiana → Khanna Grain Mandi',
    routeDestination: 'Khanna Grain Market',
    password: '',
    confirmPassword: '',
  });

  const [coordinates, setCoordinates] = useState<GeoPoint | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signInForm.driverId || !signInForm.password) {
      setError('Please enter your Driver ID and password.');
      return;
    }
    const success = loginDriver(signInForm.driverId.toUpperCase(), signInForm.password);
    if (!success) {
      setError('Invalid Driver ID or password. Try KCC-D-001 / driver123');
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signUpForm.fullName || !signUpForm.mobile || !signUpForm.vehicleNumber || !signUpForm.vehicleCapacity) {
      setError('Please fill all required fields.');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(code);
    setMode('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredCode !== verificationCode) {
      setError('Incorrect verification code. Please try again.');
      return;
    }

    const coords = coordinates ?? getCoordinates(signUpForm.currentLocation || 'Ludhiana');
    const driver = registerDriver({
      fullName: signUpForm.fullName,
      mobile: signUpForm.mobile,
      vehicleNumber: signUpForm.vehicleNumber,
      vehicleType: signUpForm.vehicleType,
      vehicleCapacity: parseInt(signUpForm.vehicleCapacity, 10) || 0,
      refrigerationType: signUpForm.refrigerationType,
      currentDistrict: signUpForm.currentDistrict || PUNJAB_LOCATIONS[signUpForm.currentLocation]?.district || 'Ludhiana',
      currentLocation: signUpForm.currentLocation || 'Ludhiana',
      coordinates: coords,
      typicalRoute: signUpForm.typicalRoute,
      routeDestination: signUpForm.routeDestination,
      password: signUpForm.password,
    });

    setNewDriverId(driver.id);
    setNewDriverName(driver.fullName);
    setMode('success');
  };

  const handleUseLocation = async () => {
    setGeoLoading(true);
    setGeoError('');
    try {
      const point = await getCurrentPosition();
      setCoordinates(point);
      const nearest = findNearestLocation(point);
      setSignUpForm((prev) => ({
        ...prev,
        currentLocation: nearest,
        currentDistrict: PUNJAB_LOCATIONS[nearest]?.district || prev.currentDistrict,
      }));
    } catch {
      setGeoError(t(language, 'locationDenied'));
    } finally {
      setGeoLoading(false);
    }
  };

  const routeOptions = [
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

  const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all';
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1.5';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        <button onClick={() => setPortal(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium">
          <ArrowLeft size={18} /> {t(language, 'back')}
        </button>
        <div className="flex items-center gap-3">
          <DemoBadge />
          <LanguageSelector compact />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-16">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl shadow-lg shadow-blue-500/20 mb-3">
            🚚
          </div>
          <h1 className="text-xl font-bold text-gray-800">{t(language, 'driverPortal')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t(language, 'driverSubtitle')}</p>
        </div>

        {mode !== 'success' && mode !== 'verify' && (
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t(language, 'signIn')}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t(language, 'signUp')}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {geoError && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            {geoError}
          </div>
        )}

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className={labelClass}>{t(language, 'driverId')}</label>
              <input
                type="text"
                value={signInForm.driverId}
                onChange={(e) => setSignInForm({ ...signInForm, driverId: e.target.value })}
                placeholder="KCC-D-001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t(language, 'password')}</label>
              <input
                type="password"
                value={signInForm.password}
                onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                placeholder="driver123"
                className={inputClass}
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all">
              {t(language, 'signIn')}
            </button>
            <p className="text-center text-sm text-gray-400">
              {t(language, 'forgotPassword')} Demo: KCC-D-001 / driver123
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className={labelClass}>{t(language, 'fullName')} *</label>
              <input type="text" value={signUpForm.fullName} onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })} className={inputClass} placeholder="Jarnail Singh" />
            </div>
            <div>
              <label className={labelClass}>{t(language, 'mobileNumber')} *</label>
              <input type="tel" value={signUpForm.mobile} onChange={(e) => setSignUpForm({ ...signUpForm, mobile: e.target.value })} className={inputClass} placeholder="99XXXXXXXX" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t(language, 'vehicleNo')} *</label>
                <input type="text" value={signUpForm.vehicleNumber} onChange={(e) => setSignUpForm({ ...signUpForm, vehicleNumber: e.target.value })} className={inputClass} placeholder="PB-10-XX-1000" />
              </div>
              <div>
                <label className={labelClass}>{t(language, 'vehicleCapacity')} *</label>
                <input type="number" value={signUpForm.vehicleCapacity} onChange={(e) => setSignUpForm({ ...signUpForm, vehicleCapacity: e.target.value })} className={inputClass} placeholder="1250" />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'vehicleType')}</label>
              <select value={signUpForm.vehicleType} onChange={(e) => setSignUpForm({ ...signUpForm, vehicleType: e.target.value })} className={inputClass}>
                {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'refrigerationType')}</label>
              <select value={signUpForm.refrigerationType} onChange={(e) => setSignUpForm({ ...signUpForm, refrigerationType: e.target.value })} className={inputClass}>
                {REFRIGERATION_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button type="button" onClick={handleUseLocation} disabled={geoLoading}
              className="w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
              <MapPin size={16} /> {geoLoading ? '...' : t(language, 'useMyLocation')}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t(language, 'currentLocation')}</label>
                <select value={signUpForm.currentLocation} onChange={(e) => setSignUpForm({ ...signUpForm, currentLocation: e.target.value, currentDistrict: PUNJAB_LOCATIONS[e.target.value]?.district || '' })} className={inputClass}>
                  <option value="">Select</option>
                  {Object.keys(PUNJAB_LOCATIONS).map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t(language, 'currentDistrict')}</label>
                <input type="text" value={signUpForm.currentDistrict} onChange={(e) => setSignUpForm({ ...signUpForm, currentDistrict: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'typicalRoute')}</label>
              <select
                value={signUpForm.typicalRoute}
                onChange={(e) => {
                  const route = routeOptions.find((r) => r.route === e.target.value);
                  setSignUpForm({ ...signUpForm, typicalRoute: e.target.value, routeDestination: route?.dest || '' });
                }}
                className={inputClass}
              >
                {routeOptions.map((r) => <option key={r.route} value={r.route}>{r.route}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t(language, 'password')} *</label>
                <input type="password" value={signUpForm.password} onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t(language, 'confirmPassword')} *</label>
                <input type="password" value={signUpForm.confirmPassword} onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })} className={inputClass} />
              </div>
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all">
              {t(language, 'sendVerificationCode')}
            </button>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-center">
              <p className="text-sm text-blue-700">
                {t(language, 'demoVerificationCode')}: <span className="text-xl font-bold tracking-widest">{verificationCode}</span>
              </p>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'enterCode')}</label>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                maxLength={6}
                placeholder="000000"
                className={`${inputClass} text-center text-2xl tracking-widest`}
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all">
              {t(language, 'verifyAndCreate')}
            </button>
            <button type="button" onClick={() => setMode('signup')} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
              {t(language, 'back')}
            </button>
          </form>
        )}

        {mode === 'success' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <CheckCircle2 size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(language, 'accountCreated')}</h2>
            <p className="text-sm text-gray-500 mb-4">{t(language, 'welcome')}, {newDriverName}!</p>
            <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-6 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t(language, 'driverId')}</p>
              <p className="text-3xl font-bold text-blue-700 tracking-wider">{newDriverId}</p>
              <p className="text-xs text-gray-400 mt-2">{t(language, 'saveId')}</p>
            </div>
            <button
              onClick={() => loginDriver(newDriverId, signUpForm.password)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all"
            >
              {t(language, 'signIn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
