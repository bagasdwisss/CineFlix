import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Ticket, ArrowLeft, CheckCircle2, Tag, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { evaluateVoucher, formatIDR } from '../utils/formatters';
import { saveTicket } from '../utils/ticketRegistry';
import { moviesData } from '../data/moviesData';

export default function Payment() {
  const navigate = useNavigate();
  const { bookingData, setLatestReceipt, reserveSlotSeats } = useBooking();
  const { user, addTicketToHistory } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('Gopay');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData || !bookingData.seats || bookingData.seats.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Pemesanan Tidak Ditemukan</h2>
        <p className="text-sm text-gray-400 mb-6">Silakan pilih film dan kursi terlebih dahulu.</p>
        <button
          onClick={() => navigate('/booking')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm"
        >
          Mulai Pemesanan
        </button>
      </div>
    );
  }

  const subtotal = bookingData.totalPrice || 0;
  const serviceFee = bookingData.serviceFee || 4000;
  const grandTotal = Math.max(0, subtotal + serviceFee - discount);

  const paymentMethodsList = [
    {
      id: 'Gopay',
      name: 'GoPay',
      desc: 'Bayar instan via aplikasi Gojek / GoPay',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png'
    },
    {
      id: 'ShopeePay',
      name: 'ShopeePay',
      desc: 'Cashback koin dan promo ShopeePay',
      icon: 'assets/ShopeePay.png'
    },
    {
      id: 'DANA',
      name: 'DANA Wallet',
      desc: 'Bayar cepat dengan saldo DANA Anda',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg'
    },
    {
      id: 'CreditCard',
      name: 'Kartu Kredit / Debit',
      desc: 'Visa, Mastercard, JCB berlogo 3D Secure',
      icon: 'https://cdn-icons-png.flaticon.com/512/196/196578.png'
    },
    {
      id: 'PayPal',
      name: 'PayPal Global',
      desc: 'Pembayaran internasional USD / IDR',
      icon: 'https://cdn-icons-png.flaticon.com/512/196/196566.png'
    }
  ];

  const [deliverToSeat, setDeliverToSeat] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [selectedSeatForDelivery, setSelectedSeatForDelivery] = useState(bookingData?.seats?.[0] || 'D8');
  const [giftCardApplied, setGiftCardApplied] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();

    // Check if it's a gift card voucher (GIFT-FLIX-...)
    if (code.startsWith('GIFT-FLIX') || code.includes('GIFT')) {
      try {
        const storedCards = JSON.parse(
          localStorage.getItem('cineflix_wallet_gift_cards') || 
          localStorage.getItem('cineflix_purchased_giftcards') || '[]'
        );
        const foundCard = storedCards.find(c => 
          (c.code && c.code.trim().toUpperCase() === code) || 
          (c.voucherCode && c.voucherCode.trim().toUpperCase() === code)
        );
        
        if (foundCard && foundCard.status?.includes('Sudah Digunakan Penuh')) {
          showToast('Voucher Gift Card ini sudah pernah digunakan habis.', 'error');
          return;
        }

        const cardValue = foundCard ? (foundCard.amount || foundCard.balance || 100000) : 100000;
        const discountAmount = Math.min(subtotal, cardValue);
        
        setDiscount(discountAmount);
        setAppliedVoucher({
          code,
          discount: discountAmount,
          desc: `E-Gift Card CineFlix (${foundCard ? foundCard.themeName : 'Voucher Hadiah'}) Terpotong Rp ${discountAmount.toLocaleString('id-ID')}`
        });
        setGiftCardApplied(foundCard || { code, voucherCode: code, amount: cardValue });
        showToast(`Voucher E-Gift Card berhasil digunakan! Potongan Rp ${discountAmount.toLocaleString('id-ID')}`, 'success');
        return;
      } catch (err) {
        console.error(err);
      }
    }

    const result = evaluateVoucher(promoCode, subtotal);
    if (result.valid) {
      setDiscount(result.discount);
      setAppliedVoucher(result);
      setGiftCardApplied(null);
      showToast(result.message, 'success');
    } else {
      setDiscount(0);
      setAppliedVoucher(null);
      setGiftCardApplied(null);
      showToast(result.message, 'error');
    }
  };

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Permanently mark seats as occupied in this slot!
      if (bookingData.slotKey && bookingData.seats) {
        reserveSlotSeats(bookingData.slotKey, bookingData.seats);
      }

      // Match movie poster
      const movieMatch = moviesData.find(
        (m) => m.title.toLowerCase() === (bookingData.movie || '').toLowerCase()
      );
      const poster = movieMatch ? movieMatch.poster : (bookingData.poster || 'assets/avatar.jpg');

      // 2. Build full receipt object
      const receipt = {
        ...bookingData,
        poster,
        studio: bookingData.studio || 'Studio 1 (Dolby Atmos)',
        buyerName: user ? user.name : 'Pelanggan CineFlix',
        buyerEmail: user ? user.email : '',
        paymentMethod,
        discount,
        serviceFee,
        grandTotal,
        totalPrice: grandTotal,
        deliverToSeat: deliverToSeat ? {
          enabled: true,
          seat: selectedSeatForDelivery,
          note: deliveryNote || 'Antar tepat waktu saat pemutaran trailer/film'
        } : null,
        paymentStatus: 'LUNAS & VALID',
        paymentTime: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB'
      };

      // 3. Save to global verified registry
      saveTicket(receipt);
      setLatestReceipt(receipt);

      // 4. Save to user profile ticket history if logged in
      if (user) {
        addTicketToHistory(receipt);
      }

      // 5. If gift card was used, deduct its balance in localStorage wallet
      if (giftCardApplied && discount > 0) {
        try {
          const rawWallet = localStorage.getItem('cineflix_wallet_gift_cards');
          if (rawWallet) {
            const walletList = JSON.parse(rawWallet);
            const updatedWallet = walletList.map(card => {
              const match = (card.code && card.code.toUpperCase() === giftCardApplied.code?.toUpperCase()) ||
                            (card.voucherCode && card.voucherCode.toUpperCase() === giftCardApplied.code?.toUpperCase());
              if (match) {
                const rem = Math.max(0, (card.amount || card.balance || 0) - discount);
                return {
                  ...card,
                  amount: rem,
                  balance: rem,
                  status: rem <= 0 ? "Sudah Digunakan Penuh" : `Sisa Saldo: Rp ${rem.toLocaleString('id-ID')}`
                };
              }
              return card;
            });
            localStorage.setItem('cineflix_wallet_gift_cards', JSON.stringify(updatedWallet));
          }
        } catch (e) {
          console.error('Error updating gift card wallet:', e);
        }
      }

      setIsProcessing(false);
      showToast('Pembayaran berhasil dikonfirmasi! E-Tiket resmi diterbitkan.', 'success');
      navigate('/receipt');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <button
          onClick={() => navigate('/seat-selection')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ubah Kursi
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          PEMBAYARAN TIKET
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Langkah terakhir: periksa rincian pesanan dan selesaikan transaksi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Payment Method Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#2575fc]" /> Pilih Metode Pembayaran
            </h3>

            <div className="space-y-3">
              {paymentMethodsList.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <label
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 border-[#2575fc] shadow-md shadow-purple-500/10"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="w-4 h-4 text-[#2575fc] bg-transparent border-white/30 focus:ring-0"
                    />

                    <div className="w-12 h-8 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={pm.icon}
                        alt={pm.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white">{pm.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{pm.desc}</p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Promo Voucher */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2575fc]" /> Punya Kode Promo?
            </h3>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Gunakan kode 'CINEFLIX' atau 'FLIXHEMAT'"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white uppercase placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
              >
                Terapkan
              </button>
            </form>
            {appliedVoucher && (
              <p className="text-xs text-emerald-400 font-semibold mt-2">
                ✓ {appliedVoucher.desc} (-{formatIDR(discount)})
              </p>
            )}
          </div>

          {/* Deliver to Seat Feature */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍿</span>
                <div>
                  <h3 className="font-bold text-base text-white">Antar Makanan ke Kursi (Deliver to Seat)</h3>
                  <p className="text-xs text-gray-400">Pramusaji bioskop mengantar makanan langsung ke tempat duduk Anda</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverToSeat}
                  onChange={(e) => setDeliverToSeat(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-600"></div>
              </label>
            </div>

            {deliverToSeat && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3 animate-fade-in text-xs">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Pilih Kursi Penerima</label>
                  <select
                    value={selectedSeatForDelivery}
                    onChange={(e) => setSelectedSeatForDelivery(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  >
                    {bookingData.seats.map((s) => (
                      <option key={s} value={s} className="bg-[#140e2d] text-white">Kursi {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Catatan Tambahan untuk Pramusaji</label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Contoh: Antar 10 menit setelah trailer/lampu redup"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Layanan antar ke kursi aktif • Gratis tanpa biaya tambahan</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Order Summary & Checkout CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
            <h3 className="font-bold text-lg text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#2575fc]" /> Ringkasan Tiket
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-gray-400 block">Film</span>
                <span className="text-white font-bold text-base">{bookingData.movie}</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block">Bioskop</span>
                <span className="text-white font-medium">{bookingData.cinema}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-gray-400 block">Tanggal</span>
                  <span className="text-white font-medium">{bookingData.date}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Waktu</span>
                  <span className="text-white font-medium">{bookingData.time} WIB</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block">Nomor Kursi ({bookingData.seats.length} Tiket)</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {bookingData.seats.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-[#6a11cb]/30 text-purple-200 font-bold text-xs border border-purple-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {bookingData.combo && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="font-bold text-amber-300 flex items-center justify-between">
                    <span>Bundling FnB Hemat 20%</span>
                    <span>Rp {bookingData.combo.discountedPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    🍿 {bookingData.combo.popcorn.name} + {bookingData.combo.drink.name} {bookingData.combo.snack && `+ ${bookingData.combo.snack.name}`}
                  </p>
                </div>
              )}

              {deliverToSeat && (
                <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
                  <span className="font-bold">🍿 Antar ke Kursi ({selectedSeatForDelivery})</span>
                  <span className="text-emerald-400 font-bold">VIP Gratis</span>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal Tiket:</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan:</span>
                <span>{formatIDR(serviceFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Diskon Promo:</span>
                  <span>-{formatIDR(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Bayar:</span>
                <span className="text-xl font-black text-emerald-400">
                  {formatIDR(grandTotal)}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-base shadow-xl shadow-purple-500/30 hover:opacity-95 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Bayar Sekarang ({formatIDR(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transaksi dienkripsi aman 256-bit SSL</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
