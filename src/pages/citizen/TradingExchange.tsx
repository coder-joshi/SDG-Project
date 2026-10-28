import React, { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const TradingExchange: React.FC = () => {
  const { currentUser } = useAuth();
  const { creditsData, showToast } = useData();

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [sellAmount, setSellAmount] = useState<number>(200);
  const [askPrice, setAskPrice] = useState<number>(485);

  const availableCredits = currentUser?.availableCredits || 8320;

  const initialOrders = [
    { id: 'ORD-9821', type: 'SELL', amount: 500, price: 475, seller: 'Uttarakhand Agro Coop', time: '10m ago' },
    { id: 'ORD-9820', type: 'SELL', amount: 1200, price: 480, seller: 'Narmada Eco League', time: '25m ago' },
    { id: 'ORD-9819', type: 'BUY', amount: 2500, price: 470, buyer: 'Vedanta Eco Clean Ltd', time: '35m ago' },
    { id: 'ORD-9818', type: 'BUY', amount: 5000, price: 468, buyer: 'Tata Steel Sustainability', time: '1h ago' },
    { id: 'ORD-9817', type: 'SELL', amount: 350, price: 485, seller: 'Barmer Water Trust', time: '2h ago' }
  ];

  const [orders, setOrders] = useState(initialOrders);

  const handleCreateSellOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellAmount <= 0 || sellAmount > availableCredits) {
      showToast('Invalid credit amount for sell order.', 'error');
      return;
    }

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      type: 'SELL',
      amount: sellAmount,
      price: askPrice,
      seller: currentUser?.name || 'Aarav Sharma',
      time: 'Just now'
    };

    setOrders([newOrder, ...orders]);
    setCreateOrderOpen(false);
    showToast(`Sell order for ${sellAmount} GCP @ ₹${askPrice}/credit listed on exchange!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
            <span>Green Credit Peer-to-Peer Trading Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            P2P Trading Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Trade verified green credits directly with corporate buyers at market-determined clearing prices
          </p>
        </div>

        <button
          onClick={() => setCreateOrderOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Sell Order</span>
        </button>
      </div>

      {/* Market Ticker Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Spot Clearing Price</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-display">₹480.00</span>
            <span className="text-xs font-semibold text-emerald-600">↑2.4%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Weighted avg across Indian states</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">24h Trading Volume</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-display">24,800</span>
            <span className="text-xs font-semibold text-slate-500">GCP</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">₹1.19 Cr total turnover</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Your Available Balance</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-700 font-display tabular-nums">
              {availableCredits.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-slate-500">GCP</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Est. Value: ₹{(availableCredits * 480).toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Settlement Mechanism</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">T+0 Instant</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Direct Bank/UPI escrow</span>
        </div>
      </div>

      {/* Order Book & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Order Book */}
        <div className="bg-white rounded-2xl border border-[#E5EAE7] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Exchange Order Book (Bids & Asks)</h3>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF9] text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3">Counterparty</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Price/GCP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{ord.id}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ord.type === 'SELL' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {ord.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[140px]">
                      {ord.seller || ord.buyer}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {ord.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                      ₹{ord.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade Execution Guarantee */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>MoEFCC Regulatory Clearance</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">Guaranteed Settlement & EPR Recognition</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Under Section 4 of the Green Credit Rules 2023, credits traded on this portal are cryptographically validated against the national land-cadastral database. Corporate buyers immediately receive verified offsets for BRSR disclosures.
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero transaction fees for Indian farmers and self-help groups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated TDS compliance and certificate transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct payout to linked Jan Dhan / Bank account</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Trading Window: 24/7 Continuous</span>
            <span className="font-semibold text-emerald-700">Market Open</span>
          </div>
        </div>
      </div>

      {/* Create Sell Order Modal */}
      {createOrderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSellOrder}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95"
          >
            <h3 className="text-base font-bold text-slate-900">List Credits on P2P Exchange</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Available Balance: <strong>{availableCredits.toLocaleString('en-IN')} GCP</strong>
            </p>

            <div className="my-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity to Sell (GCP)
                </label>
                <input
                  type="number"
                  min={1}
                  max={availableCredits}
                  value={sellAmount}
                  onChange={(e) => setSellAmount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asking Price per Credit (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  value={askPrice}
                  onChange={(e) => setAskPrice(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Current market benchmark: ₹480</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between font-medium">
                <span>Estimated Gross Proceeds:</span>
                <span className="font-bold text-slate-900">₹{(sellAmount * askPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCreateOrderOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow"
              >
                Publish Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
