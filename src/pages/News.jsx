import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowRight, Search } from 'lucide-react';
import { newsData } from '../data/newsData';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Marvel', 'Hollywood', 'Box Office', 'Trending', 'Teknologi', 'Penghargaan'];

  const filteredNews = newsData.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2575fc] px-3 py-1 rounded-full bg-[#2575fc]/10 mb-2 inline-block">
          Kabar Terkini Dunia Perfilman
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
          FLIX NEWS
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-3">
          Berita film terbaru, rumor Marvel, rekor box office global, dan ulasan mendalam perfilman tanah air dan internasional.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === c
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berita film..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#2575fc]"
          />
        </div>

      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((news) => (
          <article
            key={news.id}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#2575fc]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-[#16213e]">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-white/10">
                  {news.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2575fc]" /> {news.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-500" /> {news.author}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-[#2575fc] transition-colors line-clamp-2">
                  <Link to={`/news/${news.id}`}>{news.title}</Link>
                </h2>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {news.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                to={`/news/${news.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2575fc] hover:text-purple-400 transition-colors"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
