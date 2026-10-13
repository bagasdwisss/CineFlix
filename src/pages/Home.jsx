import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Ticket, Sparkles, MapPin, Calendar, Play } from 'lucide-react';
import { moviesData, bannerSlides, cinemasData } from '../data/moviesData';
import { eventsData } from '../data/eventsData';
import MovieCard from '../components/movies/MovieCard';
import MovieFilter from '../components/movies/MovieFilter';
import TrailerModal from '../components/TrailerModal';

export default function Home() {
  const navigate = useNavigate();

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Movie Slider scroll ref
  const sliderRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // Trailer Modal State
  const [activeTrailer, setActiveTrailer] = useState(null);

  // Auto advance banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Movie horizontal scroll controls
  const scrollMovies = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300 * 2;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const jumpToMovieSection = (index) => {
    setActiveDot(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * 600,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const dotIndex = Math.min(Math.round(scrollLeft / 600), 2);
      setActiveDot(dotIndex);
    }
  };

  // Unique genres
  const allGenres = useMemo(() => {
    const set = new Set();
    moviesData.forEach((m) => m.genres?.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered & Sorted movies
  const displayedMovies = useMemo(() => {
    let result = moviesData.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.cast?.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'rating-desc') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'year-desc') {
      result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchTerm, selectedGenre, sortBy]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Carousel Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/40 aspect-[16/9] sm:aspect-[21/9] max-h-[560px] bg-[#12121f]">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-xs font-semibold text-white w-fit mb-3 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-lg text-gray-200 max-w-2xl drop-shadow mb-6">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/booking"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
                  >
                    <Ticket className="w-5 h-5" />
                    <span>Pesan Tiket Sekarang</span>
                  </Link>
                  <button
                    onClick={() => setActiveTrailer({ title: moviesData[0].title, url: moviesData[0].trailer })}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold transition-colors"
                  >
                    <Play className="w-5 h-5 text-red-400 fill-red-400" />
                    <span>Tonton Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-gradient-to-r from-[#6a11cb] to-[#2575fc]"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2575fc] text-sm font-semibold mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2575fc] animate-ping" />
              SEDANG TAYANG DI BIOSKOP
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative inline-block">
              NOW SHOWING IN CINEFLIX
              <span className="block h-1.5 w-1/3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-full mt-2"></span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollMovies('left')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              title="Geser ke kiri"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollMovies('right')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              title="Geser ke kanan"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search, Filter & Sort Bar */}
        <MovieFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          genres={allGenres}
        />

        {/* Movies Horizontal Scroll Carousel */}
        {displayedMovies.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 text-gray-400">
            Tidak ada film yang sesuai dengan pencarian atau filter genre Anda.
          </div>
        ) : (
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x scroll-smooth"
          >
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={setActiveTrailer}
              />
            ))}
          </div>
        )}

        {/* Carousel Pagination Dots */}
        {displayedMovies.length > 3 && (
          <div className="flex justify-center items-center gap-2.5 mt-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => jumpToMovieSection(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeDot === idx
                    ? "w-8 bg-gradient-to-r from-[#6a11cb] to-[#2575fc]"
                    : "w-3 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cinema Locations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            LOKASI BIOSKOP CINEFLIX
          </h2>
          <p className="text-gray-400 text-sm">
            Auditorium berstandar kelas dunia dengan proyektor laser 4K dan tata suara Dolby Atmos di kota-kota pilihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cinemasData.map((cinema) => (
            <div
              key={cinema.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-[#2575fc]/50 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6a11cb]/30 to-[#2575fc]/30 border border-white/10 flex items-center justify-center text-[#2575fc] mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cinema.name}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 mb-3 inline-block">
                  {cinema.city}
                </span>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {cinema.address}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block">Mulai dari</span>
                  <span className="text-sm font-bold text-emerald-400">
                    Rp {cinema.weekdayPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <Link
                  to={`/booking?cinema=${encodeURIComponent(cinema.name)}`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Pilih Jadwal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Banner Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-blue-900/60 border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-4">
              <Calendar className="w-3.5 h-3.5" /> FLIX SPECIAL EVENTS
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              {eventsData[0].title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Ikuti festival film akbar, temu sapa komunitas, dan dapatkan suvenir resmi eksklusif hanya di CineFlix Events.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/events"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                Jelajahi Semua Event
              </Link>
              <Link
                to={`/events/${eventsData[0].id}`}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
              >
                Beli Tiket Pass
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/20">
            <img
              src={eventsData[0].image}
              alt={eventsData[0].title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        onClose={() => setActiveTrailer(null)}
        title={activeTrailer?.title || ""}
        trailerUrl={activeTrailer?.url || ""}
      />

    </div>
  );
}
