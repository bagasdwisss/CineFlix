import React, { useState, useMemo } from 'react';
import { Award, Sparkles, CheckCircle2, MapPin, Film, Star, Calendar, Bookmark, Stamp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

export default function CinemaPassport({ user: propUser }) {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
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

  const [savedCustomStamps, setSavedCustomStamps] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_passport_stamps');
      return saved ? JSON.parse(saved) : initialStamps;
    } catch {
      return initialStamps;
    }
  });

  // Dynamically merge user's actual ticketHistory with passport stamps!
  const allStamps = useMemo(() => {
    const ticketStamps = (user?.ticketHistory || []).map((t, idx) => ({
      id: `ticket_stamp_${t.bookingId || idx}`,
      title: t.movie || 'Tayangan Film Bioskop',
      cinema: t.cinema || 'CINEFLIX RASUNA SAID',
      date: t.date || t.paymentDate || '2026',
      studio: t.studio || 'Studio Dolby Atmos',
      color: idx % 3 === 0 
        ? "border-cyan-400 text-cyan-300 bg-cyan-950/40" 
        : idx % 3 === 1 
        ? "border-amber-400 text-amber-300 bg-amber-950/40" 
        : "border-purple-400 text-purple-300 bg-purple-950/40",
      tier: t.orderType === 'event' ? "Festival VIP Stamp" : t.orderType === 'food' ? "Concession Gourmet Stamp" : "Verified Screen Stamp",
      seal: "AUTHENTIC CINEFLIX ADMISSION"
    }));

    // Combine and deduplicate
    const combined = [...ticketStamps, ...savedCustomStamps];
    const seen = new Set();
    return combined.filter(s => {
      const key = `${s.title}_${s.date}_${s.cinema}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [user, savedCustomStamps]);

  // Dynamic Passport Tier
  const passportLevel = useMemo(() => {
    const count = allStamps.length;
    if (count >= 10) return { name: "Platinum Master Cinephile", badge: "🏆 PLATINUM", color: "from-amber-400 to-yellow-300 text-black" };
    if (count >= 6) return { name: "Gold Premier Cinephile", badge: "🥇 GOLD", color: "from-amber-500 to-amber-600 text-white" };
    if (count >= 3) return { name: "Silver Explorer", badge: "🥈 SILVER", color: "from-slate-300 to-slate-400 text-black" };
    return { name: "Bronze Novice Cinephile", badge: "🥉 BRONZE", color: "from-amber-700 to-amber-800 text-white" };
  }, [allStamps]);

  // Dynamic Achievements calculation
  const achievements = useMemo(() => {
    const hasImax = user?.ticketHistory?.some(t => t.studio?.toLowerCase().includes('imax')) || allStamps.length >= 2;
    const hasFood = user?.ticketHistory?.some(t => t.orderType === 'food' || t.combo) || allStamps.length >= 2;
    const hasMany = allStamps.length >= 3;
    const hasTen = allStamps.length >= 10;

    return [
      { title: "IMAX Explorer", desc: "Menonton di studio layar lebar IMAX Laser", unlocked: hasImax, icon: "🌌" },
      { title: "Popcorn Master", desc: "Mencicipi varian rasa Popcorn Jumbo CineFlix", unlocked: hasFood, icon: "🍿" },
      { title: "Weekend Warrior", desc: "Kumpulkan 3+ stempel tiket bioskop", unlocked: hasMany, icon: "⚔️" },
      { title: "Midnight Owl", desc: "Menonton penayangan film jam malam studio", unlocked: true, icon: "🦉" },
      { title: "Festival VIP", desc: "Menghadiri festival film / screening CineFlix", unlocked: user?.ticketHistory?.some(t => t.orderType === 'event') || false, icon: "🎟️" },
      { title: "Diamond Cinephile", desc: "Kumpulkan 10 stempel bioskop unik", unlocked: hasTen, icon: "💎" }
    ];
  }, [user, allStamps]);

  const handleClaimDailyStamp = () => {
    const cinemaList = [
      "CINEFLIX RASUNA SAID",
      "CINEFLIX GRAND INDONESIA",
      "CINEFLIX SENAYAN CITY",
      "CINEFLIX CENTRAL PARK"
    ];
    const pickedCinema = cinemaList[Math.floor(Math.random() * cinemaList.length)];

    const newStamp = {
      id: `stamp_${Date.now()}`,
      title: "Daily Cinema Check-In",
      cinema: pickedCinema,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      studio: "Concession VIP Lounge",
      color: "border-emerald-400 text-emerald-300 bg-emerald-950/40",
      tier: "Special Member Stamp",
      seal: "OFFICIAL CINEFLIX CHECK-IN"
    };

    const updated = [newStamp, ...savedCustomStamps];
    setSavedCustomStamps(updated);
    localStorage.setItem('cineflix_passport_stamps', JSON.stringify(updated));
    showToast(`Selamat! Stempel kunjungan '${pickedCinema}' berhasil ditambahkan ke paspor Anda!`, 'success');

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
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
              Koleksi stempel digital resmi setiap kali Anda menonton film di CineFlix. Setiap tiket bioskop Anda otomatis dicap di paspor ini!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-mono">
              <span className="text-amber-300/90 font-bold">NO. PASPOR: FLX-PASS-{user?.email ? user.email.slice(0, 5).toUpperCase() : '98214'}</span>
              <span className={`px-2.5 py-0.5 rounded-full bg-gradient-to-r ${passportLevel.color} font-bold text-[10px]`}>
                {passportLevel.badge} • {passportLevel.name}
              </span>
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
              Halaman Stempel Kunjungan Bioskop ({allStamps.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Cap stempel resmi penayangan studio CineFlix terverifikasi</p>
          </div>
          <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-amber-300 font-bold">
            {allStamps.length} / 12 Koleksi Stempel
          </span>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStamps.map((st, idx) => (
            <div
              key={st.id || idx}
              className={`p-6 rounded-3xl border-2 border-dashed ${st.color} relative overflow-hidden transition-all hover:scale-105 hover:rotate-1 shadow-lg group`}
            >
              {/* Circular Postal Stamp Watermark */}
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full border-2 border-current opacity-15 pointer-events-none flex items-center justify-center text-[10px] font-mono rotate-12">
                CINEFLIX VERIFIED
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-current">
                    {st.tier}
                  </span>
                  <span className="text-[11px] font-mono opacity-80">{st.date}</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {st.title}
                  </h4>
                  <p className="text-xs opacity-90 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{st.cinema}</span>
                  </p>
                  <p className="text-[11px] opacity-75 mt-0.5">
                    🎬 {st.studio}
                  </p>
                </div>

                <div className="pt-3 border-t border-current/20 flex items-center justify-between text-[10px] font-mono">
                  <span>{st.seal}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinephile Badges Achievements */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-black text-white">Lencana &amp; Pencapaian Penonton</h3>
          <p className="text-xs text-gray-400 mt-0.5">Buka lencana eksklusif dengan terus menonton film di CineFlix</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className={`p-4 rounded-2xl border transition-all ${
                ach.unlocked
                  ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 text-white shadow-md"
                  : "bg-white/5 border-white/5 text-gray-500 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  ach.unlocked ? "bg-purple-500/20 border border-purple-500/40" : "bg-white/5"
                }`}>
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold truncate">{ach.title}</h4>
                    {ach.unlocked && (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Terbuka
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{ach.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
