import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ChevronDown, Check, UserCheck, Shield, Building2, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { activities } = useData();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
    if (role === 'citizen') navigate('/dashboard');
    else if (role === 'verifier') navigate('/verifier/queue');
    else if (role === 'corporate') navigate('/marketplace');
  };

  const roleLabels: Record<UserRole, { title: string; badge: string; icon: any }> = {
    citizen: { title: 'Citizen / Farmer', badge: 'Citizen', icon: UserCircle },
    verifier: { title: 'MoEFCC Verifier', badge: 'Empaneled Verifier', icon: Shield },
    corporate: { title: 'Corporate ESG Buyer', badge: 'Corporate Buyer', icon: Building2 }
  };

  const unreadCount = activities.filter((a) => a.status === 'Pending').length || 2;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5EAE7] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}!</span>
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {currentRole === 'citizen' && 'National Green Credit Registry · Active Cycle 2026'}
            {currentRole === 'verifier' && 'Inspection Desk · Forest Research Institute'}
            {currentRole === 'corporate' && 'Tata Steel Sustainability ESG Portfolio'}
          </p>
        </div>
      </div>

      {/* Right: Actions, Notifications & Role Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Switcher Pill Dropdown */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Switch demo persona"
          >
            <span className="hidden md:inline text-slate-500">Role:</span>
            <span className="font-semibold text-emerald-800 capitalize">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Demo)
                </p>
              </div>

              <button
                onClick={() => handleRoleChange('citizen')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentRole === 'citizen' ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-medium">Citizen (Aarav Sharma)</p>
                    <p className="text-[10px] text-slate-400">Manage projects & earn credits</p>
                  </div>
                </div>
                {currentRole === 'citizen' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('verifier')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentRole === 'verifier' ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-medium">Verifier (Dr. Sunita Rao)</p>
                    <p className="text-[10px] text-slate-400">Inspect & approve green claims</p>
                  </div>
                </div>
                {currentRole === 'verifier' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('corporate')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentRole === 'corporate' ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-medium">Corporate (Vikram Mehta)</p>
                    <p className="text-[10px] text-slate-400">Buy credits & view ESG impact</p>
                  </div>
                </div>
                {currentRole === 'corporate' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-emerald-700 font-medium">{unreadCount} active updates</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activities.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{item.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden shrink-0">
            <img
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'}
              alt={currentUser?.name || 'User Avatar'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser?.name || 'Aarav Sharma'}
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              {roleLabels[currentRole]?.badge || 'Citizen'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
