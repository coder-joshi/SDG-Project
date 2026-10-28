import React from 'react';
import {
  Coins,
  ShieldCheck,
  ArrowLeftRight,
  Download,
  Calendar,
  FileCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const CreditsLedger: React.FC = () => {
  const { creditsData, showToast } = useData();
  const { currentUser } = useAuth();

  const summary = creditsData?.summary || {
    totalCredits: 12480,
    availableForTrading: 8320,
    usedForCompliance: 3160,
    activeProjects: 5,
    growthPercentage: 18
  };

  const certificates = [
    {
      certId: 'GCP-IN-2026-08912',
      projectName: 'Himalayan Oak & Pine Ridge Afforestation',
      sector: 'Tree Plantation',
      amount: 2840,
      mintDate: '10 Feb 2026',
      verifier: 'Dr. Sunita Rao (FRI Dehradun)',
      status: 'Active · Tradable'
    },
    {
      certId: 'GCP-IN-2026-07431',
      projectName: 'Narmada Basin Regenerative Agroforestry',
      sector: 'Sustainable Agriculture',
      amount: 2420,
      mintDate: '01 Mar 2026',
      verifier: 'Dr. Sunita Rao (MoEFCC Empaneled)',
      status: 'Active · Tradable'
    },
    {
      certId: 'GCP-IN-2026-06119',
      projectName: 'Thar Desert Rainwater Catchment & Johad Revival',
      sector: 'Water Management',
      amount: 3150,
      mintDate: '22 Mar 2026',
      verifier: 'Dr. Sunita Rao (CGWB Evaluator)',
      status: 'Active · Tradable'
    },
    {
      certId: 'GCP-IN-2026-05204',
      projectName: 'Western Ghats Watershed Riparian Corridor',
      sector: 'Tree Plantation',
      amount: 1890,
      mintDate: '05 Apr 2026',
      verifier: 'Dr. Sunita Rao (FRI Dehradun)',
      status: 'Active · Tradable'
    },
    {
      certId: 'GCP-IN-2026-04180',
      projectName: 'Kutch Banni Native Grassland & Prosopis Mitigation',
      sector: 'Waste Management',
      amount: 2180,
      mintDate: '10 May 2026',
      verifier: 'Dr. Sunita Rao (GEC Gujarat)',
      status: 'Active · Tradable'
    }
  ];

  const handleDownloadCert = (certId: string, projectName: string) => {
    showToast(`Downloading Certificate ${certId}...`, 'info');
    setTimeout(() => {
      const text = `GOVERNMENT OF INDIA
MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE
NATIONAL GREEN CREDIT REGISTRY
=====================================================
GREEN CREDIT CERTIFICATE: ${certId}

Beneficiary: ${currentUser?.name || 'Aarav Sharma'}
Project: ${projectName}
Date of Minting: ${new Date().toLocaleDateString('en-IN')}
Authority: Indian Green Credit Programme (GCP)
Validity: Permanent Tradable / Non-Expiring unless Retired
Verification Standard: Remote Sensing + MoEFCC Ground Truth Verification`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${certId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Certificate ${certId} saved to downloads!`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Digital Environmental Asset Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Green Credits Portfolio & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Certified cryptographic tokens backed by verified land restoration and carbon sequestration
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Total Minted Credits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-3 tabular-nums">
            {summary.totalCredits.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1">100% Registry Verified</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Available for Trading</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-3 tabular-nums">
            {summary.availableForTrading.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-sky-700 font-medium mt-1">Liquid on GCP Exchange</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Used for Compliance (EPR)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-3 tabular-nums">
            {summary.usedForCompliance.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-purple-700 font-medium mt-1">Surrendered to CPCB</p>
        </div>
      </div>

      {/* Minted Certificates List */}
      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Minted Green Credit Certificates</h3>
            <p className="text-xs text-slate-500">Official registry credentials issued by MoEFCC</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
            5 Active Certificates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Associated Project</th>
                <th className="py-3 px-4">Activity Sector</th>
                <th className="py-3 px-4 text-right">Credit Value</th>
                <th className="py-3 px-4">Date Minted</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {certificates.map((cert) => (
                <tr key={cert.certId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {cert.certId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {cert.projectName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {cert.sector}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {cert.amount.toLocaleString('en-IN')} GCP
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {cert.mintDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDownloadCert(cert.certId, cert.projectName)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-800 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
