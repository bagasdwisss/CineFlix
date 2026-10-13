import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Ticket, Bookmark, Settings, LogOut, Save, Trash2, Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { moviesData } from '../data/moviesData';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, toggleWatchlist } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'tickets' | 'watchlist' | 'settings'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Akun Profil Saya</h1>
        <p className="text-sm text-gray-400 mt-1">Kelola data pribadi, riwayat tiket bioskop, dan watchlist Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: User Card & Menu */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=128`}
                alt={user.name}
                className="w-full h-full rounded-full border-4 border-purple-500/40 shadow-xl"
              />
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>

            {/* Menu Tabs */}
            <div className="mt-8 space-y-2 text-left">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'info'
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" /> Informasi Profil
              </button>

              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'tickets'
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Ticket className="w-4 h-4" /> Riwayat Tiket
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {user.ticketHistory?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('watchlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'watchlist'
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4" /> Watchlist
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {user.watchlist?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" /> Pengaturan
              </button>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar (Logout)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-8">
          
          {/* Tab 1: Profile Info */}
          {activeTab === 'info' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-bold text-xl text-white">Edit Informasi Pribadi</h3>
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Ticket History */}
          {activeTab === 'tickets' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
              <h3 className="font-bold text-xl text-white pb-4 border-b border-white/10">
                Riwayat Pemesanan Tiket ({user.ticketHistory?.length || 0})
              </h3>

              {(!user.ticketHistory || user.ticketHistory.length === 0) ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <Ticket className="w-12 h-12 mx-auto text-gray-500 opacity-50" />
                  <p className="text-base font-semibold text-white">Belum Ada Riwayat Pemesanan</p>
                  <p className="text-xs text-gray-400">Pesan tiket film favorit Anda sekarang untuk melihat riwayat di sini.</p>
                  <Link
                    to="/"
                    className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold"
                  >
                    Jelajahi Film
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.ticketHistory.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#2575fc]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                            {t.bookingId}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            ✓ {t.status || 'Berhasil'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{t.movie}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
                          <span>{t.cinema}</span>
                          <span>•</span>
                          <span>{t.date} | {t.time}</span>
                          <span>•</span>
                          <span>Kursi: <strong className="text-white">{Array.isArray(t.seats) ? t.seats.join(', ') : t.seats}</strong></span>
                        </div>
                      </div>

                      <div className="text-right sm:shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 flex sm:flex-col items-center sm:items-end justify-between">
                        <span className="text-base font-black text-emerald-400">
                          Rp {t.totalPrice?.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Metode: {t.paymentMethod || 'E-Wallet'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Watchlist */}
          {activeTab === 'watchlist' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
              <h3 className="font-bold text-xl text-white pb-4 border-b border-white/10">
                Film Watchlist Saya ({watchlistedMovies.length})
              </h3>

              {watchlistedMovies.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <Bookmark className="w-12 h-12 mx-auto text-gray-500 opacity-50" />
                  <p className="text-base font-semibold text-white">Watchlist Anda Masih Kosong</p>
                  <p className="text-xs text-gray-400">Simpan film yang ingin Anda tonton nanti dengan mengklik ikon Watchlist.</p>
                  <Link
                    to="/"
                    className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold"
                  >
                    Cari Film
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

          {/* Tab 4: Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
              <h3 className="font-bold text-xl text-white pb-4 border-b border-white/10">
                Pengaturan Akun
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
                  <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                    Aktifkan
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
