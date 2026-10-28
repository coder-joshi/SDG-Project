import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  ArrowLeftRight,
  ShieldCheck,
  FolderKanban,
  PlusCircle,
  ShoppingBag,
  FileDown,
  TrendingUp,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/StatCard';
import { ProjectTable } from '../../components/ProjectTable';
import { ActivityFeed } from '../../components/ActivityFeed';
import { ImpactCard } from '../../components/ImpactCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projects, creditsData, activities, showToast } = useData();

  const [timeRange, setTimeRange] = useState<'12m' | '2026' | '2025'>('12m');

  const summary = creditsData?.summary || {
    totalCredits: 12480,
    availableForTrading: 8320,
    usedForCompliance: 3160,
    activeProjects: 5,
    growthPercentage: 18
  };

  const monthlyData = creditsData?.monthlyOverview || [];
  const activityData = creditsData?.creditsByActivity || [];

  const handleDownloadReport = () => {
    showToast('Generating official GCP Annual Environmental Audit PDF...', 'info');
    setTimeout(() => {
      // Create a downloadable mock text/report blob
      const reportContent = `GREEN CREDIT PROGRAMME (GCP) — OFFICIAL STATEMENT
Issued by: Ministry of Environment, Forest and Climate Change (MoEFCC)
Participant: ${currentUser?.name || 'Aarav Sharma'}
Total Credits Minted: ${summary.totalCredits.toLocaleString('en-IN')} GCP
Available for Trading: ${summary.availableForTrading.toLocaleString('en-IN')} GCP
Surrendered for Compliance: ${summary.usedForCompliance.toLocaleString('en-IN')} GCP
Registered Projects: ${summary.activeProjects}
Generated Date: ${new Date().toLocaleDateString('en-IN')}
Status: VERIFIED & COMPLIANT WITH BRSR CORE FRAMEWORK`;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GreenCredits_Audit_${currentUser?.name?.replace(/\s+/g, '_')}_2026.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('GCP Annual Audit Statement downloaded successfully!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5EAE7] bg-[#0B3D2E] text-white">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_indian_forest_1793156598252.jpg"
            alt="Lush Indian forest canopy"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E] via-[#0B3D2E]/80 to-transparent" />
        </div>

        {/* Content & Glass Card */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Green Credit Programme</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn Environmental Action into Real Value
            </h1>

            <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
              Monetize verified conservation initiatives across India. Tree plantation, water harvesting, and sustainable agriculture convert into tradable digital green credits.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/projects/new')}
                className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/40 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register Project</span>
              </button>

              <button
                onClick={() => navigate('/marketplace')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all"
              >
                Explore Marketplace
              </button>
            </div>
          </div>

          {/* Glass Card on right */}
          <div className="shrink-0 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl max-w-xs w-full">
            <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">
              Total Green Balance
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display tabular-nums">
                {summary.totalCredits.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-300">GCP</span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                <TrendingUp className="w-3.5 h-3.5" />
                ↑{summary.growthPercentage}%
              </span>
              <span className="text-emerald-100/70 text-[11px]">vs previous cycle</span>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
              <span>Tradable: {summary.availableForTrading.toLocaleString('en-IN')}</span>
              <span>·</span>
              <span>EPR Used: {summary.usedForCompliance.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Credits"
          value={summary.totalCredits}
          unit="GCP"
          trend="↑ 18% cycle"
          icon={Coins}
          tint="green"
          subtext="Lifetime minted"
        />
        <StatCard
          title="Available for Trading"
          value={summary.availableForTrading}
          unit="GCP"
          trend="₹480 avg/credit"
          icon={ArrowLeftRight}
          tint="blue"
          subtext="Liquid on Exchange"
        />
        <StatCard
          title="Used for Compliance"
          value={summary.usedForCompliance}
          unit="GCP"
          trend="CPCB Approved"
          icon={ShieldCheck}
          tint="purple"
          subtext="EPR Offset Quota"
        />
        <StatCard
          title="Active Projects"
          value={summary.activeProjects}
          unit="Plots"
          trend="100% verified"
          icon={FolderKanban}
          tint="teal"
          subtext="Across 4 States"
        />
      </div>

      {/* 3. CHARTS ROW & SIDEBAR SUMMARY (Main 2/3 and Right 1/3 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stacked Bar Chart & Donut Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stacked Bar Chart */}
          <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Green Credits Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Stacked monthly breakdown: Generated, Traded, and Used for Compliance
                </p>
              </div>

              {/* Range Dropdown */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="12m">Last 12 Months</option>
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                </select>
              </div>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="generated" stackId="a" fill="#1E6B3A" name="Generated" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="traded" stackId="a" fill="#0284C7" name="Traded" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="used" stackId="a" fill="#8B5CF6" name="Compliance" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Credits by Activity Type */}
          <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Credits by Activity Type
                </h3>
                <p className="text-xs text-slate-500">Distribution according to official GCP notification</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                8 Activity Sectors
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              {/* Donut Chart */}
              <div className="relative h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      dataKey="credits"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val.toLocaleString()} GCP`, 'Credits']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 font-display tabular-nums">
                    {summary.totalCredits.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total GCP
                  </span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 font-medium truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums ml-1 text-[11px]">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. MY PROJECTS TABLE & QUICK ACTIONS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ProjectTable projects={projects} limit={4} showAllLink={true} />
            </div>

            {/* Quick Actions 2x2 Grid */}
            <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Quick Actions</h3>
                <p className="text-xs text-slate-500 mt-0.5">Frequent ecosystem operations</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <button
                  onClick={() => navigate('/projects/new')}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all flex flex-col justify-between group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">Register</p>
                    <p className="text-[10px] text-slate-500">New Project</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/trading')}
                  className="p-3 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-300 text-left transition-all flex flex-col justify-between group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-sky-800">Buy / Sell</p>
                    <p className="text-[10px] text-slate-500">P2P Trading</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 text-left transition-all flex flex-col justify-between group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-purple-800">Marketplace</p>
                    <p className="text-[10px] text-slate-500">Verified Credits</p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-300 text-left transition-all flex flex-col justify-between group"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800">Reports</p>
                    <p className="text-[10px] text-slate-500">Export Audits</p>
                  </div>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Green Registry Node: Online</span>
                <span className="font-mono text-emerald-700">v1.4 MoEFCC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity feed + ImpactCard */}
        <div className="space-y-6">
          <ImpactCard
            treesPlanted={creditsData?.impact.treesPlanted}
            co2ReducedMT={creditsData?.impact.co2OffsetMT}
            waterSavedLitres={creditsData?.impact.waterSavedLitres}
            landRegeneratedHa={creditsData?.impact.landRegeneratedHa}
          />

          <ActivityFeed activities={activities} limit={5} />
        </div>
      </div>
    </div>
  );
};
