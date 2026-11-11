import React from 'react';
import { FileText, Download, CheckCircle, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Reports: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useData();

  const commonReports = [
    {
      id: 'REP-2026-Q3',
      title: 'Q3 2026 Consolidated Environmental Audit Statement',
      category: 'MoEFCC Periodic Audit',
      date: '15 Oct 2026',
      size: '1.8 MB',
      status: 'Signed & Certified'
    },
    {
      id: 'REP-2026-Q2',
      title: 'Q2 2026 Remote Sensing & Canopy Density Verification',
      category: 'Geospatial Satellite Pass',
      date: '10 Jul 2026',
      size: '3.4 MB',
      status: 'Signed & Certified'
    },
    {
      id: 'REP-2026-HY',
      title: 'Semi-Annual Water Harvesting & Aquifer Recharge Filing',
      category: 'Groundwater Board (CGWB)',
      date: '28 Jun 2026',
      size: '2.1 MB',
      status: 'Signed & Certified'
    },
    {
      id: 'REP-2026-Q1',
      title: 'Q1 2026 Green Credit Registry Minting Transcript',
      category: 'CPCB Regulatory Ledger',
      date: '12 Apr 2026',
      size: '1.2 MB',
      status: 'Signed & Certified'
    }
  ];

  const roleReports = {
    citizen: [
      { id: 'DEV-2026-Q3', title: 'Project Credit & Activity Statement', category: 'Citizen Credit Ledger', date: '15 Oct 2026', size: '1.2 MB', status: 'Ready to Download' },
      { id: 'DEV-2026-Q2', title: 'Project Verification Outcomes', category: 'Project Audit History', date: '10 Jul 2026', size: '980 KB', status: 'Ready to Download' },
      { id: 'DEV-2026-HY', title: 'Credit Trading & Settlement Summary', category: 'Trading Statement', date: '28 Jun 2026', size: '740 KB', status: 'Ready to Download' }
    ],
    verifier: [
      { id: 'VER-2026-Q3', title: 'Verification Decisions Register', category: 'Verifier Activity', date: '15 Oct 2026', size: '1.8 MB', status: 'Signed & Certified' },
      { id: 'VER-2026-Q2', title: 'Evidence Review & Field Visit Log', category: 'Verification Audit', date: '10 Jul 2026', size: '3.4 MB', status: 'Signed & Certified' },
      { id: 'VER-2026-HY', title: 'Registry Credit Issuance Activity', category: 'Registry Activity', date: '28 Jun 2026', size: '2.1 MB', status: 'Signed & Certified' }
    ],
    corporate: [
      { id: 'BUY-2026-Q3', title: 'Corporate Credit Holdings Statement', category: 'Buyer Portfolio', date: '15 Oct 2026', size: '1.1 MB', status: 'Ready to Download' },
      { id: 'BUY-2026-Q2', title: 'Credit Purchase & Retirement Report', category: 'Compliance Report', date: '10 Jul 2026', size: '1.6 MB', status: 'Ready to Download' },
      { id: 'BUY-2026-HY', title: 'ESG Impact Summary', category: 'BRSR Reporting', date: '28 Jun 2026', size: '2.1 MB', status: 'Ready to Download' }
    ]
  };
  const reportList = roleReports[currentRole] || commonReports;
  const pageTitle = currentRole === 'verifier' ? 'Verification & Registry Reports' : currentRole === 'corporate' ? 'Compliance & ESG Reports' : 'My Project Reports';
  const pageDescription = currentRole === 'verifier'
    ? 'Review decisions, submitted evidence, and credit issuance activity.'
    : currentRole === 'corporate'
      ? 'Download buyer portfolio, credit retirement, and ESG impact statements.'
      : 'Download project activity, verification outcomes, and credit trading statements.';

  const handleDownload = (rep: typeof reportList[0]) => {
    showToast(`Downloading ${rep.title}...`, 'info');
    setTimeout(() => {
      const text = `GREEN CREDIT PROGRAMME — OFFICIAL REPORT
Report ID: ${rep.id}
Title: ${rep.title}
Category: ${rep.category}
Generated For: ${currentUser?.name || 'Aarav Sharma'}
Date: ${rep.date}
Verification Body: Forest Research Institute / MoEFCC India
Status: ${rep.status}
Hash: 0x99a1bc4f28d88e0018bce88231`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${rep.id}_${rep.category.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`${rep.id} report saved!`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Official Regulatory Dossier</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {pageDescription}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Available Reports</h3>
          <span className="text-xs text-slate-400 font-mono">{reportList.length} Documents Available</span>
        </div>

        <div className="divide-y divide-slate-100">
          {reportList.map((rep) => (
            <div
              key={rep.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-mono text-emerald-800">{rep.id}</span>
                    <span>·</span>
                    <span>{rep.category}</span>
                    <span>·</span>
                    <span>{rep.date}</span>
                    <span>·</span>
                    <span>{rep.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rep.status}</span>
                </span>
                <button
                  onClick={() => handleDownload(rep)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
