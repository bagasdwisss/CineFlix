import React, { useEffect, useRef, useState } from 'react';
import { X, Printer, ShieldCheck, Ticket, QrCode, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { getVerificationUrl } from '../../utils/ticketRegistry';

export default function ETicketModal({ ticket, onClose, onTestScan }) {
  const navigate = useNavigate();
  const barcodeRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activeCodeTab, setActiveCodeTab] = useState('both'); // 'both' | 'barcode' | 'qr'

  useEffect(() => {
    if (!ticket) return;

    // Render 1D Barcode with JsBarcode
    if (barcodeRef.current && ticket.bookingId) {
      try {
        JsBarcode(barcodeRef.current, ticket.bookingId, {
          format: 'CODE128',
          lineColor: '#ffffff',
          width: 2,
          height: 52,
          displayValue: true,
          background: 'transparent',
          textColor: '#9ca3af',
          fontSize: 13,
          margin: 4
        });
      } catch (err) {
        console.error('Barcode error:', err);
      }
    }

    // Generate 2D QR Code with actual verification URL
    const verifyUrl = getVerificationUrl(ticket.bookingId);
    QRCode.toDataURL(verifyUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#00000000'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR Code error:', err));
  }, [ticket]);

  if (!ticket) return null;

  const seatsArray = Array.isArray(ticket.seats) ? ticket.seats : [ticket.seats || 'A1'];
  const grandTotal = ticket.grandTotal || ticket.totalPrice || 0;
  const verifyUrl = getVerificationUrl(ticket.bookingId);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenVerify = () => {
    onClose();
    navigate(`/verify/${encodeURIComponent(ticket.bookingId)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#141424] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-white">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Boarding Pass Header */}
        <div className="bg-gradient-to-r from-[#6a11cb] via-[#3b82f6] to-[#2575fc] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-widest text-purple-200">
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>OFFICIAL BOARDING PASS E-TICKET</span>
          </div>
          <h2 className="text-3xl font-black font-['Cinzel',serif] tracking-wider">CINEFLIX</h2>
          <p className="text-xs text-purple-100 mt-1">Sistem Tiket Digital Resmi Bioskop</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Movie Info with Thumbnail */}
          <div className="flex gap-4 items-center pb-5 border-b border-white/10">
            {ticket.poster && (
              <img
                src={ticket.poster}
                alt={ticket.movie}
                className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl object-cover border border-white/20 shadow-lg shrink-0"
                onError={(e) => {
                  e.target.src = 'assets/avatar.jpg';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                Film Bioskop
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5 truncate">
                {ticket.movie}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {ticket.cinema}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {ticket.status || 'LUNAS & VALID'}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Studio 1
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm pb-5 border-b border-white/10">
            <div>
              <span className="text-gray-400 text-xs block mb-0.5">Kode Booking:</span>
              <span className="font-mono font-bold text-amber-300 text-sm tracking-wide bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                {ticket.bookingId}
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-xs block mb-0.5">Nama Pemesan:</span>
              <span className="font-bold text-white truncate block">
                {ticket.buyerName || 'John Doe'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-xs block mb-0.5">Jadwal Tayang:</span>
              <span className="font-semibold text-white">
                {ticket.date} • {ticket.time} WIB
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-xs block mb-0.5">Metode Bayar:</span>
              <span className="font-semibold text-white">
                {ticket.paymentMethod || 'GoPay / E-Wallet'}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-gray-400 text-xs block mb-1">
                Kursi Dipesan ({seatsArray.length} Kursi):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {seatsArray.map((seat) => (
                  <span
                    key={seat}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 font-bold text-xs"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2 pt-1 flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Transaksi:</span>
              <span className="text-xl font-black text-emerald-400">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Scannable Barcode & QR Code Section */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 text-center space-y-4">
            
            {/* Tab switch between QR and Barcode */}
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCodeTab('both')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCodeTab === 'both' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Semua Barcode
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab('qr')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCodeTab === 'qr' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                QR Code (Scan HP)
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab('barcode')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCodeTab === 'barcode' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Barcode 1D
              </button>
            </div>

            {/* Codes Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              {(activeCodeTab === 'both' || activeCodeTab === 'qr') && qrCodeUrl && (
                <div className="flex flex-col items-center">
                  <div className="p-2.5 bg-white rounded-2xl shadow-xl ring-4 ring-purple-500/20">
                    <img
                      src={qrCodeUrl}
                      alt={`QR Code ${ticket.bookingId}`}
                      className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 font-mono flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-purple-400" /> Scan via Kamera HP
                  </span>
                </div>
              )}

              {(activeCodeTab === 'both' || activeCodeTab === 'barcode') && (
                <div className="flex flex-col items-center overflow-hidden max-w-full">
                  <svg ref={barcodeRef} className="max-w-full h-auto" />
                  <span className="text-[10px] text-gray-400 mt-1 font-mono">
                    Format: CODE128 Bioskop
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
              Scan QR Code menggunakan kamera smartphone Anda atau klik tombol uji coba scan di bawah untuk memverifikasi keaslian tiket secara langsung!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleOpenVerify}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi / Scan Tiket</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan E-Tiket</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
