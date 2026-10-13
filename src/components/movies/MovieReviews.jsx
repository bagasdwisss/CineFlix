import React, { useState, useEffect } from 'react';
import { Star, Heart, Eye, EyeOff, MessageSquare, Send, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function MovieReviews({ movieId, movieTitle }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const storageKey = `cineflix_reviews_${movieId}`;

  // Initial Seed Reviews for Letterboxd feel
  const initialReviews = [
    {
      id: 1,
      author: "Aditya Pratama",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80",
      rating: 5.0,
      date: "3 hari yang lalu",
      likes: 84,
      isSpoiler: false,
      text: "Pengalaman sinematik yang luar biasa! Setiap adegan dibangun dengan detail luar biasa. Tata musik dan suara Dolby Atmos di CineFlix bener-bener bikin merinding dari menit awal sampai akhir."
    },
    {
      id: 2,
      author: "Clarissa Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80",
      rating: 4.5,
      date: "1 minggu yang lalu",
      likes: 42,
      isSpoiler: true,
      text: "Plot twist di babak ketiga saat karakter utama memutuskan untuk berkorban sungguh emosional dan tidak terduga. Visual efek CGI bawah airnya adalah standar baru perfilman dunia."
    },
    {
      id: 3,
      author: "Fajar Nugraha",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=128&q=80",
      rating: 4.0,
      date: "2 minggu yang lalu",
      likes: 29,
      isSpoiler: false,
      text: "Durasi film terasa sangat cepat karena pacing cerita yang begitu intens. Wajib ditonton di studio layar raksasa IMAX minimal sekali seumur hidup!"
    }
  ];

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  const [unmaskedSpoilers, setUnmaskedSpoilers] = useState(new Set());
  const [likedReviews, setLikedReviews] = useState(new Set());

  // New Review Form
  const [myRating, setMyRating] = useState(5.0);
  const [myReviewText, setMyReviewText] = useState('');
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);

  const toggleSpoiler = (reviewId) => {
    setUnmaskedSpoilers(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const handleLikeReview = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const isLiked = likedReviews.has(reviewId);
        return { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 };
      }
      return r;
    }));

    setLikedReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!myReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      author: user ? user.name : "Penonton CineFlix",
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Penonton")}&background=6a11cb&color=fff`,
      rating: myRating,
      date: "Baru saja",
      likes: 1,
      isSpoiler: isSpoilerChecked,
      text: myReviewText.trim()
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    setMyReviewText('');
    setIsSpoilerChecked(false);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    showToast('Ulasan dan rating Anda berhasil dipublikasikan!', 'success');
  };

  // Average Rating
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-8 pt-6">
      
      {/* Letterboxd Rating Score & Distribution Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#16213e] to-blue-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Average Rating Big Box */}
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex flex-col items-center justify-center font-black shadow-xl shadow-amber-500/20 shrink-0">
              <span className="text-3xl leading-none">{avgRating}</span>
              <div className="flex text-black mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-2.5 h-2.5 fill-black" />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                COMMUNITY LETTERBOXD RATING
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                Ulasan Komunitas Cinephile
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Berdasarkan <strong>{reviews.length} ulasan terverifikasi</strong> dari penonton bioskop
              </p>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="w-full md:w-64 space-y-1.5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">5 ★</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[70%]" />
              </div>
              <span className="w-8 text-right font-mono">70%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">4 ★</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400/80 rounded-full w-[20%]" />
              </div>
              <span className="w-8 text-right font-mono">20%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">3 ★</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400/50 rounded-full w-[8%]" />
              </div>
              <span className="w-8 text-right font-mono">8%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">2 ★</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400/30 rounded-full w-[2%]" />
              </div>
              <span className="w-8 text-right font-mono">2%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
        <h4 className="font-bold text-base text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Tulis Ulasan & Berikan Rating Anda untuk "{movieTitle}"</span>
        </h4>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-gray-300">Rating Anda:</span>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setMyRating(starVal)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star className={`w-5 h-5 ${myRating >= starVal ? 'fill-amber-400' : 'text-gray-600'}`} />
                </button>
              ))}
              <span className="ml-2 font-mono font-bold text-amber-300 text-sm">{myRating.toFixed(1)} / 5.0</span>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={isSpoilerChecked}
                onChange={(e) => setIsSpoilerChecked(e.target.checked)}
                className="w-4 h-4 rounded text-red-500"
              />
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Ulasan ini mengandung spoiler
              </span>
            </label>
          </div>

          <textarea
            rows={3}
            required
            value={myReviewText}
            onChange={(e) => setMyReviewText(e.target.value)}
            placeholder="Bagikan pandangan Anda tentang sinematografi, alur cerita, akting, atau tata suara film ini..."
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Ulasan Film</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {reviews.map((rev) => {
          const isSpoilerHidden = rev.isSpoiler && !unmaskedSpoilers.has(rev.id);

          return (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all space-y-3"
            >
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-white">{rev.author}</h5>
                    <span className="text-[11px] text-gray-500">{rev.date}</span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-300">{rev.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Text or Spoiler Shield */}
              {isSpoilerHidden ? (
                <div
                  onClick={() => toggleSpoiler(rev.id)}
                  className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-center cursor-pointer hover:bg-red-950/30 transition-colors space-y-1"
                >
                  <span className="text-xs font-bold text-red-400 flex items-center justify-center gap-1.5">
                    <EyeOff className="w-4 h-4" /> Ulasan ini mengandung spoiler penting alur cerita
                  </span>
                  <p className="text-[11px] text-gray-400">Klik di sini untuk membuka isi ulasan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rev.isSpoiler && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 inline-block">
                      Spoiler Terbuka
                    </span>
                  )}
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              )}

              {/* Review Footer with Likes */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-gray-400">
                <button
                  type="button"
                  onClick={() => handleLikeReview(rev.id)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                    likedReviews.has(rev.id)
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'hover:text-rose-400 hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedReviews.has(rev.id) ? 'fill-rose-400' : ''}`} />
                  <span>{rev.likes} Suka</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
