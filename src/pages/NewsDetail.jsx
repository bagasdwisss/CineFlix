import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Tag, Bookmark, Heart, MessageSquare, Ticket, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { newsData } from '../data/newsData';
import { moviesData } from '../data/moviesData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const article = newsData.find((n) => n.id === id) || newsData[0];
  const relatedArticles = newsData.filter((n) => n.id !== article.id).slice(0, 3);

  // Likes state with localStorage persistence
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(`cineflix_news_likes_${article.id}`);
      return saved ? parseInt(saved) : 42;
    } catch {
      return 42;
    }
  });
  const [hasLiked, setHasLiked] = useState(() => {
    try {
      return localStorage.getItem(`cineflix_news_has_liked_${article.id}`) === 'true';
    } catch {
      return false;
    }
  });

  // Comments state with localStorage persistence
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem(`cineflix_news_comments_${article.id}`);
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: "Rian Hidayat",
          time: "2 jam yang lalu",
          text: "Gila keren banget beritanya! Gak sabar nunggu rilis resminya di bioskop CineFlix!"
        },
        {
          id: 2,
          name: "Siti Rahma",
          time: "5 jam yang lalu",
          text: "Visual efeknya pasti bakal gila banget kalau ditonton di studio IMAX Dolby Atmos."
        }
      ];
    } catch {
      return [];
    }
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Find related movie to promote booking
  const matchedMovie = moviesData.find((m) => 
    article.title.toLowerCase().includes(m.title.toLowerCase()) ||
    m.title.toLowerCase().includes('avatar') && article.title.toLowerCase().includes('avatar') ||
    m.title.toLowerCase().includes('avengers') && article.title.toLowerCase().includes('marvel')
  ) || moviesData[0];

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
      localStorage.setItem(`cineflix_news_has_liked_${article.id}`, 'false');
      localStorage.setItem(`cineflix_news_likes_${article.id}`, (likes - 1).toString());
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      localStorage.setItem(`cineflix_news_has_liked_${article.id}`, 'true');
      localStorage.setItem(`cineflix_news_likes_${article.id}`, (likes + 1).toString());
      showToast('Terima kasih telah menyukai artikel ini!', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      }).catch(console.log);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan artikel berhasil disalin ke clipboard!', 'success');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      name: user ? user.name : "Penggemar Film",
      time: "Baru saja",
      text: newCommentText.trim()
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    localStorage.setItem(`cineflix_news_comments_${article.id}`, JSON.stringify(updated));
    showToast('Komentar Anda berhasil dipublikasikan!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Flix News
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          {article.category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-400" /> Ditulis oleh: <strong className="text-white">{article.author}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#2575fc]" /> {article.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
              <span className="font-bold text-xs">{likes} Suka</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Share2 className="w-3.5 h-3.5" /> Bagikan
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-white/10 bg-[#16213e]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'assets/news1.jpg';
          }}
        />
      </div>

      {/* Article Content */}
      <div className="text-gray-200 text-base sm:text-lg leading-relaxed space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-xl">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Promoted Cinema Booking Card */}
      {matchedMovie && (
        <div className="bg-gradient-to-r from-purple-900/40 via-[#16213e] to-blue-900/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={matchedMovie.poster}
              alt={matchedMovie.title}
              className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl object-cover border border-white/20 shadow-xl shrink-0"
            />
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Sedang Tayang di Bioskop CineFlix
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{matchedMovie.title}</h3>
              <p className="text-xs text-gray-300 mt-1">Nikmati kualitas audio Dolby Atmos & visual imersif di studio pilihan.</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/booking?movie=${encodeURIComponent(matchedMovie.title)}`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Pesan Tiket Film Ini</span>
          </button>
        </div>
      )}

      {/* Interactive Comments & Discussions */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Diskusi Penonton ({comments.length})</span>
          </h3>
          <span className="text-xs text-gray-400">Suarakan opini Anda</span>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Tulis pendapat atau ulasan Anda mengenai berita ini..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 pt-2">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.name}</span>
                <span className="text-[11px] text-gray-500">{c.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related News */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        <h3 className="text-2xl font-black text-white">Artikel Terkait Lainnya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              to={`/news/${rel.id}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:-translate-y-1 transition-all flex flex-col shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#16213e]">
                <img
                  src={rel.image}
                  alt={rel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 flex-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">{rel.category}</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 line-clamp-2 mt-1">
                  {rel.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
