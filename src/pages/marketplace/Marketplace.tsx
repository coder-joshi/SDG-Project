import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Coins,
  Building2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { GCPActivityType } from '../../types';

export const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'available' | 'priceAsc' | 'priceDesc'>('available');

  // Filter only projects that are Active and have creditsAvailable > 0
  const verifiedProjects = useMemo(() => {
    return projects.filter((p) => p.status === 'Active');
  }, [projects]);

  // Extract unique states
  const statesList = useMemo(() => {
    const set = new Set(verifiedProjects.map((p) => p.state));
    return Array.from(set).sort();
  }, [verifiedProjects]);

  const filteredProjects = useMemo(() => {
    return verifiedProjects
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesActivity =
          selectedActivity === 'all' || p.activityType === selectedActivity;

        const matchesState = selectedState === 'all' || p.state === selectedState;

        return matchesSearch && matchesActivity && matchesState;
      })
      .sort((a, b) => {
        if (sortBy === 'available') return b.creditsAvailable - a.creditsAvailable;
        if (sortBy === 'priceAsc') return a.pricePerCreditINR - b.pricePerCreditINR;
        if (sortBy === 'priceDesc') return b.pricePerCreditINR - a.pricePerCreditINR;
        return 0;
      });
  }, [verifiedProjects, searchQuery, selectedActivity, selectedState, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Corporate ESG Wallet Overview */}
      <div className="bg-gradient-to-r from-[#0B3D2E] to-[#16553E] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Building2 className="w-4 h-4" />
            <span>National Green Credit Trading Exchange (GCP-X)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Certified Green Credit Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            Acquire verified, high-integrity environmental credits directly from Indian farmers, cooperatives, and restoration champions to fulfill EPR and ESG mandates.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shrink-0">
          <div>
            <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
              Corporate ESG Wallet
            </p>
            <p className="text-lg sm:text-xl font-bold font-display tabular-nums text-white">
              ₹{(currentUser?.balanceINR || 24500000).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="pl-4 border-l border-white/20">
            <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
              Holdings
            </p>
            <p className="text-lg sm:text-xl font-bold font-display tabular-nums text-emerald-300">
              {(currentUser?.purchasedCredits || 42500).toLocaleString('en-IN')} GCP
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#E5EAE7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, location, farmer..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Activities</option>
            <option value="Tree Plantation">Tree Plantation</option>
            <option value="Water Management">Water Management</option>
            <option value="Sustainable Agriculture">Sustainable Agri</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Mangrove Conservation">Mangrove Conservation</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Indian States</option>
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="available">Most Available Credits</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Verified Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to browse all verified environmental credits.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedActivity('all');
                setSelectedState('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/marketplace/${project.id}`)}
              className="bg-white rounded-[12px] border border-[#E5EAE7] shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
            >
              {/* Project Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={project.images[0] || '/src/assets/images/hero_indian_forest_1793156598252.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-xs font-bold text-emerald-800 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified MoEFCC</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {project.id}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-emerald-700">{project.activityType}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.district}, {project.state}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer Strip */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Available Credits</span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      {project.creditsAvailable.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-semibold text-emerald-700">GCP</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Price / Credit</span>
                    <span className="text-base font-extrabold text-slate-900 font-display tabular-nums">
                      ₹{project.pricePerCreditINR}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/marketplace/${project.id}`);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-[#2E7D32] hover:text-white text-slate-800 text-xs font-semibold border border-slate-200 hover:border-[#2E7D32] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect & Buy Credits</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
