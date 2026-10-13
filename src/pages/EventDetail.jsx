import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, Check, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import { eventsData } from '../data/eventsData';
import { useBooking } from '../context/BookingContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setEventOrder } = useBooking();

  const event = eventsData.find((e) => e.id === id) || eventsData[0];

  // Quantities for each pass tier
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    event.passes.forEach((p) => {
      initial[p.id] = 0;
    });
    return initial;
  });

  const updateQty = (passId, delta) => {
    setQuantities((prev) => {
      const current = prev[passId] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [passId]: next };
    });
  };

  const selectedItems = event.passes
    .filter((p) => quantities[p.id] > 0)
    .map((p) => ({
      ...p,
      quantity: quantities[p.id],
      total: p.price * quantities[p.id]
    }));

  const subtotal = selectedItems.reduce((acc, item) => acc + item.total, 0);
  const serviceFee = Math.round(subtotal * 0.05); // 5% fee as in original events1.html
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    const orderData = {
      eventName: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventImage: event.image,
      items: selectedItems,
      subtotal,
      serviceFee,
      total,
      orderId: 'EVT-' + Math.floor(10000000 + Math.random() * 90000000)
    };

    setEventOrder(orderData);
    navigate('/events/payment');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Event
      </Link>

      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-white/10 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-80 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 shadow-xl border border-white/15">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 flex-1">
          <span className="px-3 py-1 rounded-full bg-[#2575fc]/20 text-[#2575fc] text-xs font-bold uppercase">
            {event.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {event.title}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-300 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#2575fc]" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-400" /> {event.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-400" /> {event.location}</span>
          </div>
        </div>
      </div>

      {/* Pass Options & Cart Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Pass Tiers List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#2575fc]" /> Pilih Kategori Tiket Pass
          </h2>

          <div className="space-y-4">
            {event.passes.map((pass) => (
              <div
                key={pass.id}
                className={`bg-white/5 border rounded-2xl p-6 transition-all ${
                  quantities[pass.id] > 0
                    ? "border-[#2575fc] bg-gradient-to-r from-[#6a11cb]/10 to-[#2575fc]/10 shadow-lg shadow-purple-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-lg text-white">{pass.name}</h3>
                    <span className="text-xl font-black text-emerald-400">
                      Rp {pass.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ tiket</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                    <button
                      type="button"
                      onClick={() => updateQty(pass.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-white text-base">
                      {quantities[pass.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(pass.id, 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                <div className="pt-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">
                    Keuntungan Tiket:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                    {pass.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-lg text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#2575fc]" /> Ringkasan Pesanan
            </h3>

            {selectedItems.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">
                Belum ada tiket pass dipilih. Silakan tentukan jumlah tiket di samping.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-300">
                    <div>
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-gray-400">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <span className="font-medium text-white">
                      Rp {item.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan (5%):</span>
                    <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Pembayaran:</span>
                    <span className="text-lg font-black text-emerald-400">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:opacity-90 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Lanjut Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
