import type { MatchResult } from '@/types';

interface MatchCardProps {
  name: string;
  subtitle: string;
  details: { icon: string; text: string }[];
  match: MatchResult;
  isBest?: boolean;
  actionLabel: string;
  onAction: () => void;
  accentColor?: 'green' | 'blue';
}

export function MatchCard({
  name,
  subtitle,
  details,
  match,
  isBest = false,
  actionLabel,
  onAction,
  accentColor = 'green',
}: MatchCardProps) {
  const accent = accentColor === 'green' ? 'green' : 'blue';
  const scoreColor = match.score >= 85 ? 'text-green-600' : match.score >= 70 ? 'text-blue-600' : 'text-amber-600';
  const scoreBg = match.score >= 85 ? 'bg-green-50' : match.score >= 70 ? 'bg-blue-50' : 'bg-amber-50';

  return (
    <div
      className={`relative rounded-2xl border-2 bg-white transition-all duration-300 hover:shadow-xl ${
        isBest
          ? `border-${accent}-400 shadow-lg shadow-${accent}-100 scale-[1.02]`
          : 'border-gray-200 shadow-sm hover:border-gray-300'
      }`}
    >
      {isBest && (
        <div className={`absolute -top-3 left-6 rounded-full bg-gradient-to-r from-${accent}-500 to-${accent}-600 px-4 py-1 text-xs font-bold text-white shadow-md`}>
          ⭐ BEST MATCH
        </div>
      )}

      <div className="p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          </div>
          <div className={`flex flex-col items-center justify-center rounded-xl ${scoreBg} px-3 py-2 min-w-[70px]`}>
            <span className={`text-2xl font-bold ${scoreColor}`}>{match.score}%</span>
            <span className="text-[10px] text-gray-500 font-medium">MATCH</span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {details.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">{d.icon}</span>
              <span>{d.text}</span>
            </div>
          ))}
        </div>

        {isBest && (
          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">Why this match?</p>
            <div className="space-y-1">
              {match.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={r.positive ? 'text-green-600' : 'text-red-500'}>{r.icon}</span>
                  <span className={r.positive ? 'text-gray-700' : 'text-gray-500'}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onAction}
          className={`mt-4 w-full rounded-xl py-3 text-base font-bold transition-all ${
            isBest
              ? `bg-gradient-to-r from-${accent}-500 to-${accent}-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
