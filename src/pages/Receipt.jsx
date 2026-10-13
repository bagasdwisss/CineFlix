import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, Home, User, Ticket, QrCode, ShieldCheck, Sparkles, Camera, Smartphone, Scan, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { saveTicket, getVerificationUrl } from '../utils/ticketRegistry';
import { downloadTicketImage } from '../utils/ticketExporter';
import { playSuccess } from '../utils/soundEffects';
import TicketScannerModal from '../components/common/TicketScannerModal';

export default function Receipt() {
  const navigate = useNavigate();
  const { latestReceipt } = useBooking();
  const { t, lang } = useLanguage();
  const barcodeRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activeBarcodeType, setActiveBarcodeType] = useState('qr'); // 'qr' | 'barcode' | 'both'
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    // Fire confetti celebration and audio!
    try {
      playSuccess();
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    if (!latestReceipt) return;

    // 1. Ensure ticket is saved to global verified registry
    saveTicket(latestReceipt);

    // 2. Generate Real 2D QR Code with dark black modules on crisp white background for phone scanning!
    const verifyUrl = getVerificationUrl(latestReceipt);
    QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [latestReceipt]);

  // Render 1D Barcode with JsBarcode whenever barcodeRef is present
  useEffect(() => {
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
          fontSize: 14,
          margin: 4
        });
      } catch (err) {
        console.error('Barcode render error:', err);
      }
    }
  }, [latestReceipt, activeBarcodeType]);

  if (!latestReceipt) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2">Tidak Ada Bukti Pembayaran</h2>
        <p className="text-sm text-gray-400 mb-6">Belum ada transaksi tiket yang diselesaikan.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm hover:scale-[1.02] transition-transform"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const seatsArray = Array.isArray(latestReceipt.seats) ? latestReceipt.seats : [latestReceipt.seats];

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      
      {/* Success Badge Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">{t('paymentSuccess', 'PEMBAYARAN BERHASIL!')}</h1>
        <p className="text-sm text-gray-300">
          {t('ticketIssued', 'E-Tiket resmi Anda telah terbit dan siap digunakan di bioskop.')}
        </p>
      </div>

      {/* Ticket Receipt Card (Printable Area) */}
      <div className="bg-[#141424] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-[#6a11cb] via-[#3b82f6] to-[#2575fc] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-widest text-purple-200">
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>OFFICIAL E-TICKET BOARDING PASS</span>
          </div>
          <h2 className="text-2xl font-black tracking-wide font-['Cinzel',serif]">CINEFLIX</h2>
          <p className="text-xs text-purple-100 mt-1">Book Anytime, Anywhere</p>
        </div>

        {/* Ticket Details */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="text-center pb-6 border-b border-white/10">
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider block mb-1">Judul Film</span>
            <h3 className="text-2xl font-black text-white">{latestReceipt.movie}</h3>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> {latestReceipt.paymentStatus || 'LUNAS & VALID'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pb-6 border-b border-white/10">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Kode Booking:</span>
              <span className="font-mono font-bold text-amber-300 tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block text-xs sm:text-sm">
                {latestReceipt.bookingId}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Metode Bayar:</span>
              <span className="font-semibold text-white">{latestReceipt.paymentMethod}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Tanggal Tayang:</span>
              <span className="font-medium text-white">{latestReceipt.date}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Jam Tayang:</span>
              <span className="font-medium text-white">{latestReceipt.time} WIB</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block mb-0.5">Bioskop & Studio:</span>
              <span className="font-medium text-white">{latestReceipt.cinema}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block mb-1">
                Nomor Kursi ({seatsArray.length} Kursi):
              </span>
              <div className="flex flex-wrap gap-2">
                {seatsArray.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 font-bold text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {latestReceipt.deliverToSeat && (
              <div className="col-span-2 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200">
                <span className="font-bold">🍿 Layanan Deliver to Seat Aktif: </span>
                <span>Diantar langsung ke Kursi {latestReceipt.deliverToSeat.seat}</span>
                {latestReceipt.deliverToSeat.note && (
                  <span className="block text-gray-400 text-[11px] mt-0.5 italic">"{latestReceipt.deliverToSeat.note}"</span>
                )}
              </div>
            )}
            {latestReceipt.combo && (
              <div className="col-span-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold">🍿 Paket FnB Combo Hemat 20%: </span>
                <span>{latestReceipt.combo.popcorn.name} + {latestReceipt.combo.drink.name}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="text-sm font-semibold text-gray-300">Total Pembayaran:</span>
            <span className="text-2xl font-black text-emerald-400">
              Rp {(latestReceipt.grandTotal || latestReceipt.totalPrice).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Barcode & Scannable QR Code Section */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center space-y-4">
            
            {/* Clear Explanation & Type Switcher */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300">
                <Scan className="w-4 h-4 text-purple-400" />
                <span>Pilih Tampilan Barcode Tiket:</span>
              </div>

              <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveBarcodeType('qr')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activeBarcodeType === 'qr'
                      ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>QR Code (Scan Kamera HP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBarcodeType('barcode')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activeBarcodeType === 'barcode'
                      ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Barcode Garis (Scanner Bioskop)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBarcodeType('both')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeBarcodeType === 'both'
                      ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Semua
                </button>
              </div>
            </div>

            {/* Display Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              
              {/* 1. Primary 2D QR Code (Scan with Smartphone Camera) */}
              {(activeBarcodeType === 'qr' || activeBarcodeType === 'both') && qrCodeUrl && (
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="p-3 bg-white rounded-2xl shadow-2xl ring-4 ring-purple-500/30">
                    <img
                      src={qrCodeUrl}
                      alt={`QR Code ${latestReceipt.bookingId}`}
                      className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 mt-2.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    KODE: {latestReceipt.bookingId}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Siap di-scan oleh kamera HP
                  </span>
                </div>
              )}

              {/* 2. Conventional 1D Barcode (For Cinema Laser Gate Reader) */}
              {(activeBarcodeType === 'barcode' || activeBarcodeType === 'both') && (
                <div className="flex flex-col items-center overflow-hidden max-w-full animate-fadeIn py-2">
                  <svg ref={barcodeRef} className="max-w-full h-auto" />
                  <span className="text-[10px] text-gray-400 mt-1 font-mono">
                    Format: CODE128 Bioskop (Untuk Scanner Laser Petugas)
                  </span>
                </div>
              )}
            </div>

            {/* Clear Explanation Note for the User */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed max-w-md mx-auto text-left sm:text-center">
              {activeBarcodeType === 'qr' ? (
                <span>
                  💡 <strong>Barcode untuk di-scan HP adalah QR Code (kotak di atas)</strong>. Buka aplikasi kamera smartphone Anda (iPhone / Android) dan arahkan ke QR Code untuk memverifikasi tiket secara otomatis!
                </span>
              ) : activeBarcodeType === 'barcode' ? (
                <span>
                  💡 <strong>Barcode Garis 1D</strong> ini ditujukan untuk pemindai optik / scanner laser petugas bioskop di pintu masuk studio bioskop.
                </span>
              ) : (
                <span>
                  💡 <strong>QR Code (kiri/atas)</strong> untuk kamera smartphone Anda, sedangkan <strong>Barcode Garis (kanan/bawah)</strong> untuk scanner laser petugas bioskop.
                </span>
              )}
            </div>

          </div>

        </div>

        {/* Security watermark footer */}
        <div className="bg-black/50 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-mono">SEC-CODE: {latestReceipt.bookingId}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Sistem Bioskop
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <button
          onClick={() => navigate(`/verify/${encodeURIComponent(latestReceipt.bookingId)}`)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('testScanTicket', 'Uji Coba Scan Tiket Ini')}</span>
        </button>

        <button
          onClick={() => downloadTicketImage(latestReceipt)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t('downloadTicket', 'Download Gambar Tiket (HD)')}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-sm transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>{lang === 'en' ? 'Open Ticket Scanner' : 'Buka Scanner Bioskop'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t('printTicket', 'Cetak Tiket')}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <Link
          to="/profile"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm shadow-md transition-opacity hover:opacity-90"
        >
          <User className="w-4 h-4" />
          <span>{t('viewInProfile', 'Lihat di Profil Saya')}</span>
        </Link>
      </div>

      <div className="text-center no-print">
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
          ← {t('backToHome', 'Kembali ke Beranda')}
        </Link>
      </div>

      {/* Interactive Scanner Modal */}
      <TicketScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

    </div>
  );
}
