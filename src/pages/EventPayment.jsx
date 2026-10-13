import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Ticket, CheckCircle2, ArrowLeft, Printer, Calendar, MapPin, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function EventPayment() {
  const navigate = useNavigate();
  const { eventOrder } = useBooking();
  const { user, addTicketToHistory } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('Gopay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!eventOrder || !eventOrder.items || eventOrder.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Data Pesanan Event Kosong</h2>
        <p className="text-sm text-gray-400 mb-6">Silakan pilih tiket pass festival terlebih dahulu.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm"
        >
          Lihat Daftar Event
        </button>
      </div>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      if (user) {
        addTicketToHistory({
          bookingId: eventOrder.orderId,
          movie: eventOrder.eventName,
          cinema: eventOrder.eventLocation,
          date: eventOrder.eventDate,
          time: eventOrder.eventTime,
          seats: eventOrder.items.map(i => `${i.name} (x${i.quantity})`),
          totalPrice: eventOrder.total,
          paymentMethod,
          status: 'Berhasil',
          paymentDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
      }
    }, 1200);
  };

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white">PEMBAYARAN EVENT BERHASIL!</h1>
          <p className="text-sm text-gray-300">
            Pass resmi Flix Events Anda telah aktif. Tunjukkan e-tiket ini di gate masuk event.
          </p>
        </div>

        <div className="bg-[#16213e] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center pb-6 border-b border-white/10">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">EVENT PASS</span>
            <h2 className="text-2xl font-black text-white">{eventOrder.eventName}</h2>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              ✓ LUNAS ({paymentMethod})
            </span>
          </div>

          <div className="space-y-3 text-sm pb-6 border-b border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Kode Tiket:</span>
              <span className="font-mono font-bold text-white">{eventOrder.orderId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Jadwal:</span>
              <span className="font-medium text-white">{eventOrder.eventDate} ({eventOrder.eventTime})</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lokasi:</span>
              <span className="font-medium text-white text-right max-w-[240px] truncate">{eventOrder.eventLocation}</span>
            </div>

            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-1">Kategori Pass:</span>
              <div className="space-y-1">
                {eventOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-white/5 p-2 rounded-lg">
                    <span className="font-semibold text-white">{i.name} x{i.quantity}</span>
                    <span className="text-emerald-400 font-bold">Rp {i.total.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-300">Total Pembayaran:</span>
            <span className="text-xl font-black text-emerald-400">
              Rp {eventOrder.total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak Tiket Pass
          </button>
          <Link
            to="/events"
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm flex items-center justify-center"
          >
            Selesai
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <h1 className="text-3xl font-extrabold text-white text-center">
        PEMBAYARAN EVENT PASS
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
        <h3 className="font-bold text-base text-white">Ringkasan Event</h3>
        <p className="text-lg font-black text-white">{eventOrder.eventName}</p>
        <p className="text-xs text-gray-300">{eventOrder.eventDate} • {eventOrder.eventLocation}</p>
        
        <div className="space-y-2 pt-2 border-t border-white/10">
          {eventOrder.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-xs text-gray-300">
              <span>{it.name} x{it.quantity}</span>
              <span>Rp {it.total.toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Biaya Layanan (5%):</span>
            <span>Rp {eventOrder.serviceFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
            <span>Total Bayar:</span>
            <span className="text-emerald-400 font-black">Rp {eventOrder.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-sm text-white mb-3">Pilih Metode Pembayaran</h3>
        {['Gopay', 'ShopeePay', 'DANA', 'Credit Card'].map((pm) => (
          <label
            key={pm}
            onClick={() => setPaymentMethod(pm)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === pm
                ? "bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 border-[#2575fc]"
                : "bg-white/5 border-white/10"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === pm}
              onChange={() => setPaymentMethod(pm)}
              className="text-[#2575fc]"
            />
            <span className="font-bold text-sm text-white">{pm}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memproses Pembayaran...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Bayar Rp {eventOrder.total.toLocaleString('id-ID')}</span>
          </>
        )}
      </button>
    </div>
  );
}
