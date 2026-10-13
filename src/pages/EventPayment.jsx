import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Ticket, CheckCircle2, ArrowLeft, Printer, Calendar, MapPin, Loader2, QrCode, Smartphone, Scan } from 'lucide-react';
import confetti from 'canvas-confetti';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveTicket, getVerificationUrl } from '../utils/ticketRegistry';
import TicketScannerModal from '../components/common/TicketScannerModal';

export default function EventPayment() {
  const navigate = useNavigate();
  const { eventOrder } = useBooking();
  const { user, addTicketToHistory } = useAuth();
  const { showToast } = useToast();

  const barcodeRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activeBarcodeType, setActiveBarcodeType] = useState('qr');
  const [paymentMethod, setPaymentMethod] = useState('GoPay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedEventTicket, setCompletedEventTicket] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (!completedEventTicket) return;

    // Generate QR Code
    const verifyUrl = getVerificationUrl(completedEventTicket.bookingId);
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
  }, [completedEventTicket]);

  useEffect(() => {
    if (barcodeRef.current && completedEventTicket?.bookingId) {
      try {
        JsBarcode(barcodeRef.current, completedEventTicket.bookingId, {
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
  }, [completedEventTicket, activeBarcodeType]);

  if (!eventOrder || !eventOrder.items || eventOrder.items.length === 0) {
    if (completedEventTicket) {
      // User has already paid and viewing receipt
    } else {
      return (
        <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xl">
          <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Data Pesanan Event Kosong</h2>
          <p className="text-sm text-gray-400 mb-6">Silakan pilih tiket pass festival terlebih dahulu.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm hover:scale-105 transition-transform"
          >
            Lihat Daftar Event
          </button>
        </div>
      );
    }
  }

  const paymentMethodsList = [
    { id: 'GoPay', name: 'GoPay E-Wallet', desc: 'Bayar instan via aplikasi Gojek' },
    { id: 'ShopeePay', name: 'ShopeePay', desc: 'Cashback koin dan diskon tiket event' },
    { id: 'DANA', name: 'DANA Wallet', desc: 'Bayar cepat dengan saldo DANA' },
    { id: 'QRIS', name: 'QRIS Semua Bank / E-Wallet', desc: 'Scan barcode QRIS BCA, Mandiri, BRI, dll' },
    { id: 'CreditCard', name: 'Kartu Kredit / Debit', desc: 'Visa & Mastercard berlogo 3D Secure' }
  ];

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const passesSummary = eventOrder.items.map(i => `${i.name} (x${i.quantity})`);
      const eventTicketRecord = {
        bookingId: eventOrder.orderId,
        orderType: 'event',
        movie: eventOrder.eventName,
        poster: eventOrder.eventImage || 'assets/event1.jpg',
        cinema: eventOrder.eventLocation,
        studio: 'Main Festival Stage & Hall Cinema',
        date: eventOrder.eventDate,
        time: eventOrder.eventTime,
        seats: passesSummary,
        totalPrice: eventOrder.total,
        grandTotal: eventOrder.total,
        paymentMethod,
        status: 'LUNAS & VALID (AKSES EVENT DIIZINKAN)',
        buyerName: user ? user.name : 'Peserta Flix Event',
        buyerEmail: user ? user.email : '',
        paymentDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
        ticketCount: eventOrder.items.reduce((s, it) => s + it.quantity, 0),
        serviceFee: eventOrder.serviceFee || 0,
        gate: 'Gate VIP 1 • Pintu Masuk Khusus Event'
      };

      // 1. Save to ticketRegistry
      saveTicket(eventTicketRecord);

      // 2. Save to user profile ticket history
      if (user) {
        addTicketToHistory(eventTicketRecord);
      }

      setCompletedEventTicket(eventTicketRecord);
      setIsProcessing(false);
      showToast('Pembayaran Event Pass berhasil! Tiket diterbitkan.', 'success');

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  // SUCCESS SCREEN
  if (completedEventTicket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">PEMBAYARAN EVENT BERHASIL!</h1>
          <p className="text-sm text-gray-300">
            Pass resmi Flix Events Anda telah aktif. Tunjukkan QR Code ini di pintu masuk festival.
          </p>
        </div>

        {/* Event Pass Boarding Pass Card */}
        <div className="bg-[#141424] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative">
          
          <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-700 p-6 text-white text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest text-purple-200">
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>OFFICIAL EVENT PASS & BOARDING TICKET</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel',serif]">CINEFLIX EVENTS</h2>
            <p className="text-xs text-purple-100 mt-1">Akses Masuk Resmi Festival Film & Pameran</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="text-center pb-6 border-b border-white/10">
              <span className="text-xs text-purple-400 uppercase tracking-widest block mb-1">Nama Acara / Festival</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{completedEventTicket.movie}</h3>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS & AKTIF ({completedEventTicket.paymentMethod})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pb-6 border-b border-white/10">
              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Kode Tiket Pass:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{completedEventTicket.bookingId}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Waktu Transaksi:</span>
                <span className="font-semibold text-white">{completedEventTicket.paymentDate}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Jadwal Event:</span>
                <span className="font-semibold text-white">{completedEventTicket.date}</span>
                <span className="text-[11px] text-gray-400 block">{completedEventTicket.time}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Lokasi / Venue:</span>
                <span className="font-bold text-white text-xs sm:text-sm">{completedEventTicket.cinema}</span>
              </div>

              <div className="col-span-2 pt-2">
                <span className="text-xs text-gray-400 block mb-2 font-semibold">Kategori Pass yang Dibeli:</span>
                <div className="space-y-1.5">
                  {completedEventTicket.seats.map((passName, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="font-bold text-white">{passName}</span>
                      <span className="text-purple-300 font-bold">Akses Penuh</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-sm font-semibold text-gray-300">Total Biaya Tiket:</span>
              <span className="text-2xl font-black text-emerald-400">
                Rp {completedEventTicket.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Scannable Barcode & QR Code Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center space-y-4">
              
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
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>QR Code (Scan HP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBarcodeType('barcode')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      activeBarcodeType === 'barcode'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Barcode Garis 1D</span>
                  </button>
                </div>
              </div>

              {/* Codes Display */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                {activeBarcodeType === 'qr' && qrCodeUrl && (
                  <div className="flex flex-col items-center animate-fadeIn">
                    <div className="p-3 bg-white rounded-2xl shadow-2xl ring-4 ring-purple-500/30">
                      <img
                        src={qrCodeUrl}
                        alt={`QR Code ${completedEventTicket.bookingId}`}
                        className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 mt-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      KODE: {completedEventTicket.bookingId}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Siap di-scan di gate event
                    </span>
                  </div>
                )}

                {activeBarcodeType === 'barcode' && (
                  <div className="flex flex-col items-center overflow-hidden max-w-full animate-fadeIn py-2">
                    <svg ref={barcodeRef} className="max-w-full h-auto" />
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">
                      Format: CODE128 (Untuk Scanner Petugas Pintu Masuk)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                Scan QR Code ini menggunakan kamera smartphone Anda atau tunjukkan kepada petugas di pintu gerbang festival bioskop.
              </p>
            </div>

          </div>

          <div className="bg-black/50 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-mono">PASS-ID: {completedEventTicket.bookingId}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Akses Resmi Terverifikasi
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <button
            onClick={() => navigate(`/verify/${encodeURIComponent(completedEventTicket.bookingId)}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Uji Coba Scan Tiket Event</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tiket Pass</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <Link
            to="/profile"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm shadow-md transition-opacity hover:opacity-90"
          >
            <span>Lihat di Profil Saya</span>
          </Link>
          <Link
            to="/events"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors text-center"
          >
            <span>Jelajahi Event Lain</span>
          </Link>
        </div>

      </div>
    );
  }

  // CHECKOUT SCREEN
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Flix Events
      </Link>

      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight">
          PEMBAYARAN TIKET EVENT
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Selesaikan transaksi untuk mendapatkan E-Pass resmi dengan QR Code masuk acara
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-bold text-base text-white">{eventOrder.eventName}</h3>
            <p className="text-xs text-purple-300 mt-0.5">{eventOrder.eventDate} • {eventOrder.eventLocation}</p>
          </div>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-bold">
            {eventOrder.items.length} Kategori Pass
          </span>
        </div>

        <div className="space-y-2.5">
          {eventOrder.items.map((it, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs sm:text-sm text-gray-300 bg-white/[0.02] p-2.5 rounded-xl">
              <div>
                <span className="font-bold text-white">{it.name}</span>
                <span className="text-gray-400 text-xs ml-2">x{it.quantity}</span>
              </div>
              <span className="font-black text-emerald-400">
                Rp {it.total.toLocaleString('id-ID')}
              </span>
            </div>
          ))}

          <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
            <span>Biaya Layanan & Pajak Tiket (5%):</span>
            <span>Rp {(eventOrder.serviceFee || 0).toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-white/10">
            <span>Total Pembayaran:</span>
            <span className="text-emerald-400 text-2xl font-black">
              Rp {eventOrder.total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-xl">
        <h3 className="font-bold text-base text-white">Pilih Metode Pembayaran</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethodsList.map((m) => (
            <label
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === m.id
                  ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-500/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={paymentMethod === m.id}
                onChange={() => setPaymentMethod(m.id)}
                className="w-4 h-4 text-purple-600"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-white block">{m.name}</span>
                <span className="text-[11px] text-gray-400 block truncate">{m.desc}</span>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-black text-sm shadow-xl shadow-purple-500/30 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses Transaksi Event Pass...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Bayar Tiket Sekarang (Rp {eventOrder.total.toLocaleString('id-ID')})</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
