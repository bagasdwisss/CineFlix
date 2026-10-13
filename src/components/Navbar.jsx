import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, LogOut, Menu, X, ShoppingBag, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { foodCart } = useBooking();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typingText, setTypingText] = useState("CineFlix");

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
    { to: "/", label: "Home" },
    { to: "/news", label: "Flix News" },
    { to: "/events", label: "Flix Events" },
    { to: "/foods", label: "Flix Foods" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] tracking-wider bg-gradient-to-r from-[#6a11cb] via-[#a855f7] to-[#2575fc] bg-clip-text text-transparent">
                {typingText}
                <span className="inline-block w-[2px] h-5 bg-white/80 ml-1 animate-pulse align-middle"></span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 font-medium text-sm lg:text-base transition-colors ${
                  isActive(link.to)
                    ? "text-white font-semibold after:w-full"
                    : "text-gray-300 hover:text-white after:w-0 hover:after:w-full"
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#6a11cb] after:to-[#2575fc] after:transition-all after:duration-300`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Food Cart indicator if any */}
            {totalFoodItems > 0 && (
              <Link 
                to="/foods" 
                className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
                title="Keranjang Makanan"
              >
                <ShoppingBag className="w-5 h-5 text-[#2575fc]" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalFoodItems}
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === "/profile"
                      ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full border border-white/20"
                  />
                  <span>{user.firstName || user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:opacity-95 shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            {totalFoodItems > 0 && (
              <Link to="/foods" className="relative p-2 text-white">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalFoodItems}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#16213e]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.to)
                  ? "bg-gradient-to-r from-[#6a11cb]/30 to-[#2575fc]/30 text-white font-semibold border-l-4 border-[#2575fc]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-white/10 font-medium"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=6a11cb&color=fff&size=64`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc]"
              >
                <User className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
