import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { ProjectStatus } from '../types';

interface StatusTrackerProps {
  status: ProjectStatus;
  rejectionReason?: string;
  submittedDate?: string;
  verifiedDate?: string | null;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  status,
  rejectionReason,
  submittedDate,
  verifiedDate
}) => {
  const isRejected = status === 'Rejected';

  const steps = [
    { key: 'Submitted', label: '1. Submitted', desc: submittedDate || 'Registered' },
    { key: 'Under Review', label: '2. Under Review', desc: 'MoEFCC Field Audit' },
    { key: 'Approved', label: '3. Approved', desc: verifiedDate ? `Minted ${verifiedDate}` : 'Credits Minted' }
  ];

  const getStepState = (stepKey: string) => {
    if (isRejected) {
      if (stepKey === 'Submitted') return 'completed';
      if (stepKey === 'Under Review') return 'completed';
      return 'rejected';
    }

    if (status === 'Submitted') {
      if (stepKey === 'Submitted') return 'active';
      return 'upcoming';
    }

    if (status === 'Under Review') {
      if (stepKey === 'Submitted') return 'completed';
      if (stepKey === 'Under Review') return 'active';
      return 'upcoming';
    }

    if (status === 'Active' || status === 'Approved') {
      return 'completed';
    }

    return 'upcoming';
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verification Pipeline
        </span>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            status === 'Active'
              ? 'bg-emerald-100 text-emerald-800'
              : status === 'Under Review'
              ? 'bg-orange-100 text-orange-800'
              : status === 'Submitted'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 relative">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          return (
            <div
              key={step.key}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                state === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : state === 'active'
                  ? 'bg-white border-amber-300 shadow-sm text-amber-900 ring-2 ring-amber-100'
                  : state === 'rejected'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-white/60 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {state === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {state === 'active' && <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />}
                {state === 'rejected' && <ShieldAlert className="w-4 h-4 text-rose-600" />}
                {state === 'upcoming' && <span className="w-2 h-2 rounded-full bg-slate-300" />}
                <span className="text-xs font-bold leading-tight">{step.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {isRejected && rejectionReason && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <p className="font-bold flex items-center gap-1.5 text-rose-800">
            <ShieldAlert className="w-4 h-4" /> Rejection Notice
          </p>
          <p className="mt-1 text-[11px] text-rose-700 leading-relaxed">{rejectionReason}</p>
        </div>
      )}
    </div>
  );
};
