import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Globe, Shield, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Settings: React.FC = () => {
  const { showToast } = useData();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [satellitePassAlerts, setSatellitePassAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Registry preferences and security settings saved!', 'success');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System & Registry Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure notification alerts, two-factor authentication, and GCP node preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Audit & Verification Notifications</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">Email Audit Updates</p>
                <p className="text-slate-500 text-[11px]">Receive updates when verifiers approve or request field photos</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">SMS / WhatsApp Payout Notifications</p>
                <p className="text-slate-500 text-[11px]">Instant SMS when credits are traded or funds settled in your bank</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800">ISRO / Sentinel Satellite Pass Alerts</p>
                <p className="text-slate-500 text-[11px]">Notification prior to scheduled orbital NDVI passes over your plot</p>
              </div>
              <input
                type="checkbox"
                checked={satellitePassAlerts}
                onChange={(e) => setSatellitePassAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Cryptographic Security & Aadhaar e-Sign</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Aadhaar OTP-based Contract Signing</p>
              <p className="text-slate-500 text-[11px]">Required for credit transfer execution above 1,000 GCP</p>
            </div>
            <span className="font-bold text-emerald-700 text-xs">Enabled</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow-sm transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
