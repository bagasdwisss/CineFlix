import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Utensils, Star, Check } from 'lucide-react';
import { foodsData } from '../data/foodsData';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';

export default function Foods() {
  const navigate = useNavigate();
  const { foodCart, addFoodItem, updateFoodQty, removeFoodItem, clearFoodCart, foodSubtotal } = useBooking();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('All');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const categories = ['All', 'Popcorn', 'Combo', 'Snack', 'Hot Meal', 'Beverage'];

  const filteredFoods = activeCategory === 'All'
    ? foodsData
    : foodsData.filter(f => f.category === activeCategory);

  const totalCartCount = foodCart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2575fc] px-3 py-1 rounded-full bg-[#2575fc]/10 mb-2 inline-block">
            CineFlix Food & Beverages
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
            FLIX FOODS
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            Lengkapi keseruan menonton film dengan popcorn karamel hangat, camilan renyah, dan minuman segar favorit.
          </p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:opacity-95 transition-opacity"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Keranjang Pesanan</span>
          {totalCartCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md shadow-purple-500/20"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFoods.map((food) => {
          const cartItem = foodCart.find(i => i.id === food.id);
          const currentQty = cartItem?.quantity || 0;

          return (
            <div
              key={food.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#2575fc]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#16213e] to-[#12121f] overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-purple-300">
                    {food.category}
                  </span>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{food.rating}</span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-[#2575fc] transition-colors">
                    {food.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {food.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Harga</span>
                  <span className="text-lg font-black text-emerald-400">
                    Rp {food.price.toLocaleString('id-ID')}
                  </span>
                </div>

                {currentQty > 0 ? (
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateFoodQty(food.id, currentQty - 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white">
                      {currentQty}
                    </span>
                    <button
                      onClick={() => addFoodItem(food, 1)}
                      className="w-7 h-7 rounded-lg bg-[#2575fc] text-white flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addFoodItem(food, 1);
                      showToast(`${food.name} ditambahkan ke keranjang!`, 'success');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
          onClick={() => setShowCartDrawer(false)}
        >
          <div 
            className="w-full max-w-md h-full bg-[#1a1a2e] border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#2575fc]" />
                <h3 className="text-lg font-bold text-white">Keranjang Makanan</h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Tutup
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {foodCart.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-sm">
                  Keranjang makanan Anda masih kosong.
                </div>
              ) : (
                foodCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-contain bg-black/20 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateFoodQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateFoodQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-[#2575fc] text-white flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-400 hover:text-red-300 ml-2 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {foodCart.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 font-medium">Total Harga:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    Rp {foodSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearFoodCart}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 text-xs font-semibold"
                  >
                    Kosongkan
                  </button>
                  <button
                    onClick={() => {
                      setShowCartDrawer(false);
                      navigate('/foods/payment');
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
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
