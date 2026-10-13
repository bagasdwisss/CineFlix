import React from 'react';
import { X, Eye, Monitor, Volume2, Sparkles, Check, Compass, ShieldCheck } from 'lucide-react';

export default function SeatPOVModal({ seatId, movieTitle, cinemaName, seatType, onClose, onConfirmSeat, isSelected }) {
  if (!seatId) return null;

  const row = seatId.charAt(0).toUpperCase();
  const seatNum = parseInt(seatId.slice(1), 10) || 8;

  // Compute perspective factors based on row and column
  const isFrontRow = row === 'A';
  const isVipRow = row === 'B';
  const isCenterSweetSpot = ['C', 'D', 'E'].includes(row);
  const isBackRow = ['F', 'G', 'H'].includes(row);
  const isCenterCol = seatNum >= 6 && seatNum <= 11;
  const isSideCol = seatNum <= 3 || seatNum >= 14;

  let distanceMeters = 16;
  let viewAngleDeg = 0;
  let immersionPercent = 95;
  let soundSweetSpot = "Optimal (98%)";
  let povDescription = "Posisi tengah ideal (The Director's Sweet Spot) dengan sudut pandang mata lurus sempurna ke layar.";

  if (isFrontRow) {
    distanceMeters = 8;
    viewAngleDeg = 24;
    immersionPercent = 98;
    soundSweetSpot = "Imersif Tinggi (92%)";
    povDescription = "Posisi sangat dekat dengan layar layar penuh membentang di seluruh bidang pandang mata.";
  } else if (isVipRow) {
    distanceMeters = 12;
    viewAngleDeg = 12;
    immersionPercent = 96;
    soundSweetSpot = "Dolby Atmos Premium (99%)";
    povDescription = "Posisi VIP Recliner mewah dengan sudut pandang nyaman dan ruang kaki ekstra lapang.";
  } else if (isCenterSweetSpot) {
    distanceMeters = 16;
    viewAngleDeg = isCenterCol ? 0 : 7;
    immersionPercent = 100;
    soundSweetSpot = "Akustik Sempurna (100%)";
    povDescription = "Posisi terbaik di seluruh studio. Gambar proporsional tanpa distorsi dan vokal terdengar jernih tepat dari tengah layar.";
  } else if (isBackRow) {
    distanceMeters = 22;
    viewAngleDeg = -6;
    immersionPercent = 88;
    soundSweetSpot = "Surround Lebar (94%)";
    povDescription = "Posisi atas panoramik dengan pandangan menyeluruh ke seluruh studio dan suasana privat.";
  }

  // Calculate CSS perspective distortion
  const scale = isFrontRow ? 1.25 : isVipRow ? 1.15 : isCenterSweetSpot ? 1.0 : 0.85;
  const rotateX = isFrontRow ? 12 : isBackRow ? -4 : 0;
  const rotateY = isSideCol ? (seatNum <= 3 ? 14 : -14) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#141424] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white my-6">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-700 p-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>3D / POV SEAT VISION SIMULATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Pratinjau Sudut Pandang: Kursi {seatId}
          </h3>
          <p className="text-xs text-purple-200 mt-0.5">
            {cinemaName} • {seatType || 'Kursi Bioskop'}
          </p>
        </div>

        {/* 3D Cinema Screen Simulation Viewport */}
        <div className="p-6 space-y-6">
          <div className="relative w-full h-56 sm:h-64 bg-black rounded-2xl border-2 border-purple-500/30 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
            
            {/* Studio Ambient ceiling lights */}
            <div className="absolute top-2 inset-x-8 flex justify-between opacity-30">
              <div className="w-8 h-1 rounded bg-blue-400 blur-[1px]" />
              <div className="w-8 h-1 rounded bg-blue-400 blur-[1px]" />
              <div className="w-8 h-1 rounded bg-blue-400 blur-[1px]" />
              <div className="w-8 h-1 rounded bg-blue-400 blur-[1px]" />
            </div>

            {/* Simulated 3D Curved Screen with perspective transform */}
            <div 
              style={{
                transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'all 0.5s ease-out'
              }}
              className="relative w-[85%] max-w-md aspect-[21/9] rounded-xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_10px_35px_rgba(34,211,238,0.35)] bg-gradient-to-tr from-purple-900 to-blue-900 flex flex-col items-center justify-center text-center p-4"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent pointer-events-none" />
              <h4 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                {movieTitle}
              </h4>
              <span className="text-[10px] text-cyan-200 font-mono mt-1 tracking-widest uppercase">
                DOLBY CINEMA 4K HDR • 120 FPS
              </span>
            </div>

            {/* Virtual Screen Bevel Glow */}
            <div className="w-3/4 h-1.5 rounded-[50%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_5px_20px_#22d3ee] mt-3" />

            {/* POV HUD Overlay */}
            <div className="absolute bottom-2 inset-x-4 flex justify-between items-center text-[10px] font-mono text-gray-400 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5">
              <span>JARAK: {distanceMeters} METER</span>
              <span className="text-amber-300 font-bold">SUDUT ELEVASI: {viewAngleDeg}°</span>
              <span className="text-emerald-400 font-bold">IMERSI: {immersionPercent}%</span>
            </div>
          </div>

          {/* Seat Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block text-[10px]">Kategori Kursi</span>
              <span className="font-bold text-amber-300">{seatType || 'Reguler'}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block text-[10px]">Tingkat Imersi</span>
              <span className="font-bold text-emerald-400">{immersionPercent}% Penuh</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block text-[10px]">Tata Suara</span>
              <span className="font-bold text-purple-300">{soundSweetSpot}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block text-[10px]">Kenyamanan Kaki</span>
              <span className="font-bold text-white">{isVipRow || isFrontRow ? '140 cm (Ekstra)' : '95 cm'}</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
            💡 {povDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              onClick={() => {
                if (onConfirmSeat) onConfirmSeat(seatId);
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSelected ? 'Sudah Dipilih (Selesai)' : `Pilih Kursi ${seatId} Sekarang`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
