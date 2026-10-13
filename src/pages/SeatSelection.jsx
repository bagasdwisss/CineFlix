import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Ticket, Check, AlertCircle, Armchair, 
  Eye, Users, Sparkles, Utensils, Info, ShieldCheck, Heart
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import BookingTimer from '../components/booking/BookingTimer';
import SeatPOVModal from '../components/booking/SeatPOVModal';
import SplitBillModal from '../components/booking/SplitBillModal';
import CustomComboModal from '../components/booking/CustomComboModal';

// Seat Category & Tier Configuration
export const getSeatCategory = (seatId, basePrice = 75000) => {
  const row = seatId.charAt(0).toUpperCase();
  if (row === 'A') {
    return {
      tier: 'bed',
      name: 'Premiere Bed',
      badge: '🛏️ Premiere Bed',
      color: 'from-amber-500 to-yellow-400',
      bgClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/30',
      selectedClass: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold ring-2 ring-yellow-300 shadow-lg shadow-amber-500/40',
      price: basePrice + 45000,
      description: 'Kasur mewah rebahan 180° dengan bantal empuk & selimut satin'
    };
  }
  if (row === 'B') {
    return {
      tier: 'vip',
      name: 'Recliner VIP',
      badge: '🛋️ Recliner VIP',
      color: 'from-purple-600 to-indigo-500',
      bgClass: 'bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/30',
      selectedClass: 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold ring-2 ring-purple-300 shadow-lg shadow-purple-500/40',
      price: basePrice + 25000,
      description: 'Kursi kulit elektrik dengan sandaran kaki dan port USB charging'
    };
  }
  if (['G', 'H'].includes(row)) {
    return {
      tier: 'sweetbox',
      name: 'Sweetbox Duo',
      badge: '💖 Sweetbox Duo',
      color: 'from-pink-600 to-rose-500',
      bgClass: 'bg-pink-500/15 border-pink-500/40 text-pink-300 hover:bg-pink-500/30',
      selectedClass: 'bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold ring-2 ring-pink-300 shadow-lg shadow-pink-500/40',
      price: basePrice + 20000,
      description: 'Sofa pasangan berdua tanpa sekat lengan untuk privasi lebih nyaman'
    };
  }
  return {
    tier: 'regular',
    name: 'Regular Studio',
    badge: '💺 Regular',
    color: 'from-blue-600 to-cyan-500',
    bgClass: 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10 hover:border-white/30',
    selectedClass: 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold ring-2 ring-blue-300 shadow-lg shadow-blue-500/40',
    price: basePrice,
    description: 'Kursi bioskop ergonomis standar dengan audio imersif Dolby Atmos'
  };
};

export default function SeatSelection() {
  const navigate = useNavigate();
  const { bookingData, setBookingData, getSlotOccupiedSeats } = useBooking();
  const { showToast } = useToast();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Modals state
  const [isPOVOpen, setIsPOVOpen] = useState(false);
  const [activePOVSeat, setActivePOVSeat] = useState('D8');
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  // Generate cinema seat rows (Rows A to H, 16 seats each, with aisle in between 8 and 9)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 16;

  // Unique slot key for persistent seat reservation
  const slotKey = useMemo(() => {
    if (!bookingData) return 'DEFAULT';
    return `${bookingData.movieId || 'movie'}_${bookingData.cinema}_${bookingData.date}_${bookingData.time}`
      .replace(/\s+/g, '_')
      .replace(/\//g, '-');
  }, [bookingData]);

  // Seed default occupied seats for this slot
  const occupiedSeats = useMemo(() => {
    const defaultOccupied = [];
    const seed = (bookingData?.movie?.length || 7) * 3;
    rows.forEach((r, rIdx) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        if (((rIdx * 17 + num * seed) % 7 === 0) || (rIdx === 3 && (num === 7 || num === 8))) {
          defaultOccupied.push(`${r}${num}`);
        }
      }
    });

    const allOccupied = getSlotOccupiedSeats(slotKey, defaultOccupied);
    return new Set(allOccupied);
  }, [bookingData, slotKey, getSlotOccupiedSeats]);

  if (!bookingData) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Data Booking Tidak Ditemukan</h2>
        <p className="text-sm text-gray-400 mb-6">
          Silakan pilih jadwal film dan bioskop terlebih dahulu sebelum memilih kursi.
        </p>
        <button
          onClick={() => navigate('/booking')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm"
        >
          Kembali ke Pemesanan
        </button>
      </div>
    );
  }

  const baseTicketPrice = bookingData.ticketPrice || 75000;

  // Calculate dynamic seat prices based on selected seat tiers
  const seatSubtotal = useMemo(() => {
    return selectedSeats.reduce((acc, seatId) => {
      return acc + getSeatCategory(seatId, baseTicketPrice).price;
    }, 0);
  }, [selectedSeats, baseTicketPrice]);

  const comboTotal = selectedCombo ? selectedCombo.discountedPrice : 0;
  const totalPrice = seatSubtotal + comboTotal;

  const toggleSeat = (seatId) => {
    if (occupiedSeats.has(seatId)) {
      showToast(`Kursi ${seatId} sudah terisi oleh penonton lain.`, 'error');
      return;
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= 8) {
          showToast('Maksimal pemesanan adalah 8 kursi per transaksi.', 'error');
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const openPOVForSeat = (seatId) => {
    setActivePOVSeat(seatId);
    setIsPOVOpen(true);
  };

  const handleTimerExpire = () => {
    showToast('Waktu sesi pemilihan kursi telah berakhir. Silakan pilih kembali.', 'error');
    setSelectedSeats([]);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      showToast('Silakan pilih minimal 1 kursi terlebih dahulu.', 'error');
      return;
    }

    const bookingId = 'FLIX-' + Math.floor(10000000 + Math.random() * 90000000);
    const updatedBooking = {
      ...bookingData,
      slotKey,
      seats: selectedSeats,
      seatSubtotal,
      combo: selectedCombo,
      totalPrice,
      bookingId,
      bookingDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      serviceFee: 4000
    };

    setBookingData(updatedBooking);
    navigate('/payment');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar with Timer & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Ganti Jadwal
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {bookingData.movie}
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {bookingData.cinema} • {bookingData.date} | {bookingData.time} WIB
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <BookingTimer initialSeconds={300} onExpire={handleTimerExpire} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPOVForSeat(selectedSeats[0] || 'D8')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 text-purple-200 text-xs font-bold transition-all shadow-md"
            >
              <Eye className="w-3.5 h-3.5 text-purple-300" /> 3D POV Layar
            </button>
            <button
              onClick={() => setIsComboModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all"
            >
              <Utensils className="w-3.5 h-3.5" /> Paket FnB Hemat
            </button>
          </div>
        </div>
      </div>

      {/* Seat Category Badges Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
          <span className="text-xl">🛏️</span>
          <div>
            <div className="text-xs font-bold text-amber-300">Baris A: Premiere Bed</div>
            <div className="text-[11px] text-gray-400">Rp {(baseTicketPrice + 45000).toLocaleString('id-ID')} / bed</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2.5">
          <span className="text-xl">🛋️</span>
          <div>
            <div className="text-xs font-bold text-purple-300">Baris B: Recliner VIP</div>
            <div className="text-[11px] text-gray-400">Rp {(baseTicketPrice + 25000).toLocaleString('id-ID')} / kursi</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2.5">
          <span className="text-xl">💺</span>
          <div>
            <div className="text-xs font-bold text-blue-300">Baris C-F: Regular Studio</div>
            <div className="text-[11px] text-gray-400">Rp {baseTicketPrice.toLocaleString('id-ID')} / kursi</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-2.5">
          <span className="text-xl">💖</span>
          <div>
            <div className="text-xs font-bold text-pink-300">Baris G-H: Sweetbox Duo</div>
            <div className="text-[11px] text-gray-400">Rp {(baseTicketPrice + 20000).toLocaleString('id-ID')} / seat</div>
          </div>
        </div>
      </div>

      {/* Screen Curved Display */}
      <div className="relative max-w-2xl mx-auto pt-2 pb-6">
        <div className="w-full h-3.5 rounded-[50%] bg-gradient-to-r from-transparent via-[#2575fc] to-transparent shadow-[0_15px_30px_rgba(37,117,252,0.4)]" />
        <p className="text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mt-4">
          LAYAR BIOSKOP (SCREEN)
        </p>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 py-1">
        <span>👉 Geser layar untuk memilih kursi bioskop</span>
      </div>

      {/* Interactive Seat Matrix */}
      <div className="overflow-x-auto pb-4 scrollbar-none">
        <div className="min-w-[660px] max-w-3xl mx-auto space-y-3">
          {rows.map((row) => {
            const sampleCat = getSeatCategory(`${row}1`, baseTicketPrice);
            return (
              <div key={row} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-gray-400 flex items-center justify-center gap-0.5">
                  {row}
                </span>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((num) => {
                    const seatId = `${row}${num}`;
                    const isOccupied = occupiedSeats.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const seatCat = getSeatCategory(seatId, baseTicketPrice);

                    return (
                      <React.Fragment key={seatId}>
                        {num === 9 && <div className="w-6 sm:w-8" />}

                        <button
                          type="button"
                          disabled={isOccupied}
                          onClick={() => toggleSeat(seatId)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all border ${
                            isOccupied
                              ? "bg-red-500/20 text-red-300/40 border-red-500/20 cursor-not-allowed"
                              : isSelected
                              ? seatCat.selectedClass
                              : seatCat.bgClass
                          }`}
                          title={
                            isOccupied 
                              ? `Kursi ${seatId} sudah terisi` 
                              : `${seatCat.badge} - Kursi ${seatId} (Rp ${seatCat.price.toLocaleString('id-ID')})`
                          }
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-6 text-center text-xs font-bold text-gray-400">{row}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Status Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-300 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/40" />
          <span>Premiere Bed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-purple-500/20 border border-purple-500/40" />
          <span>Recliner VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-pink-500/20 border border-pink-500/40" />
          <span>Sweetbox Duo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-white/10 border border-white/20" />
          <span>Regular Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-gradient-to-r from-[#6a11cb] to-[#2575fc]" />
          <span>Dipilih Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-red-500/20 border border-red-500/30 text-red-400" />
          <span>Terisi</span>
        </div>
      </div>

      {/* Custom Combo Selected Card (if any) */}
      {selectedCombo && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍿</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Bundling Combo Aktif (Hemat 20%)
                </span>
              </div>
              <p className="text-xs text-white font-semibold">
                {selectedCombo.popcorn.name} + {selectedCombo.drink.name} {selectedCombo.snack && `+ ${selectedCombo.snack.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-amber-400">
              + Rp {selectedCombo.discountedPrice.toLocaleString('id-ID')}
            </span>
            <button
              onClick={() => setSelectedCombo(null)}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      {/* Summary Floating Bar */}
      <div className="bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 border border-[#2575fc]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center lg:text-left">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Tempat Duduk Terpilih</div>
          <div className="text-lg font-bold text-white">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Belum ada kursi dipilih'}
          </div>
          <div className="text-xs text-gray-300">
            {selectedSeats.length > 0 ? (
              <span>
                {selectedSeats.map(s => `${s} (${getSeatCategory(s).name})`).join(', ')}
              </span>
            ) : (
              'Silakan klik salah satu kursi di atas'
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Split bill trigger */}
          {selectedSeats.length >= 2 && (
            <button
              onClick={() => setIsSplitBillOpen(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-purple-300" />
              Pesan Bareng (Split Bill)
            </button>
          )}

          <div className="text-center sm:text-right">
            <span className="text-xs text-gray-400 block">Total Pembayaran</span>
            <span className="text-2xl font-black text-emerald-400">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          >
            Lanjut ke Pembayaran
          </button>
        </div>
      </div>

      {/* 3D / POV Screen Angle Modal */}
      <SeatPOVModal
        seatId={isPOVOpen ? activePOVSeat : null}
        movieTitle={bookingData.movie}
        cinemaName={bookingData.cinema}
        seatType={getSeatCategory(activePOVSeat, baseTicketPrice).name}
        isSelected={selectedSeats.includes(activePOVSeat)}
        onClose={() => setIsPOVOpen(false)}
        onConfirmSeat={(seat) => {
          if (!selectedSeats.includes(seat)) toggleSeat(seat);
          setIsPOVOpen(false);
        }}
      />

      {/* Split Bill Modal */}
      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        totalAmount={totalPrice}
        seatsCount={selectedSeats.length}
        movieTitle={bookingData.movie}
        cinemaName={bookingData.cinema}
        onCompleteSplitBill={() => {
          setIsSplitBillOpen(false);
          handleProceedToPayment();
        }}
      />

      {/* Custom Combo Builder Modal */}
      <CustomComboModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onAddCombo={(combo) => {
          setSelectedCombo(combo);
          setIsComboModalOpen(false);
        }}
      />

    </div>
  );
}
