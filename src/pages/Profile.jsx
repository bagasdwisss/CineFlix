import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Ticket, Bookmark, Settings, LogOut, Save, Trash2, Calendar, 
  MapPin, Clock, CheckCircle2, Sparkles, Award, QrCode, ExternalLink, 
  ChevronRight, Shield, CreditCard, Film, Gift, ShoppingBag, Lock, Copy, KeyRound, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { moviesData } from '../data/moviesData';
import ETicketModal from '../components/common/ETicketModal';
import TicketScannerModal from '../components/common/TicketScannerModal';
import CinemaPassport from '../components/profile/CinemaPassport';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, toggleWatchlist, changePassword, redeemFlixPoints } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('tickets'); // Default to 'tickets'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

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

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    try {
      changePassword(oldPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Kata sandi akun Anda berhasil diubah!' });
      showToast('Kata sandi berhasil diperbarui!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Gagal mengubah kata sandi.' });
      showToast(err.message, 'error');
    }
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    updateProfile({ twoFactorEnabled: nextVal });
    showToast(nextVal ? '2FA Keamanan Akun Diaktifkan!' : '2FA Keamanan Dinonaktifkan.', nextVal ? 'success' : 'info');
  };

  // Rewards Catalog
  const pointRewards = [
    { id: 'rew1', name: 'Voucher Diskon Tiket Rp 25.000', cost: 500, code: 'FLIX-POINT25', desc: 'Potongan Rp 25.000 saat bayar tiket film apa saja' },
    { id: 'rew2', name: 'Bucket Popcorn Jumbo Gratis', cost: 1000, code: 'FLIX-POPCORN-FREE', desc: 'Gratis 1 bucket Caramel Popcorn Jumbo di konter bioskop' },
    { id: 'rew3', name: 'Tiket Bioskop Gratis 1 Kursi', cost: 2000, code: 'FLIX-TICKET-FREE', desc: 'Gratis 1 tiket nonton film 2D / Dolby Atmos' }
  ];

  const handleClaimReward = (reward) => {
    try {
      redeemFlixPoints(reward.cost, reward.code, reward.name);
      showToast(`Berhasil menukar ${reward.cost} poin dengan ${reward.name}!`, 'success');
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const merchOrders = useMemo(() => {
    const fromProfile = user.merchOrders || [];
    let fromStorage = [];
    try {
      fromStorage = JSON.parse(localStorage.getItem('cineflix_merch_orders') || '[]');
    } catch (e) {}
    const combined = [...fromProfile, ...fromStorage];
    const seen = new Set();
    return combined.filter(o => {
      if (seen.has(o.orderId)) return false;
      seen.add(o.orderId);
      return true;
    });
  }, [user]);

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
            <div 
              onClick={() => setActiveTab('rewards')}
              className="bg-black/40 border border-amber-400/30 hover:border-amber-400 rounded-2xl p-4 text-center min-w-[120px] shadow-lg cursor-pointer transition-all hover:scale-105"
              title="Klik untuk Tukar Poin Hadiah"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold mb-0.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Flix Points</span>
              </div>
              <span className="text-2xl font-black text-white">
                {(user.flixPoints || 0).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-amber-400 font-bold block mt-0.5">Tukar Hadiah →</span>
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
              onClick={() => setActiveTab('rewards')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'rewards'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-amber-300" />
                <span>Tukar Poin &amp; Hadiah</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                {user.vouchers?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('merch')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'merch'
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-[1.01]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-pink-300" />
                <span>Pesanan Merch &amp; Tumbler</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                {merchOrders.length}
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

          {/* TAB: REWARDS (TUKAR FLIX POINTS) */}
          {activeTab === 'rewards' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <h3 className="font-black text-xl text-white">Tukar Flix Points &amp; Hadiah</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Tukarkan poin hadiah Anda dengan diskon tiket, popcorn, atau tiket nonton gratis!</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
                  Saldo Anda: {(user.flixPoints || 0).toLocaleString('id-ID')} Poin
                </div>
              </div>

              {/* Rewards List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Katalog Hadiah Eksklusif</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pointRewards.map((rew) => {
                    const canAfford = (user.flixPoints || 0) >= rew.cost;
                    return (
                      <div
                        key={rew.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                              {rew.cost} POIN
                            </span>
                            <Gift className="w-4 h-4 text-amber-400" />
                          </div>
                          <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {rew.name}
                          </h5>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {rew.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => handleClaimReward(rew)}
                          disabled={!canAfford}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          {canAfford ? 'Tukar Sekarang' : `Kurang ${rew.cost - (user.flixPoints || 0)} Poin`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Claimed Vouchers List */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Voucher Reward Saya ({user.vouchers?.length || 0})
                </h4>
                {(!user.vouchers || user.vouchers.length === 0) ? (
                  <p className="text-xs text-gray-500 italic">Belum ada voucher hadiah yang ditukarkan.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.vouchers.map((v) => (
                      <div key={v.id} className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-white text-xs block">{v.name}</span>
                          <span className="text-[11px] font-mono text-amber-300 font-bold block mt-0.5">{v.code}</span>
                          <span className="text-[10px] text-gray-400 block">Ditukar: {v.claimedAt}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(v.code);
                            showToast(`Kode ${v.code} disalin ke clipboard!`, 'success');
                          }}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                          title="Salin Kode Voucher"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MERCH ORDERS */}
          {activeTab === 'merch' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div>
                  <h3 className="font-black text-xl text-white">Pesanan Merchandise &amp; Tumbler ({merchOrders.length})</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Pantau status pengiriman merchandise resmi film Anda</p>
                </div>
                <Link
                  to="/merchandise"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs"
                >
                  Belanja Lagi →
                </Link>
              </div>

              {merchOrders.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-500 opacity-50" />
                  <p className="text-base font-bold text-white">Belum Ada Pesanan Merchandise</p>
                  <p className="text-xs text-gray-400">Jelajahi toko resmi CineFlix untuk koleksi figur dan tumbler eksklusif.</p>
                  <Link
                    to="/merchandise"
                    className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold"
                  >
                    Buka Flix Merch
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {merchOrders.map((ord) => (
                    <div key={ord.orderId} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs">
                        <div>
                          <span className="font-bold text-white font-mono">{ord.orderId}</span>
                          <span className="text-gray-400 ml-2">• {ord.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {ord.status || 'Dalam Pengiriman'}
                          </span>
                          <span className="font-mono text-purple-300 text-[11px] font-bold">
                            Resi: {ord.trackingNo || 'CNX-9821034ID'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-gray-300">
                            <span>{it.name} (x{it.qty})</span>
                            <span className="font-bold text-white">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Kurir: {ord.courier?.split('(')[0] || 'JNE'} • Tujuan: {ord.customerName}</span>
                        <span className="font-black text-emerald-400 text-sm">Total: Rp {ord.total?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS (WITH CHANGE PASSWORD & 2FA) */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-8 shadow-xl">
              <div>
                <h3 className="font-black text-xl text-white pb-4 border-b border-white/10">
                  Pengaturan Akun &amp; Keamanan
                </h3>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Preferensi Keamanan</h4>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-white">Autentikasi Dua Langkah (2FA)</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Meminta kode konfirmasi sebelum transaksi tiket bernilai tinggi</p>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      twoFactorEnabled
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                        : "bg-white/10 hover:bg-white/20 text-gray-300"
                    }`}
                  >
                    {twoFactorEnabled ? 'Aktif ✓' : 'Aktifkan'}
                  </button>
                </div>
              </div>

              {/* Change Password Form */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Ubah Kata Sandi (Change Password)</h4>
                
                {passwordMsg.text && (
                  <div className={`p-3.5 rounded-xl text-xs ${
                    passwordMsg.type === 'success' 
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                  }`}>
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Simpan Sandi Baru
                  </button>
                </form>
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
