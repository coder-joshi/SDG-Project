import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Coins,
  ArrowLeftRight,
  FileText,
  User as UserIcon,
  Settings,
  ShieldCheck,
  ShoppingBag,
  BarChart3,
  PlusCircle,
  X,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { currentRole } = useAuth();

  const getNavLinks = () => {
    if (currentRole === 'verifier') {
      return [
        { to: '/verifier/queue', label: 'Verifier Queue', icon: ShieldCheck },
        { to: '/projects', label: 'All Projects', icon: FolderKanban },
        { to: '/reports', label: 'Audit Reports', icon: FileText },
        { to: '/profile', label: 'Verifier Profile', icon: UserIcon },
        { to: '/settings', label: 'Settings', icon: Settings }
      ];
    }

    if (currentRole === 'corporate') {
      return [
        { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { to: '/impact', label: 'ESG Impact', icon: BarChart3 },
        { to: '/trading', label: 'Credit Trades', icon: ArrowLeftRight },
        { to: '/reports', label: 'Compliance Reports', icon: FileText },
        { to: '/profile', label: 'Corporate Profile', icon: UserIcon },
        { to: '/settings', label: 'Settings', icon: Settings }
      ];
    }

    // Default Citizen role
    return [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: 'My Projects', icon: FolderKanban },
      { to: '/projects/new', label: 'Register Project', icon: PlusCircle },
      { to: '/credits', label: 'Green Credits', icon: Coins },
      { to: '/trading', label: 'P2P Trading', icon: ArrowLeftRight },
      { to: '/reports', label: 'Reports & Audits', icon: FileText },
      { to: '/profile', label: 'Profile', icon: UserIcon },
      { to: '/settings', label: 'Settings', icon: Settings }
    ];
  };

  const navLinks = getNavLinks();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B3D2E] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#164D3B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E6B3A] flex items-center justify-center text-white shadow-md shadow-emerald-950/40 shrink-0">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight font-display">
              Green Credits
            </h1>
            <p className="text-[11px] text-emerald-200/80 truncate">
              Govt. of India · MoEFCC
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 text-emerald-300 hover:text-white hover:bg-[#164D3B] rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Pill indicator */}
      <div className="px-5 py-3 border-b border-[#164D3B]/60 bg-[#082D22]/60 flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wide uppercase text-emerald-300/80">
          Role Portal
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1E6B3A]/60 text-emerald-200 border border-[#1E6B3A] capitalize">
          {currentRole}
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onMobileClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E6B3A] text-white shadow-sm font-semibold'
                    : 'text-emerald-100/85 hover:bg-[#144737] hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 opacity-90" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Forest illustration & Footer */}
      <div className="p-4 m-3 rounded-xl bg-[#082A20] border border-[#154E3C] relative overflow-hidden text-center">
        <div className="w-full h-20 rounded-lg overflow-hidden mb-2.5 relative">
          <img
            src="/src/assets/images/forest_sidebar_ill_1793156598045.jpg"
            alt="Forest Conservation"
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#082A20] via-transparent to-transparent" />
        </div>
        <p className="text-xs font-semibold text-emerald-100">
          Supporting a Sustainable India
        </p>
        <p className="text-[11px] text-emerald-300/70 mt-0.5">
          National Green Credit Registry
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar (254px wide) */}
      <aside className="hidden lg:flex flex-col w-[254px] shrink-0 h-screen sticky top-0 border-r border-[#164D3B] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
