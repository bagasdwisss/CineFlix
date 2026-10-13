import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Film, ChevronRight } from 'lucide-react';
import { moviesData, cinemasData } from '../data/moviesData';
import { useBooking } from '../context/BookingContext';

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setBookingData } = useBooking();

  // Selected Movie
  const initialMovieTitle = searchParams.get('movie') || moviesData[0].title;
  const [selectedMovie, setSelectedMovie] = useState(() => {
    return moviesData.find(m => m.title.toLowerCase() === initialMovieTitle.toLowerCase()) || moviesData[0];
  });

  // Dates generator (Next 7 days)
  const daysName = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Selected Cinema
  const initialCinemaName = searchParams.get('cinema');
  const [selectedCinema, setSelectedCinema] = useState(() => {
    if (initialCinemaName) {
      return cinemasData.find(c => c.name.toLowerCase() === initialCinemaName.toLowerCase()) || cinemasData[0];
    }
    return cinemasData[0];
  });

  // Selected Time Slot
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat, Sun
      dates.push({
        dateObj: d,
        dayNum: d.getDate(),
        month: monthsName[d.getMonth()],
        dayName: daysName[dayOfWeek],
        formatted: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
        isWeekend
      });
    }
    setDateList(dates);
    setSelectedDate(dates[0]);
  }, []);

  // Time Slots
  const timeSlots = ['13:15', '15:30', '17:45', '20:00'];

  // Check if slot has passed for today
  const isSlotPast = (timeStr) => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = new Date();
    const isToday = selectedDate.dateObj.getDate() === today.getDate() &&
                    selectedDate.dateObj.getMonth() === today.getMonth() &&
                    selectedDate.dateObj.getFullYear() === today.getFullYear();

    if (!isToday) return false;
    const [hours, mins] = timeStr.split(':').map(Number);
    const slotDate = new Date();
    slotDate.setHours(hours, mins, 0);
    return now > slotDate;
  };

  const currentPrice = selectedDate?.isWeekend
    ? selectedCinema.weekendPrice
    : selectedCinema.weekdayPrice;

  const handleContinue = () => {
    if (!selectedMovie || !selectedCinema || !selectedDate || !selectedTime) return;

    const data = {
      movieId: selectedMovie.id,
      movie: selectedMovie.title,
      poster: selectedMovie.poster,
      cinema: selectedCinema.name,
      cinemaCity: selectedCinema.city,
      date: selectedDate.formatted,
      time: selectedTime,
      ticketPrice: currentPrice,
      isWeekend: selectedDate.isWeekend
    };

    setBookingData(data);
    navigate('/seat-selection');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2575fc] px-3 py-1 rounded-full bg-[#2575fc]/10 mb-2 inline-block">
          Langkah 1 dari 3
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          PESAN TIKET BIOSKOP
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Pilih film, tanggal, lokasi bioskop, dan jam tayang yang Anda inginkan.
        </p>
      </div>

      {/* Step 1: Select Movie */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider block mb-4 flex items-center gap-2">
          <Film className="w-4 h-4 text-[#2575fc]" /> 1. Pilih Film
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moviesData.map((m) => {
            const isSelected = selectedMovie.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMovie(m)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-[#6a11cb]/30 to-[#2575fc]/30 border-[#2575fc] shadow-lg shadow-purple-500/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                }`}
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-12 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{m.title}</h4>
                  <p className="text-xs text-gray-400">{m.duration} • {m.year}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Date */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider block mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2575fc]" /> 2. Pilih Tanggal Tayang
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
          {dateList.map((d, idx) => {
            const isSelected = selectedDate?.formatted === d.formatted;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedTime(null);
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white border-transparent shadow-lg shadow-purple-500/30 scale-105"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                }`}
              >
                <span className="text-xs font-semibold">{d.dayName}</span>
                <span className="text-xl sm:text-2xl font-black my-0.5">{d.dayNum}</span>
                <span className="text-[11px] opacity-80">{d.month}</span>
                {d.isWeekend && (
                  <span className="text-[10px] mt-1 font-bold text-amber-300">Weekend</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Select Cinema */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider block mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2575fc]" /> 3. Pilih Bioskop
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cinemasData.map((c) => {
            const isSelected = selectedCinema.id === c.id;
            const price = selectedDate?.isWeekend ? c.weekendPrice : c.weekdayPrice;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCinema(c)}
                className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "bg-gradient-to-br from-[#6a11cb]/30 to-[#2575fc]/30 border-[#2575fc] shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 mb-2 inline-block">
                    {c.city}
                  </span>
                  <h4 className="font-bold text-base text-white">{c.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.address}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Harga:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    Rp {price.toLocaleString('id-ID')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Select Showtime */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider block mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2575fc]" /> 4. Pilih Jam Tayang
        </label>

        <div className="flex flex-wrap gap-4">
          {timeSlots.map((time) => {
            const isPast = isSlotPast(time);
            const isSelected = selectedTime === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isPast}
                onClick={() => setSelectedTime(time)}
                className={`px-6 py-3 rounded-xl border font-bold text-base transition-all ${
                  isPast
                    ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through"
                    : isSelected
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white border-transparent shadow-lg shadow-purple-500/30 scale-105"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
                }`}
              >
                {time}
                {isPast && <span className="block text-[10px] font-normal no-underline">Berlalu</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Box & Proceed Button */}
      <div className="bg-gradient-to-r from-[#6a11cb]/20 to-[#2575fc]/20 border border-[#2575fc]/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-white text-lg">{selectedMovie.title}</h4>
          <p className="text-sm text-gray-300">
            {selectedCinema.name} • {selectedDate?.formatted} {selectedTime ? `| ${selectedTime} WIB` : ""}
          </p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">
            Rp {currentPrice.toLocaleString('id-ID')} / tiket ({selectedDate?.isWeekend ? 'Weekend' : 'Weekday'})
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-base shadow-xl shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Pilih Kursi Bioskop</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
