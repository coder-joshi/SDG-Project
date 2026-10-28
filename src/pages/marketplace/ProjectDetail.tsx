import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Trees,
  CheckCircle2,
  Calendar,
  Building2,
  ShoppingBag,
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MapPicker } from '../../components/MapPicker';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, buyCredits, showToast } = useData();
  const { currentUser } = useAuth();

  const project = projects.find((p) => p.id === id);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(100);
  const [isBuying, setIsBuying] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    orderId: string;
    quantity: number;
    totalCost: number;
  } | null>(null);

  if (!project) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Project Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested Green Credit registry project could not be located.
        </p>
        <button
          onClick={() => navigate('/marketplace')}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const maxAvailable = project.creditsAvailable || 0;
  const unitPrice = project.pricePerCreditINR || 480;
  const totalCost = quantity * unitPrice;
  const currentBalance = currentUser?.balanceINR || 24500000;
  const canAfford = currentBalance >= totalCost;

  const handlePurchase = async () => {
    if (quantity <= 0 || quantity > maxAvailable || !canAfford) return;

    setIsBuying(true);
    try {
      const res = await buyCredits(project.id, quantity);
      setReceiptData({
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        quantity,
        totalCost: res.totalCost
      });
    } catch (err: any) {
      showToast(err.message || 'Transaction failed', 'error');
    } finally {
      setIsBuying(false);
    }
  };

  const downloadReceipt = () => {
    if (!receiptData) return;
    const text = `GREEN CREDIT PROGRAMME — PURCHASE CERTIFICATE & RECEIPT
Order ID: ${receiptData.orderId}
Project Name: ${project.title}
Registry ID: ${project.id}
Activity Type: ${project.activityType}
State / District: ${project.district}, ${project.state}
Credits Purchased: ${receiptData.quantity.toLocaleString('en-IN')} GCP
Price per Credit: ₹${unitPrice}
Total Consideration: ₹${receiptData.totalCost.toLocaleString('en-IN')}
Purchaser: ${currentUser?.name || 'Tata Steel Sustainability Initiative'}
Timestamp: ${new Date().toISOString()}
Compliance Validity: MoEFCC Gazette Notification S.O. 4669(E)
STATUS: TRANSFERRED & RETIRED/HELD IN ESG WALLET`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GCP_TransferReceipt_${receiptData.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transfer receipt downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/marketplace')}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          aria-label="Back to marketplace"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-xs text-slate-500">
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/marketplace')}>
            Marketplace
          </span>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-semibold truncate">{project.title}</span>
        </div>
      </div>

      {/* Main Grid: Details + Purchase Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Gallery, Overview, Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Card */}
          <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden">
            <div className="relative h-72 sm:h-96 w-full bg-slate-900">
              <img
                src={project.images[activePhotoIdx] || project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-xs font-bold text-emerald-800 shadow">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified GCP Asset</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md font-mono">
                {project.id}
              </div>
            </div>

            {/* Thumbnail selector */}
            {project.images.length > 1 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                {project.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      activePhotoIdx === i ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Description */}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {project.activityType}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.district}, {project.state}
                </span>
                <span>·</span>
                <span>Submitted: {project.submittedDate}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {project.title}
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Applicant / Cooperative</span>
                  <span className="font-semibold text-slate-800">{project.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Land Extent</span>
                  <span className="font-semibold text-slate-800">{project.areaHa} Hectares</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MoEFCC Auditor</span>
                  <span className="font-semibold text-slate-800">{project.verifierName || 'Dr. Sunita Rao'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Geospatial Plot Coordinates</h3>
                <p className="text-xs text-slate-500">Verified boundary location in OpenStreetMap</p>
              </div>
              <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                {project.lat}, {project.lng}
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <MapPicker
                lat={project.lat}
                lng={project.lng}
                onChange={() => {}}
                height="280px"
                readOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Purchase Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm space-y-5 sticky top-20">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Certified Green Credits
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
                    {project.creditsAvailable.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 ml-1">GCP Available</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    ₹{project.pricePerCreditINR}
                  </span>
                  <span className="text-[11px] text-slate-400 block">/ credit</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Compliance Standard:</span>
                <span className="font-semibold text-slate-800">MoEFCC GCP 2026</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>EPR Tradability:</span>
                <span className="font-semibold text-emerald-700">Immediate</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vintage / Cycle:</span>
                <span className="font-semibold text-slate-800">2026 Batch #01</span>
              </div>
            </div>

            <button
              onClick={() => setBuyModalOpen(true)}
              disabled={maxAvailable <= 0}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256628] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{maxAvailable > 0 ? 'Buy Green Credits' : 'Sold Out'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Purchased credits are immediately transferred to your ESG ledger and can be surrendered for environmental compliance or CSR reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Buy Credits Modal */}
      {buyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {!receiptData ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-base font-bold text-slate-900">Purchase Green Credits</h3>
                  </div>
                  <button
                    onClick={() => setBuyModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 space-y-4">
                  <div>
                    <span className="text-xs text-slate-400">Target Project</span>
                    <p className="text-sm font-bold text-slate-900">{project.title}</p>
                    <p className="text-xs text-slate-500 font-mono">{project.id} · {project.district}, {project.state}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantity of Credits (Max: {maxAvailable.toLocaleString('en-IN')})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={maxAvailable}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(maxAvailable, Number(e.target.value))))}
                        className="flex-1 text-sm font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(maxAvailable)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                      >
                        Max All
                      </button>
                    </div>
                  </div>

                  {/* Price Calculation Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Unit Price:</span>
                      <span className="font-semibold text-slate-800">₹{unitPrice} per credit</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Consideration:</span>
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        ₹{totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                      <span>Corporate Wallet Balance:</span>
                      <span className="font-mono text-slate-800">
                        ₹{currentBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Balance After Transfer:</span>
                      <span className="font-mono text-emerald-800 font-semibold">
                        ₹{(currentBalance - totalCost).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {!canAfford && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Insufficient corporate wallet balance for this purchase.</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBuyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={isBuying || !canAfford || quantity <= 0}
                    className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] disabled:opacity-50 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5"
                  >
                    {isBuying ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Settlement...</span>
                      </>
                    ) : (
                      <span>Confirm & Purchase ₹{totalCost.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success confirmation with receipt */
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Purchase Completed!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Successfully acquired <strong>{receiptData.quantity.toLocaleString('en-IN')} GCP</strong> from {project.title}. The credits have been credited to your Corporate ESG Ledger.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-slate-800 font-bold">{receiptData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                    <span className="text-slate-800 font-bold">₹{receiptData.totalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registry Certificate:</span>
                    <span className="text-emerald-700 font-bold">MoEFCC-GCP-{receiptData.orderId}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={downloadReceipt}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => {
                      setBuyModalOpen(false);
                      setReceiptData(null);
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
