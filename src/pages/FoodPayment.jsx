import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, ArrowLeft, Printer, Loader2, Sparkles, QrCode, Ticket, Smartphone, Scan } from 'lucide-react';
import confetti from 'canvas-confetti';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveTicket, getVerificationUrl } from '../utils/ticketRegistry';
import TicketScannerModal from '../components/common/TicketScannerModal';

export default function FoodPayment() {
  const navigate = useNavigate();
  const { foodCart, foodSubtotal, clearFoodCart } = useBooking();
  const { user, addTicketToHistory } = useAuth();
  const { showToast } = useToast();

  const barcodeRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activeBarcodeType, setActiveBarcodeType] = useState('qr');
  const [paymentMethod, setPaymentMethod] = useState('GoPay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const pickupCinema = localStorage.getItem('cineflix_food_pickup_cinema') || 'CINEFLIX GRAND INDONESIA';
  const pickupNotes = localStorage.getItem('cineflix_food_pickup_notes') || '';

  // Generate QR Code & Barcode upon completion
  useEffect(() => {
    if (!completedOrder) return;

    // 1. Generate QR Code
    const verifyUrl = getVerificationUrl(completedOrder.orderId);
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
  }, [completedOrder]);

  useEffect(() => {
    if (barcodeRef.current && completedOrder?.orderId) {
      try {
        JsBarcode(barcodeRef.current, completedOrder.orderId, {
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
  }, [completedOrder, activeBarcodeType]);

  if ((!foodCart || foodCart.length === 0) && !completedOrder) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xl">
        <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Keranjang Makanan Kosong</h2>
        <p className="text-sm text-gray-400 mb-6">Silakan pilih camilan atau minuman bioskop terlebih dahulu.</p>
        <button
          onClick={() => navigate('/foods')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm hover:scale-105 transition-transform"
        >
          Lihat Menu Makanan
        </button>
      </div>
    );
  }

  const paymentMethodsList = [
    { id: 'GoPay', name: 'GoPay E-Wallet', desc: 'Bayar instan via aplikasi Gojek' },
    { id: 'ShopeePay', name: 'ShopeePay', desc: 'Cashback koin dan diskon FnB' },
    { id: 'DANA', name: 'DANA Wallet', desc: 'Bayar cepat dengan saldo DANA' },
    { id: 'QRIS', name: 'QRIS Semua Bank / E-Wallet', desc: 'Scan barcode QRIS BCA, Mandiri, BRI, dll' },
    { id: 'CreditCard', name: 'Kartu Kredit / Debit', desc: 'Visa & Mastercard berlogo 3D Secure' }
  ];

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = 'FOOD-' + Math.floor(10000000 + Math.random() * 90000000);
      const itemsList = [...foodCart];
      const itemsSummary = itemsList.map(it => `${it.name} (x${it.quantity})`);

      const orderRecord = {
        bookingId: orderId,
        orderId,
        orderType: 'food',
        movie: 'Paket Flix Concession FnB',
        poster: itemsList[0]?.image || 'assets/food1.png',
        cinema: pickupCinema,
        studio: 'Concession Counter Lantai Bioskop',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: 'Siap Diambil di Konter',
        seats: itemsSummary,
        totalPrice: foodSubtotal,
        grandTotal: foodSubtotal,
        paymentMethod,
        status: 'LUNAS & SIAP DIAMBIL',
        buyerName: user ? user.name : 'Pelanggan CineFlix',
        buyerEmail: user ? user.email : '',
        paymentDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
        items: itemsList,
        notes: pickupNotes,
        gate: 'Konter FnB 1 • Jalur Ambil Online'
      };

      // 1. Save to verified registry
      saveTicket(orderRecord);

      // 2. Save to user profile ticket history
      if (user) {
        addTicketToHistory(orderRecord);
      }

      setCompletedOrder(orderRecord);
      clearFoodCart();
      setIsProcessing(false);
      showToast('Pesanan makanan berhasil dikonfirmasi! E-Voucher diterbitkan.', 'success');

      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">PEMBAYARAN MAKANAN BERHASIL!</h1>
          <p className="text-sm text-gray-300">
            Pesanan makanan Anda telah lunas dan siap diambil di konter bioskop.
          </p>
        </div>

        {/* Food Voucher Boarding Pass Card */}
        <div className="bg-[#141424] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative">
          
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-purple-700 p-6 text-white text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest text-amber-200">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>OFFICIAL CONCESSION PICKUP VOUCHER</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel',serif]">CINEFLIX FOODS</h2>
            <p className="text-xs text-amber-100 mt-1">Tunjukkan Barcode ke Petugas Konter</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="text-center pb-6 border-b border-white/10">
              <span className="text-xs text-amber-400 uppercase tracking-widest block mb-1">Status Pengambilan</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">SIAP DIAMBIL DI KONTER FnB</h3>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> LUNAS ({completedOrder.paymentMethod})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pb-6 border-b border-white/10">
              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Nomor Pesanan:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{completedOrder.orderId}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs block mb-0.5">Waktu Pemesanan:</span>
                <span className="font-semibold text-white">{completedOrder.paymentDate}</span>
              </div>

              <div className="col-span-2">
                <span className="text-gray-400 text-xs block mb-0.5">Lokasi Pengambilan Bioskop:</span>
                <span className="font-bold text-white text-sm">{completedOrder.cinema}</span>
                <span className="text-[11px] text-purple-300 block">Jalur Cepat Ambil Online (Online Express Line)</span>
              </div>

              {completedOrder.notes && (
                <div className="col-span-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-semibold">Catatan Khusus:</span>
                  <span className="text-xs text-amber-300 italic">"{completedOrder.notes}"</span>
                </div>
              )}

              <div className="col-span-2 pt-2">
                <span className="text-xs text-gray-400 block mb-2 font-semibold">Rincian Item Makanan:</span>
                <div className="space-y-1.5">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-2.5 rounded-xl">
                      <span className="font-bold text-white">{it.name} <strong className="text-amber-400">x{it.quantity}</strong></span>
                      <span className="text-emerald-400 font-bold">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-sm font-semibold text-gray-300">Total Pembayaran:</span>
              <span className="text-2xl font-black text-emerald-400">
                Rp {completedOrder.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Scannable Barcode & QR Code Section */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center space-y-4">
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300">
                  <Scan className="w-4 h-4 text-amber-400" />
                  <span>Pilih Tampilan Barcode Pengambilan:</span>
                </div>

                <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveBarcodeType('qr')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      activeBarcodeType === 'qr'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
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
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
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
                    <div className="p-3 bg-white rounded-2xl shadow-2xl ring-4 ring-amber-500/30">
                      <img
                        src={qrCodeUrl}
                        alt={`QR Code ${completedOrder.orderId}`}
                        className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 mt-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      KODE: {completedOrder.orderId}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Siap di-scan kasir / kamera HP
                    </span>
                  </div>
                )}

                {activeBarcodeType === 'barcode' && (
                  <div className="flex flex-col items-center overflow-hidden max-w-full animate-fadeIn py-2">
                    <svg ref={barcodeRef} className="max-w-full h-auto" />
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">
                      Format: CODE128 (Untuk Scanner Kasir FnB)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                Tunjukkan QR Code ini kepada kasir konter makanan bioskop untuk mengambil pesanan Anda secara langsung.
              </p>
            </div>

          </div>

          <div className="bg-black/50 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-mono">PICKUP-ID: {completedOrder.orderId}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Sistem FnB Resmi CineFlix
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <button
            onClick={() => navigate(`/verify/${encodeURIComponent(completedOrder.orderId)}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Uji Coba Scan Bukti Pengambilan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Pengambilan</span>
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
            to="/foods"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors text-center"
          >
            <span>Pesan Menu Lain</span>
          </Link>
        </div>

      </div>
    );
  }

  // CHECKOUT SCREEN
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <Link
        to="/foods"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Menu Makanan
      </Link>

      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight">
          PEMBAYARAN MAKANAN & MINUMAN
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Selesaikan pembayaran untuk mendapatkan kode antrean dan QR Code pengambilan makanan
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-bold text-base text-white">Ringkasan Pesanan FnB</h3>
            <p className="text-xs text-purple-300 mt-0.5">Lokasi Pengambilan: <strong>{pickupCinema}</strong></p>
          </div>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-bold">
            {foodCart.length} Menu Dipilih
          </span>
        </div>

        <div className="space-y-2.5">
          {foodCart.map((it) => (
            <div key={it.id} className="flex justify-between items-center text-xs sm:text-sm text-gray-300 bg-white/[0.02] p-2.5 rounded-xl">
              <div>
                <span className="font-bold text-white">{it.name}</span>
                <span className="text-gray-400 text-xs ml-2">x{it.quantity}</span>
              </div>
              <span className="font-black text-emerald-400">
                Rp {(it.price * it.quantity).toLocaleString('id-ID')}
              </span>
            </div>
          ))}

          {pickupNotes && (
            <div className="text-xs text-gray-400 italic bg-white/5 p-2.5 rounded-xl">
              Catatan: "{pickupNotes}"
            </div>
          )}

          <div className="flex justify-between text-lg font-black text-white pt-4 border-t border-white/10">
            <span>Total Bayar:</span>
            <span className="text-emerald-400 text-2xl font-black">
              Rp {foodSubtotal.toLocaleString('id-ID')}
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
              <span>Memproses Transaksi Makanan...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Bayar Sekarang (Rp {foodSubtotal.toLocaleString('id-ID')})</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
