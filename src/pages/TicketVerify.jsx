import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Ticket, Calendar, Clock, MapPin, User, Film, AlertTriangle, ArrowLeft, Printer, Sparkles, QrCode, ShoppingBag, Stamp, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTicketByBookingId, getAllTickets, saveTicket } from '../utils/ticketRegistry';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function TicketVerify() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { latestReceipt } = useBooking();
  const { user, updateTicketInHistory } = useAuth();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState(bookingId || '');
  const [verificationTime, setVerificationTime] = useState('');

  useEffect(() => {
    setLoading(true);
    setVerificationTime(new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB');

    // Look for ticket in registry
    let found = null;
    if (bookingId) {
      found = getTicketByBookingId(bookingId);
      
      // Fallback to latestReceipt if matching
      if (!found && latestReceipt && latestReceipt.bookingId === bookingId) {
        found = latestReceipt;
      }
    }

    setTicket(found);
    setLoading(false);

    if (found) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [bookingId, latestReceipt]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    navigate(`/verify/${encodeURIComponent(searchCode.trim())}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCheckIn = () => {
    if (!ticket) return;
    if (ticket.checkedIn) {
      showToast('Tiket ini sudah pernah di-check in sebelumnya!', 'error');
      return;
    }

    const checkInTime = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    const updated = {
      ...ticket,
      checkedIn: true,
      checkedInAt: checkInTime,
      status: isFood ? 'PESANAN TELAH DIAMBIL' : 'SUDAH DIGUNAKAN (CHECKED IN)'
    };

    saveTicket(updated);
    if (updateTicketInHistory) {
      updateTicketInHistory(ticket.bookingId, updated);
    }
    setTicket(updated);
    showToast(isFood ? 'Pesanan makanan berhasil dikonfirmasi diambil!' : 'Check-in berhasil! Penonton diizinkan masuk studio.', 'success');
    
    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const isEvent = ticket && (ticket.orderType === 'event' || String(ticket.bookingId).startsWith('EVT'));
  const isFood = ticket && (ticket.orderType === 'food' || String(ticket.bookingId).startsWith('FOOD'));

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <div className="text-right">
          <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
            CINEFLIX SECURITY & CONCESSION GATE
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Memverifikasi keaslian kode di server CineFlix...</p>
        </div>
      ) : ticket ? (
        /* Verified Ticket Display */
        <div className="space-y-6">
          
          {/* Security Status Card */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-teal-950/70 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isEvent 
                      ? 'EVENT PASS RESMI TERVERIFIKASI & VALID'
                      : isFood
                      ? 'BUKTI PESANAN FnB RESMI TERVERIFIKASI'
                      : 'TIKET FILM RESMI TERVERIFIKASI & VALID'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isEvent
                    ? 'AKSES FESTIVAL DIIZINKAN'
                    : isFood
                    ? 'PESANAN SIAP DIAMBIL DI KONTER'
                    : 'AKSES STUDIO DIIZINKAN'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  {isEvent
                    ? 'E-Pass ini sah diterbitkan oleh CineFlix Events dan dapat digunakan untuk memasuki area acara.'
                    : isFood
                    ? 'Pesanan makanan/minuman telah dibayar lunas dan siap diambil di konter concession bioskop.'
                    : 'E-Tiket ini sah diterbitkan oleh CineFlix Cinema dan siap digunakan untuk menonton.'}
                </p>
                <div className="mt-3 text-[11px] font-mono text-emerald-400/90">
                  Waktu Verifikasi Sistem: {verificationTime}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Information Card */}
          <div className="bg-[#141424] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#6a11cb] via-[#3b82f6] to-[#2575fc] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isFood ? <ShoppingBag className="w-5 h-5 text-amber-300" /> : <Ticket className="w-5 h-5 text-amber-300" />}
                <span className="font-bold text-sm tracking-wide">
                  {isEvent ? 'DETAIL TIKET EVENT PASS' : isFood ? 'DETAIL VOUCHER MAKANAN' : 'DETAIL TIKET BIOSKOP'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {ticket.bookingId}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Product/Movie info */}
              <div className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-white/10 items-center sm:items-start text-center sm:text-left">
                {ticket.poster && (
                  <img
                    src={ticket.poster}
                    alt={ticket.movie}
                    className="w-24 h-32 rounded-2xl object-cover border border-white/20 shadow-xl shrink-0"
                    onError={(e) => {
                      e.target.src = 'assets/avatar.jpg';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                    {isEvent ? 'Event / Festival' : isFood ? 'Concession Order' : 'Informasi Penayangan'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {ticket.movie}
                  </h2>
                  <p className="text-sm text-gray-300 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{ticket.cinema}</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs">
                    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold">
                      {ticket.studio || 'Studio Bioskop'}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      {ticket.gate || 'Jalur Masuk Resmi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <span className="text-gray-400 text-xs block">Tanggal Pelaksanaan / Order</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-400" /> {ticket.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 text-xs block">Waktu Penayangan / Ambil</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" /> {ticket.time}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 text-xs block">Nama Pemesan / Pemegang</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-400" /> {ticket.buyerName || 'John Doe'}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-3 space-y-1.5">
                  <span className="text-gray-400 text-xs block">
                    {isEvent ? 'Kategori Tiket Pass:' : isFood ? 'Daftar Menu Konsumsi:' : 'Nomor Kursi Bioskop:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(ticket.seats) ? ticket.seats : [ticket.seats || 'A1']).map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 font-black text-xs sm:text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-gray-400 block">Metode Pembayaran</span>
                  <span className="font-semibold text-white text-sm">{ticket.paymentMethod || 'GoPay / E-Wallet'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Transaksi</span>
                  <span className="text-2xl font-black text-emerald-400">
                    Rp {(ticket.grandTotal || ticket.totalPrice || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Security Hologram Strip */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <span className="font-mono text-[11px]">
                SEC-ID: {ticket.bookingId}-CINEFLIX-AUTHENTICATED
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enkripsi Verifikasi 256-bit
              </span>
            </div>

          </div>

          {/* Gate Check-In Action Section */}
          <div className="no-print space-y-3">
            {ticket.checkedIn ? (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">TIKET TELAH DI-CHECK IN / DIGUNAKAN</span>
                    <p className="text-[11px] text-gray-300">Waktu Masuk Gerbang: {ticket.checkedInAt || 'Telah Diverifikasi'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                  GATE PASSED ✓
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCheckIn}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>
                  {isFood 
                    ? "Konfirmasi Pesanan Makanan Diambil di Konter" 
                    : isEvent 
                    ? "Konfirmasi Check-In Akses Event Pass" 
                    : "Konfirmasi Masuk Studio Bioskop (Check-In Gerbang)"}
                </span>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti Verifikasi</span>
            </button>

            <Link
              to="/profile"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all text-center"
            >
              <Ticket className="w-4 h-4" />
              <span>Lihat di Profil Saya</span>
            </Link>
          </div>

        </div>
      ) : (
        /* Ticket Not Found */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Tiket / Pesanan Tidak Ditemukan</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Kode booking <code className="font-mono text-amber-300 font-bold">{bookingId || '(kosong)'}</code> tidak ditemukan dalam sistem database tiket CineFlix.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Masukkan kode booking tiket/makanan..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono uppercase focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Cari
            </button>
          </form>

          <div className="pt-4 border-t border-white/10">
            <Link
              to="/"
              className="text-xs text-purple-400 hover:underline"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
