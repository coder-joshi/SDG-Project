import React from 'react';
import {
  Trees,
  Droplets,
  Coins,
  ShieldCheck,
  TrendingUp,
  FileDown,
  Building2,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const ImpactAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const { creditsData, showToast } = useData();

  const carbonTrajectoryData = [
    { month: 'May', target: 200, actual: 215 },
    { month: 'Jun', target: 250, actual: 280 },
    { month: 'Jul', target: 300, actual: 340 },
    { month: 'Aug', target: 360, actual: 390 },
    { month: 'Sep', target: 420, actual: 445 },
    { month: 'Oct', target: 480, actual: 520 },
    { month: 'Nov', target: 550, actual: 580 },
    { month: 'Dec', target: 620, actual: 660 }
  ];

  const sdgAllocationData = [
    { sdg: 'SDG 15 Life on Land', credits: 16500, fill: '#1E6B3A' },
    { sdg: 'SDG 6 Clean Water', credits: 9800, fill: '#0284C7' },
    { sdg: 'SDG 13 Climate Action', credits: 8200, fill: '#0D9488' },
    { sdg: 'SDG 12 Resp. Consumption', credits: 4500, fill: '#CA8A04' },
    { sdg: 'SDG 14 Life Below Water', credits: 3500, fill: '#6366F1' }
  ];

  const handleExportBRSR = () => {
    showToast('Exporting SEBI BRSR Core Environmental Disclosures (Form B)...', 'info');
    setTimeout(() => {
      const text = `BUSINESS RESPONSIBILITY AND SUSTAINABILITY REPORTING (BRSR CORE)
Company: ${currentUser?.company || 'Tata Steel Sustainability Initiative'}
Reporting Year: 2026-27
GCP Total Credits Retired: 38,200 GCP
Total Trees Planted (Direct & Contract): 124,500
Water Recharged & Conserved: 14.8 Million Litres
Scope 1 & 2 Emissions Neutralized: 842.6 MT CO2e
SEBI Core Indicator 1 & 2: VERIFIED & COMPLIANT
Auditor Registry: MoEFCC National Green Credit Authority`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BRSR_Core_ESG_Report_2026.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('BRSR Core Sustainability Disclosures exported!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Corporate Sustainability & ESG Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Ecological Impact & Abatement Portfolio
          </h1>
          <p className="text-xs text-slate-500">
            Portfolio metrics for <strong>{currentUser?.company || 'Tata Steel Sustainability Initiative'}</strong>
          </p>
        </div>

        <button
          onClick={handleExportBRSR}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FileDown className="w-4 h-4" />
          <span>Export BRSR Core Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Trees Planted
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              124,500
            </span>
            <span className="text-xs font-bold text-emerald-700 ml-1">Saplings</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Western Ghats & Himalayas</p>
        </div>

        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Water Conserved
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              14.8M
            </span>
            <span className="text-xs font-bold text-sky-700 ml-1">Litres</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Through Johad check dams</p>
        </div>

        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Credits Acquired
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              {(currentUser?.purchasedCredits || 42500).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-purple-700 ml-1">GCP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">38,200 retired for EPR</p>
        </div>

        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Corporate ESG Score
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              {currentUser?.esgScore || 88.4}
            </span>
            <span className="text-xs font-bold text-teal-700">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Top Decile in Metals & Mining</span>
          </p>
        </div>
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Carbon Abatement Progress */}
        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Carbon Abatement Trajectory (MT CO₂)
              </h3>
              <p className="text-xs text-slate-500">Corporate Target vs Actual Verified Offsets</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Surpassing Target
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={carbonTrajectoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E6B3A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1E6B3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#1E6B3A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  name="Actual Abatement"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none"
                  name="EPR Regulatory Baseline"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Credits by SDG */}
        <div className="bg-white rounded-[12px] p-5 border border-[#E5EAE7] shadow-sm">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Credit Allocation by UN SDG Goals
              </h3>
              <p className="text-xs text-slate-500">Distribution across Indian ecological priorities</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
              UN Agenda 2030
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sdgAllocationData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F2" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis dataKey="sdg" type="category" stroke="#64748B" fontSize={10} width={130} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} GCP`, 'Retired']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="credits" fill="#1E6B3A" radius={[0, 4, 4, 0]} name="Credits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
