import React, { useState } from 'react';
import { X, Sparkles, Check, Plus, Tag, Utensils, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function CustomComboModal({ isOpen, onClose, onAddCombo }) {
  const { showToast } = useToast();

  const popcornOptions = [
    { id: 'pop1', name: 'Caramel Popcorn Jumbo', price: 55000, desc: 'Gula karamel manis gurih mentega' },
    { id: 'pop2', name: 'Classic Butter Salty Popcorn', price: 50000, desc: 'Rasa mentega asin klasik bioskop' },
    { id: 'pop3', name: 'Cheese Cheddar Supreme Popcorn', price: 55000, desc: 'Bumbu keju cheddar melimpah' }
  ];

  const drinkOptions = [
    { id: 'drk1', name: 'Coca-Cola Zero Ice Large', price: 30000, desc: 'Soda dingin tanpa gula' },
    { id: 'drk2', name: 'CineFlix Artisan Roasted Coffee', price: 38000, desc: 'Kopi susu gula aren barista' },
    { id: 'drk3', name: 'Fruity Sparkling Soda Refresher', price: 35000, desc: 'Sirup berry segar soda selasih' }
  ];

  const snackOptions = [
    { id: 'snk1', name: 'Tanpa Camilan Tambahan', price: 0, desc: 'Hanya paket Popcorn + Minuman' },
    { id: 'snk2', name: 'Nachos with Warm Cheese Dip', price: 48000, desc: 'Tortilla renyah saus keju cheddar' },
    { id: 'snk3', name: 'Crispy Crinkle-Cut Fries', price: 35000, desc: 'Kentang goreng renyah saus BBQ' }
  ];

  const [selectedPopcorn, setSelectedPopcorn] = useState(popcornOptions[0]);
  const [selectedDrink, setSelectedDrink] = useState(drinkOptions[0]);
  const [selectedSnack, setSelectedSnack] = useState(snackOptions[0]);

  if (!isOpen) return null;

  const normalSubtotal = selectedPopcorn.price + selectedDrink.price + selectedSnack.price;
  const discountAmount = Math.round(normalSubtotal * 0.20); // 20% discount bundling
  const comboPrice = normalSubtotal - discountAmount;

  const handleApplyCombo = () => {
    const comboItem = {
      id: `combo_custom_${Date.now()}`,
      name: `Paket Hemat Bundling (${selectedPopcorn.name.split(' ')[0]} + ${selectedDrink.name.split(' ')[0]}${selectedSnack.price > 0 ? ' + ' + selectedSnack.name.split(' ')[0] : ''})`,
      price: comboPrice,
      originalPrice: normalSubtotal,
      quantity: 1,
      image: 'assets/food2.png',
      details: [selectedPopcorn.name, selectedDrink.name, selectedSnack.price > 0 ? selectedSnack.name : null].filter(Boolean),
      discount: discountAmount
    };

    if (onAddCombo) onAddCombo(comboItem);
    showToast(`Paket Combo berhasil ditambahkan! Anda hemat Rp ${discountAmount.toLocaleString('id-ID')}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#141424] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white my-6 max-h-[90vh] flex flex-col">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-purple-700 p-6 text-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1 text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CUSTOM CONCESSION BUNDLER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Paket Bundling Makanan Hemat 20%
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Padukan popcorn, minuman, dan camilan pilihan Anda dengan diskon instan!
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Step 1: Popcorn */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              1. Pilih Varian Popcorn:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {popcornOptions.map(pop => (
                <button
                  key={pop.id}
                  type="button"
                  onClick={() => setSelectedPopcorn(pop)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedPopcorn.id === pop.id
                      ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{pop.name}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 line-clamp-1">{pop.desc}</span>
                  <span className="text-xs font-black text-amber-400 block mt-1">
                    Rp {pop.price.toLocaleString('id-ID')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Drinks */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
              2. Pilih Minuman Segar:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {drinkOptions.map(drk => (
                <button
                  key={drk.id}
                  type="button"
                  onClick={() => setSelectedDrink(drk)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedDrink.id === drk.id
                      ? 'bg-purple-500/20 border-purple-400 shadow-md shadow-purple-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{drk.name}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 line-clamp-1">{drk.desc}</span>
                  <span className="text-xs font-black text-purple-300 block mt-1">
                    Rp {drk.price.toLocaleString('id-ID')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Snack */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
              3. Tambah Camilan Ekstra (Opsional):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {snackOptions.map(snk => (
                <button
                  key={snk.id}
                  type="button"
                  onClick={() => setSelectedSnack(snk)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedSnack.id === snk.id
                      ? 'bg-blue-500/20 border-blue-400 shadow-md shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{snk.name}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 line-clamp-1">{snk.desc}</span>
                  <span className="text-xs font-black text-blue-300 block mt-1">
                    {snk.price === 0 ? 'Gratis / Lewati' : `Rp ${snk.price.toLocaleString('id-ID')}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bundle Price Calculation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="line-through text-xs text-gray-400">
                  Rp {normalSubtotal.toLocaleString('id-ID')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                  DISKON 20% (HEMAT Rp {discountAmount.toLocaleString('id-ID')})
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-400 block mt-0.5">
                Rp {comboPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleApplyCombo}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan Paket</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
