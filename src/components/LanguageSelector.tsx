import { Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LANGUAGES } from '@/lib/i18n';
import type { Language } from '@/types';

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useApp();

  return (
    <div className={`flex items-center gap-1.5 ${compact ? '' : 'rounded-lg bg-white border border-gray-200 px-2 py-1 shadow-sm'}`}>
      <Globe size={16} className="text-gray-400" />
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as Language)}
          className={`px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
            language === lang.code
              ? 'bg-green-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
}
