import React, { useState, useEffect } from 'react';
import { Clock, Ticket, Film, Sparkles, ChevronRight, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router-dom';

export default function ShowtimeCountdown() {
  const { user } = useAuth();
  const { latestReceipt } = useBooking();
  const navigate = useNavigate();

  const [activeTicket, setActiveTicket] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Find earliest upcoming movie ticket
    const history = user?.ticketHistory || [];
    const movieTickets = history.filter(t => !t.checkedIn && t.orderType !== 'food');
    const target = latestReceipt && !latestReceipt.checkedIn ? latestReceipt : movieTickets[0];
    setActiveTicket(target);

    if (!target) return;

    // Simulate countdown (default 1 hour 45 minutes from now if date is today)
    const updateTimer = () => {
      const now = new Date();
      // Target showtime (simulation: 2 hours from current hour)
      const targetTime = new Date();
      targetTime.setHours(targetTime.getHours() + 1, targetTime.getMinutes() + 45, 0);

      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Sedang Berlangsung');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}j ${mins}m ${secs}d`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user, latestReceipt]);

  if (!activeTicket) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900/60 via-[#181832] to-blue-900/60 border border-purple-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
          <Film className="w-6 h-6" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> JADWAL NONTON MENDATANG
            </span>
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
              {activeTicket.bookingId}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white truncate mt-0.5">
            {activeTicket.movie}
          </h4>
          <p className="text-xs text-gray-400 truncate">
            {activeTicket.cinema} • {activeTicket.time ? `${activeTicket.time} WIB` : '19:00 WIB'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-gray-400 block font-mono">MULAI DALAM:</span>
          <span className="text-sm sm:text-base font-black text-emerald-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {timeLeft}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/verify/${encodeURIComponent(activeTicket.bookingId)}`)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Lihat E-Tiket</span>
        </button>
      </div>
    </div>
  );
}
