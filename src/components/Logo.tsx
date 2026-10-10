import { Snowflake } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { icon: 20, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 28, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 40, text: 'text-3xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-lg shadow-green-500/20"
        style={{ width: s.icon + 12, height: s.icon + 12 }}>
        <Snowflake size={s.icon} />
      </div>
      <div className="leading-tight">
        <div className={`font-bold text-gray-800 ${s.text}`}>ColdLeg</div>
        <div className={`text-gray-500 font-medium ${s.sub}`}>Post-Harvest Loss Prevention</div>
      </div>
    </div>
  );
}
