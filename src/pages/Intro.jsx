import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, PlayCircle, ArrowRight } from 'lucide-react';

export default function Intro() {
  const navigate = useNavigate();
  const [taglineProgress, setTaglineProgress] = useState(0);
  const tagline = "Book Anytime, Anywhere";

  useEffect(() => {
    // Typewriter effect for tagline
    const timer = setInterval(() => {
      setTaglineProgress((prev) => {
        if (prev < tagline.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 70);

    // Auto navigate after 4.5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 4500);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a14] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background radial spotlight */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#6a11cb]/25 to-[#2575fc]/25 blur-3xl animate-pulse pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Animated Icon */}
        <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-[#6a11cb] via-[#a855f7] to-[#2575fc] p-[2px] shadow-2xl shadow-purple-500/40 animate-bounce">
          <div className="w-full h-full bg-[#1a1a2e] rounded-3xl flex items-center justify-center">
            <Film className="w-12 h-12 text-transparent bg-gradient-to-r from-[#6a11cb] to-[#2575fc] bg-clip-text" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl sm:text-7xl font-extrabold font-['Cinzel',serif] tracking-widest mb-4 bg-gradient-to-r from-[#6a11cb] via-[#9d4edd] to-[#2575fc] bg-clip-text text-transparent drop-shadow-lg">
          CINEFLIX
        </h1>

        {/* Animated Tagline */}
        <div className="h-8 mb-10">
          <p className="text-lg sm:text-xl font-light text-gray-300 tracking-wider">
            {tagline.substring(0, taglineProgress)}
            <span className="inline-block w-1.5 h-5 bg-[#2575fc] ml-1 animate-pulse align-middle"></span>
          </p>
        </div>

        {/* Skip / Enter Button */}
        <button
          onClick={() => navigate('/home')}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Masuk ke CineFlix</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-xs text-gray-500">
          Otomatis dialihkan dalam beberapa detik...
        </p>
      </div>
    </div>
  );
}
