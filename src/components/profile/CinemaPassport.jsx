import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, MapPin, Film, Star, Calendar, Bookmark, Stamp } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export default function CinemaPassport({ user }) {
  const { showToast } = useToast();

  const initialStamps = [
    {
      id: "stamp1",
      title: "Avatar: The Way of Water",
      cinema: "CINEFLIX RASUNA SAID",
      date: "14 Mei 2026",
      studio: "Studio 1 Dolby Atmos",
      color: "border-cyan-400 text-cyan-300 bg-cyan-950/40",
      tier: "Official Premiere Stamp",
      seal: "DOLBY ATMOS VERIFIED"
    },
    {
      id: "stamp2",
      title: "Avengers: Endgame",
      cinema: "CINEFLIX GRAND INDONESIA",
      date: "20 Mei 2026",
      studio: "IMAX 3D Laser",
      color: "border-amber-400 text-amber-300 bg-amber-950/40",
      tier: "Gold IMAX Stamp",
      seal: "IMAX 3D SCREENING"
    },
    {
      id: "stamp3",
      title: "Midnight Mystery Movie",
      cinema: "CINEFLIX CENTRAL PARK",
      date: "02 April 2026",
      studio: "Studio 3 Midnight",
      color: "border-purple-400 text-purple-300 bg-purple-950/40",
      tier: "Night Owl Cinephile",
      seal: "MIDNIGHT SCREENING"
    }
  ];

  const [stamps, setStamps] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_passport_stamps');
      return saved ? JSON.parse(saved) : initialStamps;
    } catch {
      return initialStamps;
    }
  });

  const achievements = [
    { title: "IMAX Explorer", desc: "Menonton 3x di studio layar lebar IMAX Laser", unlocked: true, icon: "🌌" },
    { title: "Popcorn Master", desc: "Mencicipi varian rasa Popcorn Jumbo CineFlix", unlocked: true, icon: "🍿" },
    { title: "Weekend Warrior", desc: "Menonton film maraton di akhir pekan", unlocked: true, icon: "⚔️" },
    { title: "Midnight Owl", desc: "Menonton penayangan film jam 22.00 ke atas", unlocked: true, icon: "🦉" },
    { title: "Festival VIP", desc: "Menghadiri festival film dan screening eksklusif", unlocked: false, icon: "🎟️" },
    { title: "Diamond Cinephile", desc: "Kumpulkan 10 stempel bioskop unik", unlocked: false, icon: "💎" }
  ];

  const handleClaimDailyStamp = () => {
    const newStamp = {
      id: `stamp_${Date.now()}`,
      title: "Cinema Visit Stamp",
      cinema: "CINEFLIX GRAND INDONESIA",
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      studio: "Concession VIP Lounge",
      color: "border-emerald-400 text-emerald-300 bg-emerald-950/40",
      tier: "Special Member Stamp",
      seal: "OFFICIAL CINEFLIX CHECK-IN"
    };

    const updated = [newStamp, ...stamps];
    setStamps(updated);
    localStorage.setItem('cineflix_passport_stamps', JSON.stringify(updated));
    showToast('Selamat! Stempel kunjungan baru berhasil ditambahkan ke paspor Anda!', 'success');

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Passport Book Cover Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#180e29] via-[#0f172a] to-[#1e1b4b] border-2 border-amber-400/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL CINEPHILE DIGITAL PASSPORT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] tracking-wider">
              PASPOR BIOSKOP CINEFLIX
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Koleksi stempel digital resmi setiap kali Anda menonton film di CineFlix. Kumpulkan stempel untuk membuka diskon VIP dan merchandise eksklusif!
            </p>
            <div className="pt-2 text-xs font-mono text-amber-300/80">
              NO. PASPOR: FLX-PASS-982140 • STATUS: {user?.membershipTier || 'VIP Gold Member'}
            </div>
          </div>

          <button
            onClick={handleClaimDailyStamp}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4 text-black" />
            <span>Klaim Stempel Kunjungan Baru</span>
          </button>
        </div>
      </div>

      {/* Passport Stamps Collection Page */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-black text-white">
              Halaman Stempel Kunjungan Bioskop ({stamps.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Cap stempel resmi penayangan studio CineFlix</p>
          </div>
          <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-amber-300 font-bold">
            {stamps.length} / 12 Koleksi Lengkap
          </span>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stamps.map((st, idx) => (
            <div
              key={st.id || idx}
              className={`p-6 rounded-3xl border-2 border-dashed ${st.color} relative overflow-hidden transition-all hover:scale-105 hover:rotate-1 shadow-lg group`}
            >
              {/* Circular Postal Stamp Watermark */}
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full border-2 border-current opacity-15 pointer-events-none flex items-center justify-center text-[10px] font-mono rotate-12">
                VERIFIED CINEFLIX
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/40 border border-current">
                    {st.seal}
                  </span>
                  <span className="text-xs font-bold">★ {st.tier}</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {st.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {st.cinema}
                  </p>
                </div>

                <div className="pt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
                  <span>{st.date}</span>
                  <span>{st.studio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinephile Badges & Achievements Grid */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="text-xl font-black text-white pb-4 border-b border-white/10">
          Badge Pencapaian & Trofi Cinephile
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-center space-y-2 border transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-purple-900/30 to-blue-900/20 border-purple-500/40 shadow-lg'
                  : 'bg-white/[0.02] border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center mx-auto text-2xl shadow-inner">
                {ach.icon}
              </div>
              <h5 className="font-bold text-xs text-white leading-tight">{ach.title}</h5>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{ach.desc}</p>
              {ach.unlocked ? (
                <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ✓ Terbuka
                </span>
              ) : (
                <span className="inline-block text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                  Terkunci
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
