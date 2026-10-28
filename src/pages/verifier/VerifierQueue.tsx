import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle,
  X,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Project } from '../../types';
import { MapPicker } from '../../components/MapPicker';

export const VerifierQueue: React.FC = () => {
  const { projects, verifyProject } = useData();
  const { currentUser } = useAuth();

  // Filter pending / under review projects
  const pendingProjects = projects.filter(
    (p) => p.status === 'Under Review' || p.status === 'Submitted'
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAwardCredits, setCustomAwardCredits] = useState<number>(1850);

  // Auto-select first item or next item
  useEffect(() => {
    if (pendingProjects.length > 0) {
      if (!selectedProjectId || !pendingProjects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(pendingProjects[0].id);
        setCustomAwardCredits(Math.round(pendingProjects[0].areaHa * 110) || 1850);
      }
    } else {
      setSelectedProjectId(null);
    }
  }, [pendingProjects, selectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Update calculated credits when selection changes
  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setCustomAwardCredits(Math.round(project.areaHa * 110) || 1850);
  };

  const handleApprove = async () => {
    if (!selectedProject) return;
    setIsProcessing(true);
    try {
      await verifyProject(selectedProject.id, true, undefined, customAwardCredits);
      // Auto-select will kick in via useEffect
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedProject) return;
    if (!rejectionReason.trim()) return;

    setIsProcessing(true);
    try {
      await verifyProject(selectedProject.id, false, rejectionReason);
      setRejectModalOpen(false);
      setRejectionReason('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>MoEFCC Environmental Audit Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Verification & Audit Queue
          </h1>
          <p className="text-xs text-slate-500">
            Auditor: <strong>{currentUser?.name || 'Dr. Sunita Rao'}</strong> · Empaneled Lead Environmental Inspector
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingProjects.length} Claims Awaiting Field Verification</span>
          </span>
        </div>
      </div>

      {/* Split Screen Container (40% Left, 60% Right on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (40% ~ 5 of 12 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden flex flex-col h-[740px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pending Claim Submissions
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {pendingProjects.length} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {pendingProjects.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Queue is Clear!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  All pending Green Credit claims have been inspected and resolved. New citizen applications will populate here automatically.
                </p>
              </div>
            ) : (
              pendingProjects.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/40'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                          {project.id}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                          {project.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                        Pending
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                      <span>Applicant: <strong>{project.applicantName}</strong></span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{project.activityType}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {project.district}, {project.state}
                      </span>
                      <span>{project.areaHa} Ha</span>
                      <span>Submitted: {project.submittedDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (60% ~ 7 of 12 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden flex flex-col">
          {selectedProject ? (
            <div className="p-5 sm:p-6 space-y-5">
              {/* Request Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {selectedProject.id}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {selectedProject.activityType}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1.5">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Applicant: <strong>{selectedProject.applicantName}</strong> ({selectedProject.applicantId})
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block font-mono">Plot Extent</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {selectedProject.areaHa} Hectares
                  </span>
                </div>
              </div>

              {/* Geotag Map Inspection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Geospatial Plot Coordinates & Terrain Map</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {selectedProject.lat}, {selectedProject.lng} ({selectedProject.district}, {selectedProject.state})
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <MapPicker
                    lat={selectedProject.lat}
                    lng={selectedProject.lng}
                    onChange={() => {}}
                    height="240px"
                    readOnly={true}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <p className="font-semibold text-slate-800 mb-1">Ecological Activity Narrative:</p>
                <p className="leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Photo Evidence Gallery with Lightbox trigger */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Submitted Photographic Evidence ({selectedProject.images.length})</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Click photo to enlarge</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedProject.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImg(imgUrl)}
                      className="group relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100 cursor-pointer shadow-sm hover:ring-2 hover:ring-emerald-500 transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Evidence plot photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit Minting Calculator */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>GCP Minting Formula</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Standard rate for {selectedProject.activityType}: ~110 credits/ha
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700">Credits to Award:</label>
                  <input
                    type="number"
                    value={customAwardCredits}
                    onChange={(e) => setCustomAwardCredits(Number(e.target.value))}
                    className="w-24 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-900 tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-800">GCP</span>
                </div>
              </div>

              {/* Action Buttons: Approve / Reject */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Reject Claim</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Minting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve & Mint {customAwardCredits} Credits</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a project from the left queue to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-emerald-300 transition-colors flex items-center gap-1 text-xs"
            >
              <X className="w-5 h-5" />
              <span>Close preview</span>
            </button>
            <img
              src={lightboxImg}
              alt="High resolution evidence inspection"
              className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain border border-white/20"
              referrerPolicy="no-referrer"
            />
            <p className="text-white/80 text-xs mt-3 text-center">
              Geotagged Photographic Proof · MoEFCC Verification Layer
            </p>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Reject Verification Request</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Specify the legal or ecological reason for rejection. This reason will be logged in the public ledger and transmitted to applicant <strong>{selectedProject?.applicantName}</strong>.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Geotagged photographic boundaries overlapped with protected territorial forest sanctuary zone. Boundary re-survey required."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim() || isProcessing}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
