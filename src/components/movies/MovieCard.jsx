import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function MovieCard({ movie, onPlayTrailer }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="group shrink-0 w-[200px] sm:w-[240px] snap-start flex flex-col transition-all duration-300">
      {/* Poster Image Container */}
      <div 
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#16213e] shadow-lg shadow-black/40 group-hover:shadow-purple-500/30 group-hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'assets/avatar.jpg';
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-xs font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Age Rating */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
          {movie.ageRating}
        </div>

        {/* Action Overlay (Desktop Hover) */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex-col justify-end p-4 gap-2"
        >
          {onPlayTrailer && (
            <button
              onClick={() => onPlayTrailer({ title: movie.title, url: movie.trailer })}
              className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Trailer
            </button>
          )}

          <Link
            to={`/movie/${movie.id}`}
            className="w-full py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold text-center transition-colors"
          >
            {t('seeDetails')}
          </Link>

          <button
            onClick={() => navigate(`/booking?movie=${encodeURIComponent(movie.title)}`)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/25 cursor-pointer hover:opacity-95"
          >
            <Ticket className="w-3.5 h-3.5" /> {t('bookNow')}
          </button>
        </div>
      </div>

      {/* Info & Mobile Button */}
      <div className="mt-3">
        <Link
          to={`/movie/${movie.id}`}
          className="font-bold text-white text-sm sm:text-base hover:text-[#2575fc] transition-colors line-clamp-1"
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            {movie.duration}
          </span>
        </div>

        {/* Dedicated Mobile Fast-Book Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/booking?movie=${encodeURIComponent(movie.title)}`);
          }}
          className="w-full mt-2.5 sm:hidden py-2 px-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5" /> {t('bookNow')}
        </button>
      </div>
    </div>
  );
}
