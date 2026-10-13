import React, { useState, useEffect } from 'react';
import { X, Users, Share2, Copy, CheckCircle2, Clock, Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function SplitBillModal({ isOpen, onClose, totalAmount, seatsCount, movieTitle, cinemaName, onCompleteSplitBill }) {
  const { showToast } = useToast();
  const [splitCount, setSplitCount] = useState(Math.max(2, seatsCount || 2));
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (!isOpen) return;

    const count = Math.max(2, seatsCount || 2);
    setSplitCount(count);
    const perPerson = Math.round(totalAmount / count);

    const initial = [
      { id: 1, name: "Anda (Pembuat Patungan)", amount: perPerson, status: "paid" }
    ];

    for (let i = 2; i <= count; i++) {
      initial.push({
        id: i,
        name: `Teman ${i - 1}`,
        amount: perPerson,
        status: "pending"
      });
    }

    setMembers(initial);
    setTimeLeft(600);
  }, [isOpen, totalAmount, seatsCount]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const perPersonAmount = Math.round(totalAmount / splitCount);

  const handleUpdateSplitCount = (newCount) => {
    const validCount = Math.max(2, Math.min(8, newCount));
    setSplitCount(validCount);
    const perPerson = Math.round(totalAmount / validCount);

    const updated = [
      { id: 1, name: "Anda (Pembuat Patungan)", amount: perPerson, status: "paid" }
    ];

    for (let i = 2; i <= validCount; i++) {
      updated.push({
        id: i,
        name: `Teman ${i - 1}`,
        amount: perPerson,
        status: "pending"
      });
    }
    setMembers(updated);
  };

  const toggleFriendPaid = (memberId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === 'paid' ? 'pending' : 'paid';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
    showToast('Status pembayaran teman berhasil diperbarui!', 'success');
  };

  const allPaid = members.every(m => m.status === 'paid');
  const paidCount = members.filter(m => m.status === 'paid').length;

  const handleCopyInvite = () => {
    const text = `🍿 *Undangan Patungan Nonton CineFlix!* 🍿\nFilm: *${movieTitle}*\nBioskop: ${cinemaName}\nTotal Patungan: Rp ${totalAmount.toLocaleString('id-ID')}\nBagianmu: *Rp ${perPersonAmount.toLocaleString('id-ID')}*\n\nBuka link untuk konfirmasi patungan tiket: ${window.location.origin}${window.location.pathname}#/booking`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Pesan undangan WhatsApp berhasil disalin!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#141424] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Pesan Bareng & Split Bill
          </h3>
          <p className="text-xs text-teal-100 mt-1">
            Bagi tagihan tiket film secara adil dan otomatis dengan teman
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Summary & Countdown */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="text-xs text-gray-400 block">Total Tagihan Tiket:</span>
              <span className="text-xl font-black text-emerald-400">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Waktu Tersisa:
              </span>
              <span className="font-mono text-base font-bold text-amber-300">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Split Count Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Bagi Tagihan untuk Berapa Orang?
            </label>
            <div className="flex items-center gap-2">
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleUpdateSplitCount(num)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    splitCount === num
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  {num} Orang
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-teal-300 font-semibold mt-2">
              👉 Masing-masing membayar: <strong>Rp {perPersonAmount.toLocaleString('id-ID')}</strong>
            </p>
          </div>

          {/* Members Status List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Status Pembayaran Teman ({paidCount}/{splitCount}):</span>
              <span>Klik untuk simulasi lunas</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${m.status === 'paid' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                    <span className="font-bold text-white">{m.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-300">
                      Rp {m.amount.toLocaleString('id-ID')}
                    </span>

                    {m.id === 1 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        ✓ Lunas
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleFriendPaid(m.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border transition-all cursor-pointer ${
                          m.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                      >
                        {m.status === 'paid' ? '✓ Lunas' : '⏳ Menunggu (Klik Lunas)'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleCopyInvite}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Tautan Patungan Tersalin!' : 'Salin & Bagikan Tautan WhatsApp ke Teman'}</span>
          </button>

          {/* Complete Booking CTA */}
          <button
            type="button"
            disabled={!allPaid}
            onClick={() => {
              if (onCompleteSplitBill) onCompleteSplitBill();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{allPaid ? 'Semua Teman Lunas! Selesaikan Booking' : `Menunggu ${splitCount - paidCount} Teman Membayar...`}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
