import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, Home, User, Ticket, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import JsBarcode from 'jsbarcode';
import { useBooking } from '../context/BookingContext';

export default function Receipt() {
  const navigate = useNavigate();
  const { latestReceipt } = useBooking();
  const barcodeRef = useRef(null);

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    // Render Barcode
    if (barcodeRef.current && latestReceipt?.bookingId) {
      try {
        JsBarcode(barcodeRef.current, latestReceipt.bookingId, {
          format: "CODE128",
          lineColor: "#ffffff",
          width: 2,
          height: 55,
          displayValue: true,
          background: "transparent",
          textColor: "#9ca3af",
          fontSize: 14
        });
      } catch (err) {
        console.error('Barcode render error:', err);
      }
    }
  }, [latestReceipt]);

  if (!latestReceipt) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Tidak Ada Bukti Pembayaran</h2>
        <p className="text-sm text-gray-400 mb-6">Belum ada transaksi tiket yang diselesaikan.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Badge Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white">PEMBAYARAN BERHASIL!</h1>
        <p className="text-sm text-gray-300">
          E-Tiket Anda telah terbit dan siap digunakan di bioskop.
        </p>
      </div>

      {/* Ticket Receipt Card (Printable Area) */}
      <div className="bg-[#16213e] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-6 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Ticket className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">OFFICIAL E-TICKET</span>
          </div>
          <h2 className="text-2xl font-black tracking-wide font-['Cinzel',serif]">CINEFLIX</h2>
          <p className="text-xs text-purple-200 mt-1">Book Anytime, Anywhere</p>
        </div>

        {/* Ticket Details */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="text-center pb-6 border-b border-white/10">
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Judul Film</span>
            <h3 className="text-2xl font-black text-white">{latestReceipt.movie}</h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              ✓ {latestReceipt.paymentStatus || 'LUNAS'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pb-6 border-b border-white/10">
            <div>
              <span className="text-xs text-gray-400 block">Kode Booking:</span>
              <span className="font-bold text-white tracking-wider font-mono">{latestReceipt.bookingId}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Metode Bayar:</span>
              <span className="font-bold text-white">{latestReceipt.paymentMethod}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Tanggal Tayang:</span>
              <span className="font-medium text-white">{latestReceipt.date}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Jam Tayang:</span>
              <span className="font-medium text-white">{latestReceipt.time} WIB</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block">Bioskop & Studio:</span>
              <span className="font-medium text-white">{latestReceipt.cinema}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block">Nomor Kursi ({latestReceipt.seats.length} Kursi):</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {latestReceipt.seats.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-[#6a11cb]/30 border border-purple-500/40 text-purple-200 font-bold text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="text-sm font-semibold text-gray-300">Total Pembayaran:</span>
            <span className="text-2xl font-black text-emerald-400">
              Rp {(latestReceipt.grandTotal || latestReceipt.totalPrice).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Barcode SVG Container */}
          <div className="pt-2 flex flex-col items-center justify-center">
            <svg ref={barcodeRef} className="max-w-full" />
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Tunjukkan barcode ini kepada petugas bioskop atau scan di gerbang tiket studio.
            </p>
          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan Tiket</span>
        </button>

        <Link
          to="/profile"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm shadow-md transition-opacity hover:opacity-90"
        >
          <User className="w-4 h-4" />
          <span>Lihat di Profil Saya</span>
        </Link>
      </div>

      <div className="text-center">
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
          ← Kembali ke Halaman Utama
        </Link>
      </div>

    </div>
  );
}
