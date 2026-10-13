import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, LogOut, Menu, X, ShoppingBag, Bookmark, QrCode, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { isSoundEnabled, toggleSound } from '../utils/soundEffects';
import TicketScannerModal from './common/TicketScannerModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { foodCart } = useBooking();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typingText, setTypingText] = useState("CineFlix");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Animated typewriter slogan effect
  useEffect(() => {
    const original = "CineFlix";
    const slogan = "Book Anytime, Anywhere";
    let isCancelled = false;

    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runAnimation() {
      while (!isCancelled) {
        await sleep(3500);
        if (isCancelled) break;

        // Erase original
        for (let i = original.length; i >= 0; i--) {
          if (isCancelled) break;
          setTypingText(original.substring(0, i));
          await sleep(40);
        }

        // Type slogan
        for (let i = 0; i <= slogan.length; i++) {
          if (isCancelled) break;
          setTypingText(slogan.substring(0, i));
          await sleep(60);
        }

        await sleep(3500);
        if (isCancelled) break;

        // Erase slogan
        for (let i = slogan.length; i >= 0; i--) {
          if (isCancelled) break;
          setTypingText(slogan.substring(0, i));
          await sleep(35);
        }

        // Type original back
        for (let i = 0; i <= original.length; i++) {
          if (isCancelled) break;
          setTypingText(original.substring(0, i));
          await sleep(60);
        }
      }
    }

    runAnimation();
    return () => {
      isCancelled = true;
    };
  }, []);

  const totalFoodItems = foodCart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { to: "/home", label: "Film Bioskop" },
    { to: "/foods", label: "Flix Foods" },
    { to: "/merchandise", label: "Flix Merch 🛍️" },
    { to: "/gift-cards", label: "Gift Cards 🎁" },
    { to: "/events", label: "Flix Events" },
    { to: "/news", label: "Flix News" }
  ];

  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/home" || location.pathname === "/")) return true;
    if (path !== "/home" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#141424]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 group-hover:shadow-purple-500/40 transition-all">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-['Cinzel',serif] tracking-wider bg-gradient-to-r from-[#6a11cb] via-[#a855f7] to-[#2575fc] bg-clip-text text-transparent">
                  {typingText}
                  <span className="inline-block w-[2px] h-5 bg-white/80 ml-1 animate-pulse align-middle"></span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 font-semibold text-sm lg:text-[15px] transition-colors ${
                    isActive(link.to)
                      ? "text-white after:w-full"
                      : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#6a11cb] after:to-[#2575fc] after:transition-all after:duration-300`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Gate Staff Scanner Portal Link */}
              <Link
                to="/scanner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all"
                title="Portal Scanner Petugas Gerbang"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gate Scanner</span>
              </Link>

              {/* Quick Scanner Modal in Nav */}
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-xs font-bold transition-all cursor-pointer"
                title="Pindai / Verifikasi Tiket"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Scan Tiket</span>
              </button>

              {/* Audio Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundOn(toggleSound())}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors cursor-pointer"
                title={soundOn ? 'Buzzer Suara: Aktif' : 'Buzzer Suara: Senyap'}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
              </button>

              {/* Bilingual Language Switcher */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-white/10 transition-colors cursor-pointer"
                title="Ganti Bahasa (ID / EN)"
              >
                {lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
              </button>
            </div>

            {/* User & Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Food Cart indicator if any */}
              {totalFoodItems > 0 && (
                <Link 
                  to="/foods" 
                  className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
                  title="Keranjang Makanan"
                >
                  <ShoppingBag className="w-5 h-5 text-[#2575fc]" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                    {totalFoodItems}
                  </span>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all border ${
                      location.pathname === "/profile"
                        ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white border-transparent shadow-lg shadow-purple-500/20"
                        : "bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/10"
                    }`}
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                      alt={user.name}
                      className="w-7 h-7 rounded-xl object-cover border border-white/20"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold leading-none">{user.firstName || user.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-amber-300 font-normal leading-none mt-0.5">VIP Member</span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk / Daftar</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions and menu toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30"
                title="Scan Tiket"
              >
                <QrCode className="w-5 h-5" />
              </button>

              {totalFoodItems > 0 && (
                <Link to="/foods" className="relative p-2.5 text-white">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalFoodItems}
                  </span>
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#141424]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.to)
                    ? "bg-gradient-to-r from-[#6a11cb]/30 to-[#2575fc]/30 text-white border-l-4 border-[#2575fc]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gate Scanner Petugas Bioskop</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsScannerOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20"
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>Pindai / Scan Tiket Bioskop</span>
            </button>

            {/* Mobile Sound & Language Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSoundOn(toggleSound())}
                className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center justify-center gap-2"
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                <span>Buzzer: {soundOn ? 'Aktif' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center justify-center gap-2"
              >
                <span>Bahasa:</span>
                <span className="text-amber-300">{lang === 'id' ? 'ID 🇮🇩' : 'EN 🇬🇧'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-white/10 font-medium"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-amber-300">{user.membershipTier || 'VIP Member'}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] shadow-lg shadow-purple-500/25"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk ke Akun CineFlix</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Ticket Scanner Modal */}
      <TicketScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </>
  );
}
