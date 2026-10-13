import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Utensils, Star, MapPin, Sparkles, Check, Tag } from 'lucide-react';
import { foodsData } from '../data/foodsData';
import { cinemasData } from '../data/moviesData';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';

export default function Foods() {
  const navigate = useNavigate();
  const { foodCart, addFoodItem, updateFoodQty, removeFoodItem, clearFoodCart, foodSubtotal } = useBooking();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCinema, setSelectedCinema] = useState('CINEFLIX GRAND INDONESIA');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cartNotes, setCartNotes] = useState('');

  const categories = ['All', 'Popcorn', 'Combo', 'Snack', 'Hot Meal', 'Beverage'];

  const filteredFoods = activeCategory === 'All'
    ? foodsData
    : foodsData.filter(f => f.category === activeCategory);

  const totalCartCount = foodCart.reduce((sum, i) => sum + i.quantity, 0);

  const handleProceedToPayment = () => {
    if (foodCart.length === 0) {
      showToast('Keranjang makanan Anda masih kosong.', 'error');
      return;
    }
    // Store selected cinema in localStorage for payment receipt
    localStorage.setItem('cineflix_food_pickup_cinema', selectedCinema);
    if (cartNotes.trim()) {
      localStorage.setItem('cineflix_food_pickup_notes', cartNotes.trim());
    }
    setShowCartDrawer(false);
    navigate('/foods/payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#16213e] to-purple-950/60 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> CineFlix Concession & FnB
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] tracking-wide">
              FLIX FOODS & DRINKS
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Pesan popcorn hangat, minuman dingin, dan camilan favorit secara online. Langsung ambil di konter tanpa antre saat menonton film!
            </p>
          </div>

          {/* Cinema Pickup Selector & Cart Button */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-black/40 border border-white/15 rounded-2xl p-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0 ml-1" />
              <select
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-2"
              >
                {cinemasData.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#16213e] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Keranjang ({totalCartCount})</span>
              {totalCartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[11px] font-black">
                  Rp {foodSubtotal.toLocaleString('id-ID')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-purple-500/25 scale-105"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredFoods.map((food) => {
          const cartItem = foodCart.find(i => i.id === food.id);
          const currentQty = cartItem?.quantity || 0;

          return (
            <div
              key={food.id}
              className="bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-3xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group shadow-xl backdrop-blur-md"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#141424] to-[#1e1b4b] overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                    onError={(e) => {
                      e.target.src = 'assets/food1.png';
                    }}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-white/10">
                    {food.category}
                  </span>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{food.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-2">
                  <h3 className="font-black text-lg text-white group-hover:text-purple-300 transition-colors">
                    {food.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {food.description}
                  </p>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Harga Menu</span>
                  <span className="text-xl font-black text-emerald-400">
                    Rp {food.price.toLocaleString('id-ID')}
                  </span>
                </div>

                {currentQty > 0 ? (
                  <div className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/40 rounded-xl p-1">
                    <button
                      onClick={() => updateFoodQty(food.id, currentQty - 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-white">
                      {currentQty}
                    </span>
                    <button
                      onClick={() => addFoodItem(food, 1)}
                      className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addFoodItem(food, 1);
                      showToast(`${food.name} berhasil ditambahkan!`, 'success');
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer Modal */}
      {showCartDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn"
          onClick={() => setShowCartDrawer(false)}
        >
          <div 
            className="w-full max-w-md h-full bg-[#141424] border-l border-white/10 p-6 flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Keranjang Pesanan Makanan</h3>
                  <p className="text-[11px] text-gray-400">Ambil di: <strong className="text-white">{selectedCinema}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="text-gray-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-white/5"
              >
                Tutup
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {foodCart.length === 0 ? (
                <div className="text-center py-20 text-gray-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-600" />
                  <p className="text-sm font-bold text-white">Keranjang Makanan Kosong</p>
                  <p className="text-xs text-gray-400">Pilih camilan atau minuman lezat bioskop untuk ditambahkan.</p>
                </div>
              ) : (
                foodCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain bg-black/30 p-1 shrink-0"
                      onError={(e) => {
                        e.target.src = 'assets/food1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                      <p className="text-xs text-emerald-400 font-bold mt-0.5">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateFoodQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateFoodQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-400 hover:text-red-300 ml-1 p-1 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Order Notes */}
              {foodCart.length > 0 && (
                <div className="pt-2">
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Catatan Pesanan Khusus (Opsional):
                  </label>
                  <input
                    type="text"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                    placeholder="Contoh: Ekstra mentega karamel / tanpa es batu"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              )}
            </div>

            {/* Cart Footer Checkout Bar */}
            {foodCart.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 font-medium">Total Pembayaran:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    Rp {foodSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearFoodCart}
                    className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
