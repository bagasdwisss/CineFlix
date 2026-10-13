import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Ticket, Bookmark, Settings, LogOut, Save, Trash2, Calendar, 
  MapPin, Clock, CheckCircle2, Sparkles, Award, QrCode, ExternalLink, 
  ChevronRight, Shield, CreditCard, Film, Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { moviesData } from '../data/moviesData';
import ETicketModal from '../components/common/ETicketModal';
import TicketScannerModal from '../components/common/TicketScannerModal';
import CinemaPassport from '../components/profile/CinemaPassport';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, toggleWatchlist } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('tickets'); // Default to 'tickets' as requested!
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Profile Edit State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      birthdate: user.birthdate || ''
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    showToast('Profil Anda berhasil diperbarui!', 'success');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const watchlistedMovies = moviesData.filter((m) => user.watchlist?.includes(m.id));

  // Helper to resolve poster for a ticket
  const getTicketPoster = (ticket) => {
    if (ticket.poster) return ticket.poster;
    const match = moviesData.find(m => m.title.toLowerCase() === (ticket.movie || '').toLowerCase());
    return match ? match.poster : 'assets/avatar.jpg';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-[#16213e] to-blue-900/60 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=128`}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-purple-500/40 shadow-xl ring-4 ring-white/10"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-400 text-black shadow-lg" title="VIP Member">
                <Sparkles className="w-4 h-4 fill-black" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {user.membershipTier || 'VIP Gold Member'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Member sejak: {user.memberSince || '2024'} • No. Telp: {user.phone || '0812-xxxx-xxxx'}
              </p>
            </div>
          </div>

          {/* Metrics & Points Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full md:w-auto">
            
            {/* Flix Points Card */}
            <div className="bg-black/40 border border-amber-400/30 rounded-2xl p-4 text-center min-w-[120px] shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Flix Points</span>
              </div>
              <span className="text-2xl font-black text-white">
                {(user.flixPoints || 2450).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Poin Reward</span>
            </div>

            {/* Total Tickets Count */}
            <div className="bg-black/40 border border-purple-400/30 rounded-2xl p-4 text-center min-w-[120px] shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-purple-300 text-xs font-bold mb-0.5">
                <Ticket className="w-4 h-4 text-purple-400" />
                <span>Total Tiket</span>
              </div>
              <span className="text-2xl font-black text-white">
                {user.ticketHistory?.length || 0}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">E-Tiket Terbit</span>
            </div>

            {/* Quick Scanner Action */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 rounded-2xl p-4 text-center min-w-[120px] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-bold mb-0.5">
                <QrCode className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Scanner</span>
              </div>
              <span className="text-sm font-bold text-white block mt-1">Uji Scan</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Verifikasi Tiket</span>
            </button>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Tabs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-1.5">
            
            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'tickets'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-amber-300" />
                <span>Riwayat Tiket & Barcode</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                {user.ticketHistory?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'info'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="w-5 h-5 text-blue-300" />
              <span>Informasi Profil Akun</span>
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'watchlist'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-purple-300" />
                <span>Film Watchlist Saya</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                {user.watchlist?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('passport')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'passport'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <span>Cinema Passport Bioskop</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                NEW 🛂
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5 text-gray-300" />
              <span>Pengaturan & Keamanan</span>
            </button>

            <div className="pt-3 mt-2 border-t border-white/5">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>

          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-purple-500/20 rounded-3xl p-5 text-xs text-gray-300 space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Tips E-Tiket CineFlix
            </span>
            <p className="leading-relaxed text-gray-400">
              Klik film atau tombol <strong>"Lihat E-Tiket & Barcode"</strong> pada tiket Anda untuk memunculkan barcode dan QR code yang siap di-scan di gerbang studio bioskop.
            </p>
          </div>

        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: RIWAYAT TIKET (Highlighted as per user prompt!) */}
          {activeTab === 'tickets' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div>
                  <h3 className="font-black text-xl sm:text-2xl text-white">
                    Riwayat Tiket & Boarding Pass
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Klik film untuk melihat barcode dan QR code resmi yang dapat di-scan
                  </p>
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> Uji Coba Scanner
                </button>
              </div>

              {(!user.ticketHistory || user.ticketHistory.length === 0) ? (
                <div className="text-center py-16 text-gray-400 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-gray-500">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Belum Ada Riwayat Tiket</p>
                    <p className="text-xs text-gray-400 mt-1">Pesan tiket film favorit Anda sekarang untuk melihat e-tiket dengan barcode di sini.</p>
                  </div>
                  <Link
                    to="/home"
                    className="inline-block mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-transform"
                  >
                    Jelajahi Film Sekarang →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.ticketHistory.map((t, idx) => {
                    const poster = getTicketPoster(t);
                    const seats = Array.isArray(t.seats) ? t.seats : [t.seats];

                    return (
                      <div
                        key={t.bookingId || idx}
                        onClick={() => setSelectedTicket({ ...t, poster })}
                        className="group bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/10 hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 transition-all hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                      >
                        {/* Film Poster & Info */}
                        <div className="flex gap-4 items-center flex-1 min-w-0">
                          <img
                            src={poster}
                            alt={t.movie}
                            className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl object-cover border border-white/10 shadow-md shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'assets/avatar.jpg';
                            }}
                          />

                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                                {t.bookingId}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                String(t.bookingId).startsWith('EVT')
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : String(t.bookingId).startsWith('FOOD')
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}>
                                {String(t.bookingId).startsWith('EVT') ? '🎪 Flix Event' : String(t.bookingId).startsWith('FOOD') ? '🍿 Flix Food' : '🎬 Tiket Film'}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {t.status || 'LUNAS & VALID'}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition-colors truncate">
                              {t.movie}
                            </h4>

                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-300">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-purple-400" /> {t.cinema}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-400" /> {t.date} {t.time ? `| ${t.time}` : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-xs text-gray-400">
                                {String(t.bookingId).startsWith('EVT') ? 'Pass:' : String(t.bookingId).startsWith('FOOD') ? 'Menu:' : 'Kursi:'}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {seats.map((seat) => (
                                  <span key={seat} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold text-[11px] border border-purple-500/30">
                                    {seat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Button */}
                        <div className="w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                          <div>
                            <span className="text-base sm:text-lg font-black text-emerald-400 block sm:text-right">
                              Rp {(t.totalPrice || t.grandTotal || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-gray-400 block sm:text-right">
                              {t.paymentMethod || 'GoPay'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket({ ...t, poster });
                            }}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-300" />
                            <span>Lihat E-Tiket & Barcode</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE INFO */}
          {activeTab === 'info' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div>
                  <h3 className="font-black text-xl text-white">Edit Informasi Pribadi</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Perbarui nama, kontak, dan data diri Anda</p>
                </div>
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil disimpan
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Alamat Email (Akun)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Nomor Telepon (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
              <h3 className="font-black text-xl text-white pb-5 border-b border-white/10">
                Film Watchlist Saya ({watchlistedMovies.length})
              </h3>

              {watchlistedMovies.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <Bookmark className="w-12 h-12 mx-auto text-gray-500 opacity-50" />
                  <p className="text-base font-bold text-white">Watchlist Anda Masih Kosong</p>
                  <p className="text-xs text-gray-400">Simpan film yang ingin Anda tonton nanti.</p>
                  <Link
                    to="/home"
                    className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold"
                  >
                    Cari Film Sekarang
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {watchlistedMovies.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center justify-between group hover:border-[#2575fc]/40 transition-all"
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="w-16 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${m.id}`} className="font-bold text-sm text-white hover:text-[#2575fc] truncate block">
                          {m.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{m.duration} • {m.year}</p>
                        <Link
                          to={`/booking?movie=${encodeURIComponent(m.title)}`}
                          className="inline-block mt-2 text-xs font-bold text-[#2575fc] hover:underline"
                        >
                          Pesan Tiket →
                        </Link>
                      </div>

                      <button
                        onClick={() => toggleWatchlist(m.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Hapus dari Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
              <h3 className="font-black text-xl text-white pb-5 border-b border-white/10">
                Pengaturan Akun & Keamanan
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">Notifikasi Promo & Film Rilis</h4>
                    <p className="text-xs text-gray-400">Dapatkan pemberitahuan tiket presale lewat email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-[#2575fc] rounded bg-transparent" />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">Autentikasi Dua Langkah (2FA)</h4>
                    <p className="text-xs text-gray-400">Tingkatkan keamanan akun pemesanan tiket Anda</p>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                    Aktifkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CINEMA PASSPORT */}
          {activeTab === 'passport' && (
            <CinemaPassport />
          )}

        </div>

      </div>

      {/* Official ETicket Modal when a ticket is clicked! */}
      {selectedTicket && (
        <ETicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Ticket Scanner Modal */}
      <TicketScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

    </div>
  );
}
