import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Tag, Bookmark } from 'lucide-react';
import { newsData } from '../data/newsData';

export default function NewsDetail() {
  const { id } = useParams();
  const article = newsData.find((n) => n.id === id) || newsData[0];

  const relatedArticles = newsData.filter((n) => n.id !== article.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      }).catch(console.log);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Flix News
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-[#2575fc]/20 text-[#2575fc] text-xs font-bold uppercase">
          {article.category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" /> Ditulis oleh: <strong className="text-white">{article.author}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#2575fc]" /> {article.date}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Bagikan Artikel
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-white/10 bg-[#16213e]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="text-gray-200 text-base sm:text-lg leading-relaxed space-y-6 bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Related News */}
      <div className="pt-12 border-t border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-white">Artikel Terkait Lainnya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              to={`/news/${rel.id}`}
              className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-[#2575fc]/40 transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={rel.image}
                  alt={rel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 flex-1">
                <span className="text-[10px] text-[#2575fc] font-bold uppercase">{rel.category}</span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#2575fc] line-clamp-2 mt-1">
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
