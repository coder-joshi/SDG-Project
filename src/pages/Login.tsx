import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Shield, Building2, UserCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);

    if (selectedRole === 'citizen') {
      navigate('/dashboard');
    } else if (selectedRole === 'verifier') {
      navigate('/verifier/queue');
    } else if (selectedRole === 'corporate') {
      navigate('/marketplace');
    }
  };

  const roleInfo: Record<
    UserRole,
    { title: string; subtitle: string; icon: any; defaultPath: string }
  > = {
    citizen: {
      title: 'Citizen / Agroforestry Producer',
      subtitle: 'Aarav Sharma · Himalayan Eco Cooperative (Register land & track credits)',
      icon: UserCircle,
      defaultPath: '/dashboard'
    },
    verifier: {
      title: 'MoEFCC Empaneled Verifier',
      subtitle: 'Dr. Sunita Rao · Forest Research Institute (Inspect & approve environmental claims)',
      icon: Shield,
      defaultPath: '/verifier/queue'
    },
    corporate: {
      title: 'Corporate ESG Buyer',
      subtitle: 'Vikram Mehta · Tata Steel Sustainability (Acquire credits & report EPR compliance)',
      icon: Building2,
      defaultPath: '/marketplace'
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAE7] shadow-xl relative overflow-hidden">
        {/* Subtle decorative green aura */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
              Green Credits
            </h1>
            <p className="text-xs text-slate-500">Government of India · MoEFCC</p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Role (Fake Login — No Password Required)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">National Green Registry Sign-in</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your identity persona to enter the specialized operational portal.
          </p>
        </div>

        {/* Role Selection Radio Group */}
        <form onSubmit={handleLogin} className="mt-5 space-y-3">
          {(['citizen', 'verifier', 'corporate'] as UserRole[]).map((role) => {
            const info = roleInfo[role];
            const Icon = info.icon;
            const isSelected = selectedRole === role;

            return (
              <div
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{info.title}</p>
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={isSelected}
                      onChange={() => setSelectedRole(role)}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{info.subtitle}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Access {roleInfo[selectedRole].title} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            India&apos;s Green Credit Programme · Gazette Notification S.O. 4669(E)
          </p>
        </div>
      </div>
    </div>
  );
};
