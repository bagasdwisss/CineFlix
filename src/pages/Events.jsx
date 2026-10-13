import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Ticket } from 'lucide-react';
import { eventsData } from '../data/eventsData';
import { useLanguage } from '../context/LanguageContext';

export default function Events() {
  const { t, lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2575fc] px-3 py-1 rounded-full bg-[#2575fc]/10 mb-2 inline-block">
          {t('eventsBadge', 'CineFlix Special Experiences')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
          {t('eventsTitle', 'FLIX EVENTS')}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-3">
          {t('eventsSubtitle', 'Nikmati festival film eksklusif, screening spesial karya sutradara legendaris, dan pengalaman sinematik tak terlupakan.')}
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventsData.map((ev) => (
          <div
            key={ev.id}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#2575fc]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Event Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#16213e]">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-purple-300 border border-white/10">
                  {ev.category}
                </div>
              </div>

              {/* Event Info */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#2575fc] transition-colors line-clamp-2">
                  {ev.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {ev.description}
                </p>

                <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#2575fc] shrink-0" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer CTA */}
            <div className="p-6 pt-0">
              <Link
                to={`/events/${ev.id}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
              >
                <Ticket className="w-4 h-4" />
                <span>{t('getEventPass', 'Pilih Tiket Pass')}</span>
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
