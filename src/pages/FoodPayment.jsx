import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBooking } from '../context/BookingContext';

export default function FoodPayment() {
  const navigate = useNavigate();
  const { foodCart, foodSubtotal, clearFoodCart } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('Gopay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if ((!foodCart || foodCart.length === 0) && !completedOrder) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Keranjang Makanan Kosong</h2>
        <p className="text-sm text-gray-400 mb-6">Silakan pilih camilan atau minuman bioskop terlebih dahulu.</p>
        <button
          onClick={() => navigate('/foods')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm"
        >
          Lihat Menu Makanan
        </button>
      </div>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = {
        orderId: 'FOOD-' + Math.floor(10000000 + Math.random() * 90000000),
        items: [...foodCart],
        subtotal: foodSubtotal,
        total: foodSubtotal,
        paymentMethod,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setCompletedOrder(order);
      clearFoodCart();
      setIsProcessing(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }
    }, 1200);
  };

  if (completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white">PEMBAYARAN MAKANAN BERHASIL!</h1>
          <p className="text-sm text-gray-300">
            Pesanan makanan Anda siap diambil di Flix Concession Counter bioskop.
          </p>
        </div>

        <div className="bg-[#16213e] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center pb-6 border-b border-white/10">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">FOOD ORDER RECEIPT</span>
            <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">CINEFLIX FOODS</h2>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              ✓ LUNAS ({completedOrder.paymentMethod})
            </span>
          </div>

          <div className="space-y-3 text-sm pb-6 border-b border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Nomor Pesanan:</span>
              <span className="font-mono font-bold text-white">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Waktu Order:</span>
              <span className="font-medium text-white">{completedOrder.date}</span>
            </div>

            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-1">Rincian Item:</span>
              <div className="space-y-1.5">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-white/5 p-2 rounded-lg">
                    <span className="font-semibold text-white">{it.name} x{it.quantity}</span>
                    <span className="text-emerald-400 font-bold">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-300">Total Pembayaran:</span>
            <span className="text-xl font-black text-emerald-400">
              Rp {completedOrder.total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak Bukti Pengambilan
          </button>
          <Link
            to="/foods"
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm flex items-center justify-center"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Link
        to="/foods"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
      </Link>

      <h1 className="text-3xl font-extrabold text-white text-center">
        PEMBAYARAN MAKANAN & MINUMAN
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
        <h3 className="font-bold text-base text-white">Ringkasan Pesanan</h3>
        
        <div className="space-y-2">
          {foodCart.map((it) => (
            <div key={it.id} className="flex justify-between text-xs text-gray-300">
              <span>{it.name} x{it.quantity}</span>
              <span className="font-bold text-white">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
            <span>Total Bayar:</span>
            <span className="text-emerald-400 font-black">Rp {foodSubtotal.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

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
            <span>Bayar Sekarang (Rp {foodSubtotal.toLocaleString('id-ID')})</span>
          </>
        )}
      </button>
    </div>
  );
}
