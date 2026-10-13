import React, { useState } from 'react';
import { X, QrCode, Search, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, getTicketByBookingId } from '../../utils/ticketRegistry';

export default function TicketScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const tickets = getAllTickets();

  const handleScanCode = (code) => {
    setError('');
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const clean = String(code).trim().toUpperCase();
      const found = getTicketByBookingId(clean);

      if (found) {
        onClose();
        navigate(`/verify/${encodeURIComponent(clean)}`);
      } else {
        setError(`Kode booking "${clean}" tidak ditemukan dalam sistem database tiket.`);
      }
    }, 1100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleScanCode(inputCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#16213e] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scanner Terminal Header */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-black">Scanner Tiket Bioskop</h3>
          <p className="text-xs text-purple-200 mt-1">
            Simulasi Pemindai Barcode & QR Code Tiket Resmi CineFlix
          </p>
        </div>

        {/* Viewfinder Camera Graphic */}
        <div className="p-6 space-y-6">
          <div className="relative w-full h-44 bg-black/60 rounded-2xl border-2 border-purple-500/40 overflow-hidden flex flex-col items-center justify-center shadow-inner">
            
            {/* Viewfinder Corners */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-400" />

            {/* Laser Scanning Line Animation */}
            {isScanning ? (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-bounce" />
            ) : (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            )}

            <QrCode className={`w-14 h-14 ${isScanning ? 'text-red-400 animate-pulse' : 'text-gray-500'}`} />
            
            <p className="text-[11px] font-mono text-cyan-300 mt-2 font-semibold">
              {isScanning ? 'MEMINDAI DATA TIKET...' : 'ARAHKAN BARCODE KE AREA INI'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input for Manual or Barcode Scanner Gun */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-xs font-semibold text-gray-300 block">
              Masukkan atau Tempel Kode Booking Tiket:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Contoh: FLIX-98214532"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:border-purple-400 uppercase"
              />
              <button
                type="submit"
                disabled={isScanning || !inputCode.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors"
                title="Pindai Kode"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Click Demo Tickets */}
          {tickets.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Uji Coba Cepat Tiket Tersedia:
              </span>
              <div className="flex flex-wrap gap-2">
                {tickets.slice(0, 3).map((t) => (
                  <button
                    key={t.bookingId}
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleScanCode(t.bookingId)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1.5 transition-all"
                  >
                    <span>{t.bookingId}</span>
                    <span className="text-[9px] text-gray-400">({t.movie.split(':')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
