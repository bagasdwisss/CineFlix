import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141424] border-t border-white/10 pt-16 pb-12 mt-20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-['Cinzel',serif] bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text text-transparent">
                CineFlix
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Pengalaman bioskop masa kini terbaik. Pesan tiket kapan saja dan di mana saja dengan mudah, cepat, dan nyaman.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#2575fc] text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#2575fc] text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#6a11cb] text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wider uppercase">Jelajahi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white hover:underline transition-colors">Beranda</Link></li>
              <li><Link to="/news" className="hover:text-white hover:underline transition-colors">Flix News & Artikel</Link></li>
              <li><Link to="/events" className="hover:text-white hover:underline transition-colors">Flix Events & Festival</Link></li>
              <li><Link to="/foods" className="hover:text-white hover:underline transition-colors">Flix Foods & Treats</Link></li>
              <li><Link to="/merchandise" className="hover:text-white hover:underline transition-colors">Flix Merch & Tumbler</Link></li>
              <li><Link to="/gift-cards" className="hover:text-white hover:underline transition-colors">E-Gift Card Bioskop</Link></li>
              <li><Link to="/profile" className="hover:text-white hover:underline transition-colors">Tiket Saya & Passport</Link></li>
            </ul>
          </div>

          {/* Col 3: Cinema Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wider uppercase">Lokasi Bioskop</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2575fc] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">CINEFLIX RASUNA SAID</span>
                  <p className="text-xs text-gray-400">Epicentrum Walk, Jakarta Selatan</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6a11cb] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">CINEFLIX DAGO ATAS</span>
                  <p className="text-xs text-gray-400">Dago Highlands Plaza, Bandung</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">CINEFLIX UBUD RAYA</span>
                  <p className="text-xs text-gray-400">Sunset Pavilion, Ubud, Bali</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wider uppercase">Berlangganan Promo</h4>
            <p className="text-sm text-gray-400 mb-4">
              Dapatkan info film rilis perdana, diskon tiket, dan voucher makanan langsung ke email Anda.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih! Anda telah terdaftar dalam newsletter CineFlix.'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Alamat email Anda..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:opacity-90 transition-opacity"
              >
                Langganan Sekarang
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CineFlix. All rights reserved. Book Anytime, Anywhere.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-gray-400 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-400 cursor-pointer">Bantuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
