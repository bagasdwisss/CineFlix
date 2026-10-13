import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Ticket, Bookmark, Star, Clock, Calendar, Award, DollarSign, ShieldAlert, ArrowLeft } from 'lucide-react';
import { moviesData } from '../data/moviesData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const { showToast } = useToast();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const movie = moviesData.find((m) => m.id === id) || moviesData[0];
  const isWatchlisted = user?.watchlist?.includes(movie.id);

  const handleWatchlistClick = () => {
    if (!user) {
      showToast("Silakan login terlebih dahulu untuk menyimpan ke Watchlist.", "info");
      navigate('/login');
      return;
    }
    const added = toggleWatchlist(movie.id);
    if (added) {
      showToast(`'${movie.title}' ditambahkan ke Watchlist Anda.`, 'success');
    } else {
      showToast(`'${movie.title}' dihapus dari Watchlist.`, 'info');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Header with Backdrop */}
      <div className="relative pt-10 pb-16 bg-[#12121f] border-b border-white/10 overflow-hidden">
        {/* Subtle blur backdrop image */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center blur-2xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Poster */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[320px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/60 border border-white/15">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info and Actions */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                {movie.title} <span className="text-gray-400 font-normal">({movie.year})</span>
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs sm:text-sm">
                {movie.genres.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-white/10 text-gray-200 font-medium">
                    {g}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {movie.duration}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  {movie.ageRating}
                </span>

                {/* Rating */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold ml-auto sm:ml-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{movie.rating} / 5</span>
                </div>
              </div>

              {/* Now showing cinemas */}
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-8">
                <span>Tayang di studio:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">XXI</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">CGV</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Cinépolis</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(`/booking?movie=${encodeURIComponent(movie.title)}`)}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold shadow-lg shadow-purple-500/30 hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Pesan Tiket Bioskop</span>
                </button>

                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Tonton Trailer</span>
                </button>

                <button
                  onClick={handleWatchlistClick}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                    isWatchlisted
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                  title="Simpan ke Watchlist"
                >
                  <Bookmark className={`w-5 h-5 ${isWatchlisted ? "fill-amber-400" : ""}`} />
                  <span className="text-sm font-medium">
                    {isWatchlisted ? "Tersimpan" : "Watchlist"}
                  </span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Main Content: Synopsis, Cast & Metadata Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Synopsis & Cast */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 relative inline-block">
                Sinopsis Film
                <span className="block h-1 w-1/2 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-full mt-1.5"></span>
              </h2>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line bg-white/5 border border-white/5 rounded-2xl p-6">
                {movie.synopsis}
              </p>
            </div>

            {/* Cast Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 relative inline-block">
                Pemeran Utama (Cast)
                <span className="block h-1 w-1/2 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-full mt-1.5"></span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {movie.cast.map((actor, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#2575fc]/40 hover:-translate-y-1 transition-all"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#2575fc] mb-3 shadow-md">
                      <img
                        src={actor.photo}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=1a1a2e&color=fff`;
                        }}
                      />
                    </div>
                    <h4 className="font-bold text-sm text-white">{actor.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{actor.role}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Metadata Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <h3 className="font-bold text-lg text-white pb-3 border-b border-white/10">
                Informasi Produksi
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Sutradara (Director)</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Penulis Skenario</span>
                  <span className="text-white font-medium">{movie.writers}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Tanggal Rilis</span>
                  <span className="text-white font-medium">{movie.releaseDate}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Durasi</span>
                  <span className="text-white font-medium">{movie.duration}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Klasifikasi Usia</span>
                  <span className="text-white font-medium">{movie.ageRating}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Pendapatan Box Office</span>
                  <span className="text-emerald-400 font-bold">{movie.boxOffice}</span>
                </div>

                <div>
                  <span className="text-xs text-[#2575fc] font-semibold uppercase block">Penghargaan</span>
                  <span className="text-gray-300 text-xs leading-relaxed block mt-0.5">{movie.awards}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => navigate(`/booking?movie=${encodeURIComponent(movie.title)}`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  Pesan Tiket Sekarang
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={movie.title}
        trailerUrl={movie.trailer}
      />

    </div>
  );
}
