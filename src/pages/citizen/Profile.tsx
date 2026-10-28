import React from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Profile: React.FC = () => {
  const { currentUser, currentRole } = useAuth();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Participant Registry Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official enrollment details and identity verification records for India&apos;s Green Credit Programme
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm p-6 space-y-6">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 overflow-hidden shadow-inner shrink-0">
            <img
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 capitalize">
                {currentRole}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                KYC Level 3 Verified
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 font-mono">
              Registry UID: {currentUser?.id} · MoEFCC Stakeholder ID #8921
            </p>
          </div>
        </div>

        {/* Contact & Organization Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Registered Email</span>
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.email}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Phone / WhatsApp</span>
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.phone || '+91 98234 56712'}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Operating Base / Headquarters</span>
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.location}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Cooperative / Entity Name</span>
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.organization || currentUser?.company || currentUser?.agency || 'Individual Producer'}</span>
            </p>
          </div>
        </div>

        {/* Financial & Settlement Linkage */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Linked Payout & Settlement Account</h3>
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-800">State Bank of India (SBI) · Primary Escrow</p>
              <p className="text-slate-500 font-mono">Account: •••••••• 8912 | IFSC: SBIN0001248 | UPI: aarav@oksbi</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Direct Benefit Transfer Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
