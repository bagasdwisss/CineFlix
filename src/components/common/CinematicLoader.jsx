import React from 'react';
import { Film, Sparkles } from 'lucide-react';

export default function CinematicLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      {/* Golden Film Reel Spinner */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-blue-600/20 to-purple-500/40 border border-purple-500/40 flex items-center justify-center shadow-2xl shadow-purple-500/20 animate-pulse">
          <Film className="w-10 h-10 text-purple-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg animate-ping" />
      </div>

      <h3 className="font-['Cinzel',serif] text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-blue-300 tracking-wider">
        CINEFLIX
      </h3>
      <p className="text-xs text-gray-400 mt-2 font-mono flex items-center gap-1.5 justify-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        <span>Memuat Pengalaman Sinematik...</span>
      </p>
    </div>
  );
}
