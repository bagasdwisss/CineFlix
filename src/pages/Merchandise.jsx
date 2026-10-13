import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Filter, Star, Sparkles, Check, 
  Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, 
  Award, QrCode, CreditCard, ChevronRight, X, Heart
} from 'lucide-react';
import { merchData } from '../data/merchData';
import { tumblersData } from '../data/tumblersData';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Merchandise() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [likedItems, setLikedItems] = useState([]);

  // Combine merch & tumblers for full catalog
  const unifiedCatalog = useMemo(() => {
    const formattedTumblers = tumblersData.map(t => ({
      ...t,
      category: "Tumbler Club",
      rating: 4.9,
      reviewsCount: 52,
      originalPrice: t.price + 50000
    }));
    return [...merchData, ...formattedTumblers];
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'Tumbler Club', label: 'Tumbler Club 🥤' },
    { id: 'Collectibles', label: 'Action Figures' },
    { id: 'Prop Replicas', label: 'Prop Replicas' },
    { id: 'Apparel', label: 'Apparel & Jaket' },
    { id: 'Posters & Prints', label: 'Poster Resmi' }
  ];

  const movies = useMemo(() => {
    const set = new Set(unifiedCatalog.map(item => item.movie));
    return ['all', ...Array.from(set)];
  }, [unifiedCatalog]);

  const filteredItems = useMemo(() => {
    return unifiedCatalog.filter(item => {
      const matchCategory = activeTab === 'all' || item.category === activeTab;
      const matchMovie = selectedMovie === 'all' || item.movie === selectedMovie;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.movie.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchMovie && matchSearch;
    });
  }, [unifiedCatalog, activeTab, selectedMovie, searchQuery]);

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        showToast(`Jumlah ${item.name.slice(0, 20)}... bertambah!`, 'success');
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      showToast(`${item.name.slice(0, 25)}... ditambahkan ke keranjang!`, 'success');
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast('Barang dihapus dari keranjang', 'info');
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }, [cart]);

  const toggleLike = (id) => {
    setLikedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Checkout states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '081234567890');
  const [shippingAddress, setShippingAddress] = useState('Jl. Jenderal Sudirman Kav. 21, Jakarta Selatan');
  const [courier, setCourier] = useState('JNE Reguler (Rp 18.000)');
  const [courierFee, setCourierFee] = useState(18000);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCourierChange = (e) => {
    const val = e.target.value;
    setCourier(val);
    if (val.includes('18.000')) setCourierFee(18000);
    else if (val.includes('25.000')) setCourierFee(25000);
    else if (val.includes('35.000')) setCourierFee(35000);
  };

  const handleProcessOrder = () => {
    if (!customerName || !shippingAddress || !customerPhone) {
      showToast('Lengkapi data pengiriman terlebih dahulu!', 'error');
      return;
    }

    const orderId = 'FLIX-MRCH-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId,
      items: cart,
      subtotal: cartTotal,
      courierFee,
      total: cartTotal + courierFee,
      customerName,
      customerPhone,
      shippingAddress,
      courier,
      paymentMethod,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setOrderSuccess(orderData);
    setCart([]);
    showToast('Pesanan berhasil dibuat! Nomor resi akan dikirim via WhatsApp.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/20 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Flix Merch & Tumbler Club
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Merchandise Resmi &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Koleksi Eksklusif</span> Film
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Dapatkan figur kolektor skala 1:6, replika prop berlisensi studio Hollywood, tumbler edisi terbatas dengan hak istimewa isi ulang sepuasnya, hingga jaket varsity cinema resmi.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Berlisensi Resmi</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Kirim Seluruh Indonesia</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sertifikat Hologram Keaslian</span>
            </div>
          </div>
        </div>

        {/* Floating Cart Button */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white text-purple-900 text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tumbler Club Featured Spotlight Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
            🥤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                Keanggotaan Eksklusif
              </span>
              <span className="text-xs text-gray-400">Popcorn Tumbler Club</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Beli Tumbler Koleksi, Dapatkan Gratis Isi Ulang Popcorn &amp; Soda!
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Bawa tumbler CineFlix Anda ke bioskop manapun dan nikmati isi ulang minuman gratis serta jalur VIP FnB tanpa antre.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('Tumbler Club')}
          className="whitespace-nowrap px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
        >
          Lihat Tumbler Club
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Movie Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari merchandise atau film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all" className="bg-[#1a103c] text-white">Semua Film</option>
            {movies.filter(m => m !== 'all').map(m => (
              <option key={m} value={m} className="bg-[#1a103c] text-white">{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-gray-400">Coba ubah kata kunci pencarian atau kategori filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const isLiked = likedItems.includes(item.id);
            const inCart = cart.find(c => c.id === item.id);

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-slate-900/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.badge && (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-600/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow-md">
                        {item.badge}
                      </span>
                    )}
                    {item.perk && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-gray-950 font-bold text-[9px] backdrop-blur-md">
                        {item.perk.slice(0, 24)}...
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-pink-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>

                  {/* Movie tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-purple-300 font-semibold truncate">
                    🎬 {item.movie}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => setSelectedItemDetail(item)}
                      className="text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer line-clamp-2"
                    >
                      {item.name}
                    </h3>

                    {/* Rating & Stock */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-white">{item.rating}</span>
                        <span>({item.reviewsCount})</span>
                      </div>
                      <span className="text-emerald-400">Stok: {item.stock}</span>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <div>
                      {item.originalPrice && (
                        <span className="text-[10px] text-gray-500 line-through block">
                          Rp {item.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className="text-base font-black text-white">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-purple-600/30 border border-purple-500/40 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-white hover:text-pink-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white">{inCart.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-white hover:text-pink-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" /> Beli
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#130d2a] border-l border-white/10 h-full flex flex-col justify-between p-6 shadow-2xl">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Keranjang Belanja ({cartCount})</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="max-h-[60vh] overflow-y-auto space-y-4 py-4 pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto" />
                    <p className="text-sm text-gray-400">Keranjang belanja Anda masih kosong.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-[11px] text-purple-300 block">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout Actions */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Subtotal Barang</span>
                  <span className="text-lg font-black text-white">
                    Rp {cartTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  Lanjut ke Pembayaran <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#140e2d] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">Konfirmasi Pengiriman &amp; Checkout</h3>
                <p className="text-xs text-gray-400 mt-0.5">Lengkapi alamat pengiriman merchandise Anda</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="0812xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Alamat Lengkap Pengiriman
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Nama Jalan, Gedung, No Rumah, Kecamatan, Kota, Kode Pos"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Kurir Ekspedisi
                  </label>
                  <select
                    value={courier}
                    onChange={handleCourierChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="JNE Reguler (Rp 18.000)" className="bg-[#140e2d]">JNE Reguler (Rp 18.000, 2-3 hari)</option>
                    <option value="SiCepat Kilat (Rp 25.000)" className="bg-[#140e2d]">SiCepat Kilat (Rp 25.000, 1-2 hari)</option>
                    <option value="GrabExpress Instant (Rp 35.000)" className="bg-[#140e2d]">GrabExpress Instant (Rp 35.000, Hari ini)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="QRIS" className="bg-[#140e2d]">QRIS (GoPay, OVO, Dana, ShopeePay)</option>
                    <option value="BCA Virtual Account" className="bg-[#140e2d]">BCA Virtual Account</option>
                    <option value="Mandiri Virtual Account" className="bg-[#140e2d]">Mandiri Virtual Account</option>
                    <option value="Kartu Kredit / Debit" className="bg-[#140e2d]">Kartu Kredit / Debit Online</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cartCount} Barang)</span>
                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Ongkos Kirim ({courier.split(' ')[0]})</span>
                <span>Rp {courierFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Asuransi Kehilangan &amp; Kerusakan</span>
                <span className="text-emerald-400 font-bold">GRATIS</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
                <span>Total Pembayaran</span>
                <span className="text-emerald-400">Rp {(cartTotal + courierFee).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleProcessOrder}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              Bayar Sekarang via {paymentMethod}
            </button>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#130d2a] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                Pembayaran Berhasil!
              </span>
              <h3 className="text-xl font-black text-white mt-3">Terima Kasih atas Pesanan Anda</h3>
              <p className="text-xs text-gray-400 mt-1">
                Order ID: <span className="text-purple-300 font-mono font-bold">{orderSuccess.orderId}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Penerima:</span>
                <span className="text-white font-semibold">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metode:</span>
                <span className="text-purple-300 font-semibold">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Dibayar:</span>
                <span className="text-emerald-400 font-bold">Rp {orderSuccess.total.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400">
                Resi pengiriman telah dikirimkan ke <span className="text-white font-semibold">{orderSuccess.customerPhone}</span>.
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                setIsCheckoutOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider"
            >
              Kembali ke Toko Merch
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#130d2a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 aspect-square relative bg-slate-900">
              <img src={selectedItemDetail.image} alt={selectedItemDetail.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase">{selectedItemDetail.category}</span>
                  <button onClick={() => setSelectedItemDetail(null)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedItemDetail.name}</h3>
                <p className="text-xs text-purple-300 mt-1">🎬 Film: {selectedItemDetail.movie}</p>

                <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                  {selectedItemDetail.description}
                </p>

                {selectedItemDetail.material && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white/5 text-[11px] text-gray-300">
                    <span className="font-bold text-white">Material: </span>{selectedItemDetail.material}
                  </div>
                )}
                {selectedItemDetail.perk && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    <span className="font-bold">Keuntungan Tumbler Club: </span>{selectedItemDetail.perk}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Harga Resmi</span>
                  <span className="text-xl font-black text-white">
                    Rp {selectedItemDetail.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedItemDetail);
                    setSelectedItemDetail(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs"
                >
                  Tambah Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
