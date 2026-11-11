import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, Shield, Building2, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const { activities } = useData();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<string, { title: string; badge: string; icon: any }> = {
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
        <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-800">{roleLabels[currentRole]?.badge}</span>

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
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100" aria-label="Sign out"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>
      </div>
    </header>
  );
};
