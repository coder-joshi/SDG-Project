import React from 'react';
import { Trees, CloudRain, Droplets, Globe2 } from 'lucide-react';

interface ImpactCardProps {
  treesPlanted?: number;
  co2ReducedMT?: number;
  waterSavedLitres?: number;
  landRegeneratedHa?: number;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({
  treesPlanted = 14250,
  co2ReducedMT = 312.4,
  waterSavedLitres = 1840000,
  landRegeneratedHa = 84.5
}) => {
  const formatLitres = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M L`;
    }
    return `${(val / 1000).toFixed(0)}k L`;
  };

  return (
    <div className="bg-gradient-to-br from-[#0B3D2E] to-[#124B38] text-white rounded-[12px] p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            India Ecological Ledger
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
            Your Cumulative Environmental Impact
          </h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-800/60 flex items-center justify-center text-emerald-300">
          <Globe2 className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3.5">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-300">
            <Trees className="w-4 h-4" />
            <span className="text-[11px] font-medium text-emerald-200">Trees Planted</span>
          </div>
          <p className="text-lg font-extrabold text-white mt-1 tabular-nums">
            {treesPlanted.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-300/70 mt-0.5">Native species</p>
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-sky-300">
            <CloudRain className="w-4 h-4" />
            <span className="text-[11px] font-medium text-sky-200">CO₂ Reduced</span>
          </div>
          <p className="text-lg font-extrabold text-white mt-1 tabular-nums">
            {co2ReducedMT.toFixed(1)} MT
          </p>
          <p className="text-[10px] text-sky-300/70 mt-0.5">Certified offsets</p>
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-cyan-300">
            <Droplets className="w-4 h-4" />
            <span className="text-[11px] font-medium text-cyan-200">Water Saved</span>
          </div>
          <p className="text-lg font-extrabold text-white mt-1 tabular-nums">
            {formatLitres(waterSavedLitres)}
          </p>
          <p className="text-[10px] text-cyan-300/70 mt-0.5">Aquifer recharge</p>
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-amber-300">
            <Globe2 className="w-4 h-4" />
            <span className="text-[11px] font-medium text-amber-200">Land Restored</span>
          </div>
          <p className="text-lg font-extrabold text-white mt-1 tabular-nums">
            {landRegeneratedHa} Ha
          </p>
          <p className="text-[10px] text-amber-300/70 mt-0.5">Ecological zones</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-200/80">
        <span>Verified by MoEFCC Standards</span>
        <span className="font-semibold text-emerald-300">100% Registry Audited</span>
      </div>
    </div>
  );
};
