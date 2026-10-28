import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

export type StatTint = 'green' | 'blue' | 'purple' | 'teal';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  tint: StatTint;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  tint,
  subtext
}) => {
  const tintStyles: Record<
    StatTint,
    {
      bgIcon: string;
      iconColor: string;
      borderHighlight: string;
      pillBg: string;
    }
  > = {
    green: {
      bgIcon: 'bg-emerald-50 text-emerald-700',
      iconColor: 'text-emerald-700',
      borderHighlight: 'hover:border-emerald-300',
      pillBg: 'text-emerald-700 bg-emerald-50'
    },
    blue: {
      bgIcon: 'bg-sky-50 text-sky-700',
      iconColor: 'text-sky-700',
      borderHighlight: 'hover:border-sky-300',
      pillBg: 'text-sky-700 bg-sky-50'
    },
    purple: {
      bgIcon: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-700',
      borderHighlight: 'hover:border-purple-300',
      pillBg: 'text-purple-700 bg-purple-50'
    },
    teal: {
      bgIcon: 'bg-teal-50 text-teal-700',
      iconColor: 'text-teal-700',
      borderHighlight: 'hover:border-teal-300',
      pillBg: 'text-teal-700 bg-teal-50'
    }
  };

  const style = tintStyles[tint];

  return (
    <div
      className={`bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm transition-all duration-200 ${style.borderHighlight}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.bgIcon}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display tabular-nums">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
        {trend ? (
          <span className={`inline-flex items-center gap-1 font-medium text-[11px] px-1.5 py-0.5 rounded ${style.pillBg}`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        ) : (
          <span />
        )}
        {subtext && <span className="text-[11px] text-slate-400 truncate">{subtext}</span>}
      </div>
    </div>
  );
};
