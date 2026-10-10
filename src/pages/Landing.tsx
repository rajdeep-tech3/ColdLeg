import { Tractor, Truck, Package, Snowflake, Coins, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DemoBadge } from '@/components/DemoBadge';

export function Landing() {
  const { language, setPortal } = useApp();

  const benefits = [
    { icon: Package, title: t(language, 'reducePostHarvestLoss'), color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Truck, title: t(language, 'useEmptyCapacity'), color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Coins, title: t(language, 'affordableTransport'), color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const flow = [
    { emoji: '🌾', label: t(language, 'farmerFlow') },
    { emoji: '🤖', label: t(language, 'smartMatching') },
    { emoji: '🚚', label: t(language, 'emptyVehicle') },
    { emoji: '🏪', label: t(language, 'localMandi') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <DemoBadge />
          <LanguageSelector compact />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 leading-tight">
            {t(language, 'stopEmptyTrips')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t(language, 'landingHeroSubtitle')}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
          {flow.map((step, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-200 shadow-sm text-2xl sm:text-3xl">
                  {step.emoji}
                </div>
                <span className="text-xs font-medium text-gray-500">{step.label}</span>
              </div>
              {i < flow.length - 1 && (
                <ArrowRight className="text-gray-300 hidden sm:block" size={20} />
              )}
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
          <button
            onClick={() => setPortal('farmer')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 sm:p-8 text-left text-white shadow-xl shadow-green-500/20 transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <Tractor size={40} className="mb-4 relative" />
            <h2 className="text-2xl font-bold relative">{t(language, 'imFarmer')}</h2>
            <p className="mt-2 text-green-50 text-sm relative">{t(language, 'farmerSubtitle')}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold relative">
              {t(language, 'signIn')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => setPortal('driver')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 text-left text-white shadow-xl shadow-blue-500/20 transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <Truck size={40} className="mb-4 relative" />
            <h2 className="text-2xl font-bold relative">{t(language, 'imDriver')}</h2>
            <p className="mt-2 text-blue-50 text-sm relative">{t(language, 'driverSubtitle')}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold relative">
              {t(language, 'signIn')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${b.bg} flex-shrink-0`}>
                <b.icon size={20} className={b.color} />
              </div>
              <p className="text-sm font-medium text-gray-700 pt-1.5">{b.title}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        <p>{t(language, 'tagline')}</p>
      </footer>
    </div>
  );
}
