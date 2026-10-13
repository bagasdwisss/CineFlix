import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function MovieFilter({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  genres
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul film, sutradara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#2575fc]"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-[#2575fc] shrink-0" />
          <span className="text-xs text-gray-400 shrink-0">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2575fc]"
          >
            <option value="default" className="bg-[#1a1a2e]">Default</option>
            <option value="rating-desc" className="bg-[#1a1a2e]">Rating Tertinggi</option>
            <option value="year-desc" className="bg-[#1a1a2e]">Tahun Rilis (Terbaru)</option>
            <option value="title-asc" className="bg-[#1a1a2e]">Judul (A - Z)</option>
          </select>
        </div>

      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-gray-400 shrink-0 mr-1">Genre:</span>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
