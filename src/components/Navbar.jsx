import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Film, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShoppingBag, 
  QrCode, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { isSoundEnabled, toggleSound } from '../utils/soundEffects';
import TicketScannerModal from './common/TicketScannerModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { foodCart } = useBooking();
  const { lang, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typingText, setTypingText] = useState("CineFlix");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
        await sleep(4000);
        if (isCancelled) break;

        for (let i = original.length; i >= 0; i--) {
          if (isCancelled) break;
          setTypingText(original.substring(0, i));
          await sleep(40);
        }

        for (let i = 0; i <= slogan.length; i++) {
          if (isCancelled) break;
          setTypingText(slogan.substring(0, i));
          await sleep(55);
        }

        await sleep(4000);
        if (isCancelled) break;

        for (let i = slogan.length; i >= 0; i--) {
          if (isCancelled) break;
          setTypingText(slogan.substring(0, i));
          await sleep(40);
        }

        for (let i = 0; i <= original.length; i++) {
          if (isCancelled) break;
          setTypingText(original.substring(0, i));
          await sleep(55);
        }
      }
    }

    runAnimation();
    return () => {
      isCancelled = true;
    };
  }, []);

  const totalFoodItems = foodCart.reduce((acc, item) => acc + item.quantity, 0);

  // Clean, uncluttered navigation links
  const navLinks = [
    { to: "/home", label: lang === 'id' ? "Film" : "Movies" },
    { to: "/foods", label: "Flix Foods" },
    { to: "/events", label: "Events" },
    { to: "/merchandise", label: "Merch" },
    { to: "/gift-cards", label: "Gift Cards" },
    { to: "/news", label: lang === 'id' ? "Berita" : "News" }
  ];

  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/home" || location.pathname === "/")) return true;
    if (path !== "/home" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#141424]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            
            {/* 1. Left: Brand Logo */}
            <Link to="/home" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-all">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-['Cinzel',serif] tracking-wider bg-gradient-to-r from-[#6a11cb] via-[#a855f7] to-[#2575fc] bg-clip-text text-transparent">
                  {typingText}
                  <span className="inline-block w-[2px] h-4 bg-white/70 ml-1 animate-pulse align-middle"></span>
                </span>
              </div>
            </Link>

            {/* 2. Center: Clean Navigation Links (Spacious & uncluttered) */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    isActive(link.to)
                      ? "text-white after:w-full font-bold"
                      : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#6a11cb] after:to-[#2575fc] after:transition-all after:duration-300`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* 3. Right: Compact Utilities & User Profile */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Quick Scanner Action Button */}
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Pindai Barcode / QR Code Tiket"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span className="hidden xl:inline">Scan Tiket</span>
              </button>

              {/* Staff Gate Scanner Portal Link */}
              <Link
                to="/scanner"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-emerald-300 border border-white/10 transition-colors"
                title="Portal Scanner Petugas Gerbang"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </Link>

              {/* Audio Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundOn(toggleSound())}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors cursor-pointer"
                title={soundOn ? 'Buzzer Suara: Aktif' : 'Buzzer Suara: Senyap'}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
              </button>

              {/* Language Switcher Pill */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-gray-300 border border-white/10 transition-colors cursor-pointer"
                title="Ganti Bahasa (ID / EN)"
              >
                {lang === 'id' ? 'ID' : 'EN'}
              </button>

              {/* Food Cart Icon with Counter */}
              {totalFoodItems > 0 && (
                <Link 
                  to="/foods" 
                  className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
                  title="Keranjang Makanan"
                >
                  <ShoppingBag className="w-4 h-4 text-[#2575fc]" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-md">
                    {totalFoodItems}
                  </span>
                </Link>
              )}

              <div className="h-5 w-[1px] bg-white/15 mx-0.5" />

              {/* User Profile Pill / Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                    />
                    <span className="text-xs font-bold max-w-[100px] truncate">
                      {user.firstName || user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setProfileDropdownOpen(false)} 
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-[#16213e] border border-white/15 rounded-2xl p-2 shadow-2xl z-40 space-y-1 animate-fadeIn">
                        <div className="px-3 py-2 border-b border-white/10">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-amber-300">{user.membershipTier || 'VIP Member'}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          <span>Profil & Riwayat Tiket</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>

            {/* 4. Mobile Controls (Hamburger & Quick Scanner) */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30"
                title="Scan Tiket"
              >
                <QrCode className="w-4 h-4" />
              </button>

              {totalFoodItems > 0 && (
                <Link to="/foods" className="relative p-2.5 text-white">
                  <ShoppingBag className="w-5 h-5 text-[#2575fc]" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalFoodItems}
                  </span>
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* 5. Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#141424]/98 backdrop-blur-2xl border-b border-white/10 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
            
            {/* Primary Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.to)
                      ? "bg-gradient-to-r from-[#6a11cb]/30 to-[#2575fc]/30 text-white border-l-4 border-[#2575fc]"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick Staff & Scanner Actions */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsScannerOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Tiket</span>
              </button>

              <Link
                to="/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Gate Scanner</span>
              </Link>
            </div>

            {/* Utilities: Sound & Language */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSoundOn(toggleSound())}
                className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                <span>Buzzer: {soundOn ? 'Aktif' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5"
              >
                <span>Bahasa:</span>
                <span className="text-amber-300 font-bold">{lang === 'id' ? 'ID 🇮🇩' : 'EN 🇬🇧'}</span>
              </button>
            </div>

            {/* User Profile / Login */}
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-white/5 border border-white/10"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-amber-300">{user.membershipTier || 'VIP Member'}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] shadow-lg shadow-purple-500/25"
                >
                  <User className="w-3.5 h-3.5" />
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
