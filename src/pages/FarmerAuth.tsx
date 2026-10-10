import { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DemoBadge } from '@/components/DemoBadge';
import { PUNJAB_LOCATIONS, PUNJAB_MANDIS, PUNJAB_CROPS, getCoordinates } from '@/data/locations';
import { getCurrentPosition, findNearestLocation } from '@/lib/geo';
import type { GeoPoint } from '@/types';

type Mode = 'signin' | 'signup' | 'verify' | 'success';

export function FarmerAuth() {
  const { language, loginFarmer, registerFarmer, setPortal } = useApp();

  const [mode, setMode] = useState<Mode>('signin');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newFarmerId, setNewFarmerId] = useState('');
  const [newFarmerName, setNewFarmerName] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const [signInForm, setSignInForm] = useState({ farmerId: '', password: '' });

  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    mobile: '',
    village: '',
    district: '',
    state: 'Punjab',
    farmLocation: '',
    cropType: 'Tomato',
    cropQuantity: '',
    preferredMandi: 'Khanna Grain Market',
    password: '',
    confirmPassword: '',
  });

  const [coordinates, setCoordinates] = useState<GeoPoint | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signInForm.farmerId || !signInForm.password) {
      setError('Please enter your Farmer ID and password.');
      return;
    }
    const success = loginFarmer(signInForm.farmerId.toUpperCase(), signInForm.password);
    if (!success) {
      setError('Invalid Farmer ID or password. Try KCC-F-001 / farmer123');
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signUpForm.fullName || !signUpForm.mobile || !signUpForm.village || !signUpForm.cropQuantity) {
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

    const coords = coordinates ?? getCoordinates(signUpForm.village);
    const farmer = registerFarmer({
      fullName: signUpForm.fullName,
      mobile: signUpForm.mobile,
      village: signUpForm.village,
      district: signUpForm.district || PUNJAB_LOCATIONS[signUpForm.village]?.district || 'Ludhiana',
      state: signUpForm.state,
      farmLocation: signUpForm.farmLocation || `${signUpForm.village} Village, ${signUpForm.district || 'Ludhiana'}`,
      coordinates: coords,
      cropType: signUpForm.cropType,
      cropQuantity: parseInt(signUpForm.cropQuantity, 10) || 0,
      preferredMandi: signUpForm.preferredMandi,
      password: signUpForm.password,
    });

    setNewFarmerId(farmer.id);
    setNewFarmerName(farmer.fullName);
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
        village: nearest,
        district: PUNJAB_LOCATIONS[nearest]?.district || prev.district,
        farmLocation: `${nearest} Village, ${PUNJAB_LOCATIONS[nearest]?.district || ''}`,
      }));
    } catch {
      setGeoError(t(language, 'locationDenied'));
    } finally {
      setGeoLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all';
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1.5';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white text-3xl shadow-lg shadow-green-500/20 mb-3">
            🌾
          </div>
          <h1 className="text-xl font-bold text-gray-800">{t(language, 'farmerPortal')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t(language, 'farmerSubtitle')}</p>
        </div>

        {mode !== 'success' && mode !== 'verify' && (
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t(language, 'signIn')}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
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
              <label className={labelClass}>{t(language, 'farmerId')}</label>
              <input
                type="text"
                value={signInForm.farmerId}
                onChange={(e) => setSignInForm({ ...signInForm, farmerId: e.target.value })}
                placeholder="KCC-F-001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t(language, 'password')}</label>
              <input
                type="password"
                value={signInForm.password}
                onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                placeholder="farmer123"
                className={inputClass}
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
              {t(language, 'signIn')}
            </button>
            <p className="text-center text-sm text-gray-400">
              {t(language, 'forgotPassword')} Demo: KCC-F-001 / farmer123
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className={labelClass}>{t(language, 'fullName')} *</label>
              <input type="text" value={signUpForm.fullName} onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })} className={inputClass} placeholder="Gurpreet Singh" />
            </div>
            <div>
              <label className={labelClass}>{t(language, 'mobileNumber')} *</label>
              <input type="tel" value={signUpForm.mobile} onChange={(e) => setSignUpForm({ ...signUpForm, mobile: e.target.value })} className={inputClass} placeholder="98XXXXXXXX" />
            </div>
            <button type="button" onClick={handleUseLocation} disabled={geoLoading}
              className="w-full rounded-xl border-2 border-dashed border-green-300 bg-green-50 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-all flex items-center justify-center gap-2">
              <MapPin size={16} /> {geoLoading ? '...' : t(language, 'useMyLocation')}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t(language, 'village')} *</label>
                <select value={signUpForm.village} onChange={(e) => setSignUpForm({ ...signUpForm, village: e.target.value, district: PUNJAB_LOCATIONS[e.target.value]?.district || '' })} className={inputClass}>
                  <option value="">Select</option>
                  {Object.keys(PUNJAB_LOCATIONS).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t(language, 'district')}</label>
                <input type="text" value={signUpForm.district} onChange={(e) => setSignUpForm({ ...signUpForm, district: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'farmLocation')}</label>
              <input type="text" value={signUpForm.farmLocation} onChange={(e) => setSignUpForm({ ...signUpForm, farmLocation: e.target.value })} className={inputClass} placeholder="Doraha Village, Ludhiana" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t(language, 'cropType')} *</label>
                <select value={signUpForm.cropType} onChange={(e) => setSignUpForm({ ...signUpForm, cropType: e.target.value })} className={inputClass}>
                  {PUNJAB_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t(language, 'cropQuantity')} *</label>
                <input type="number" value={signUpForm.cropQuantity} onChange={(e) => setSignUpForm({ ...signUpForm, cropQuantity: e.target.value })} className={inputClass} placeholder="800" />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t(language, 'preferredMandi')}</label>
              <select value={signUpForm.preferredMandi} onChange={(e) => setSignUpForm({ ...signUpForm, preferredMandi: e.target.value })} className={inputClass}>
                {PUNJAB_MANDIS.map((m) => <option key={m} value={m}>{m}</option>)}
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
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
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
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
              {t(language, 'verifyAndCreate')}
            </button>
            <button type="button" onClick={() => setMode('signup')} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
              {t(language, 'back')}
            </button>
          </form>
        )}

        {mode === 'success' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(language, 'accountCreated')}</h2>
            <p className="text-sm text-gray-500 mb-4">{t(language, 'welcome')}, {newFarmerName}!</p>
            <div className="rounded-2xl bg-green-50 border-2 border-green-200 p-6 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t(language, 'farmerId')}</p>
              <p className="text-3xl font-bold text-green-700 tracking-wider">{newFarmerId}</p>
              <p className="text-xs text-gray-400 mt-2">{t(language, 'saveId')}</p>
            </div>
            <button
              onClick={() => loginFarmer(newFarmerId, signUpForm.password)}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl transition-all"
            >
              {t(language, 'signIn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
