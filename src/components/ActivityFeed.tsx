import React from 'react';
import { ActivityItem } from '../types';
import { ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, limit = 5 }) => {
  const displayItems = activities.slice(0, limit);

  const getBadgeStyle = (item: ActivityItem) => {
    if (item.amount.startsWith('+')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: ArrowUpRight
      };
    }
    if (item.amount.startsWith('-')) {
      if (item.type === 'credit_compliance') {
        return {
          bg: 'bg-purple-50 text-purple-700 border border-purple-200',
          icon: ShieldCheck
        };
      }
      return {
        bg: 'bg-sky-50 text-sky-700 border border-sky-200',
        icon: ArrowDownLeft
      };
    }
    if (item.status === 'Pending') {
      return {
        bg: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: Clock
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-700 border border-rose-200',
      icon: AlertCircle
    };
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity</h3>
        <span className="text-xs text-slate-400 font-medium">Live Ledger</span>
      </div>

      <div className="divide-y divide-slate-100">
        {displayItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        ) : (
          displayItems.map((item) => {
            const badge = getBadgeStyle(item);
            const Icon = badge.icon;

            return (
              <div key={item.id} className="py-3 flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${badge.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{formatTimestamp(item.timestamp)}</span>
                      <span>·</span>
                      <span className="truncate">{item.entity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded tabular-nums ${badge.bg}`}
                  >
                    {item.amount}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
