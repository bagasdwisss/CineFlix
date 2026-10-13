import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Check, AlertCircle, Armchair } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import BookingTimer from '../components/booking/BookingTimer';

export default function SeatSelection() {
  const navigate = useNavigate();
  const { bookingData, setBookingData, getSlotOccupiedSeats } = useBooking();
  const { showToast } = useToast();

  const [selectedSeats, setSelectedSeats] = useState([]);

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

    // Merge with persisted bookings in this slot
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

  const ticketPrice = bookingData.ticketPrice || 75000;
  const totalPrice = selectedSeats.length * ticketPrice;

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
      
      {/* Top Bar with Timer */}
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
          <span className="text-xs text-emerald-400 font-bold">
            Rp {ticketPrice.toLocaleString('id-ID')} / kursi ({bookingData.isWeekend ? 'Weekend' : 'Weekday'})
          </span>
        </div>
      </div>

      {/* Screen Curved Display */}
      <div className="relative max-w-2xl mx-auto pt-2 pb-10">
        <div className="w-full h-3.5 rounded-[50%] bg-gradient-to-r from-transparent via-[#2575fc] to-transparent shadow-[0_15px_30px_rgba(37,117,252,0.4)]" />
        <p className="text-center text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mt-4">
          LAYAR BIOSKOP (SCREEN)
        </p>
      </div>

      {/* Interactive Seat Matrix */}
      <div className="overflow-x-auto pb-4 scrollbar-none">
        <div className="min-w-[640px] max-w-3xl mx-auto space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-5 text-center text-xs font-bold text-gray-400">{row}</span>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((num) => {
                  const seatId = `${row}${num}`;
                  const isOccupied = occupiedSeats.has(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <React.Fragment key={seatId}>
                      {num === 9 && <div className="w-6 sm:w-8" />}

                      <button
                        type="button"
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all ${
                          isOccupied
                            ? "bg-red-500/20 text-red-300/40 border border-red-500/20 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white border border-transparent shadow-lg shadow-purple-500/40 scale-110 font-bold"
                            : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 hover:border-white/30"
                        }`}
                        title={isOccupied ? `Kursi ${seatId} sudah terisi` : `Pilih Kursi ${seatId}`}
                      >
                        {num}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              <span className="w-5 text-center text-xs font-bold text-gray-400">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Status Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-white/10 border border-white/20" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-gradient-to-r from-[#6a11cb] to-[#2575fc]" />
          <span>Dipilih Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-red-500/20 border border-red-500/30 text-red-400" />
          <span>Sudah Terisi</span>
        </div>
      </div>

      {/* Summary Floating Bar */}
      <div className="bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 border border-[#2575fc]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Tempat Duduk Terpilih</div>
          <div className="text-lg font-bold text-white">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Belum ada kursi dipilih'}
          </div>
          <div className="text-xs text-gray-400">
            {selectedSeats.length} Kursi x Rp {ticketPrice.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
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

    </div>
  );
}
