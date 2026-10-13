import React, { useState } from 'react';
import { Gift, Heart, Film, Sparkles, Send, Copy, CheckCircle2, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { giftCardThemes, giftCardPresets } from '../data/giftCardsData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export default function GiftCards() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedTheme, setSelectedTheme] = useState(giftCardThemes[0]);
  const [selectedAmount, setSelectedAmount] = useState(giftCardPresets[1].amount);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('Selamat menikmati tontonan film terbaik di bioskop CineFlix!');
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);

  // Stored gift cards in localStorage wallet
  const [savedGiftCards, setSavedGiftCards] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_wallet_gift_cards');
      return saved ? JSON.parse(saved) : [
        {
          code: "GIFT-FLIX-202610",
          amount: 200000,
          themeName: "Birthday Cinema Bash",
          from: "Bagas Dwi",
          message: "Selamat ulang tahun! Traktir nonton film favoritmu!",
          date: "10 Okt 2026",
          status: "Aktif & Siap Pakai"
        }
      ];
    } catch {
      return [];
    }
  });

  const handleBuyGiftCard = (e) => {
    e.preventDefault();
    const code = `GIFT-FLIX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCard = {
      code,
      amount: selectedAmount,
      themeName: selectedTheme.name,
      from: user ? user.name : "Teman Spesial",
      to: recipientName || "Sahabat Terbaik",
      email: recipientEmail,
      message: personalMessage,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: "Aktif & Siap Pakai"
    };

    const updated = [newCard, ...savedGiftCards];
    setSavedGiftCards(updated);
    localStorage.setItem('cineflix_wallet_gift_cards', JSON.stringify(updated));
    setGeneratedCard(newCard);
    setIsGenerated(true);

    showToast(`E-Gift Card ${code} berhasil diterbitkan!`, 'success');

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode voucher ${code} berhasil disalin! Masukkan saat checkout tiket.`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5" /> CineFlix Digital Gift Card
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] tracking-wide">
          E-GIFT CARD & VOUCHER NONTON
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
          Kado terindah untuk sahabat, pasangan, atau keluarga. Hadiahkan saldo tiket bioskop & camilan yang bisa langsung digunakan kapan saja!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center lg:text-left">
              Pratinjau Kartu Hadiah Digital:
            </span>

            {/* Simulated Metallic Foil Gift Card */}
            <div className={`aspect-[16/10] rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${selectedTheme.gradient} text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 border-white/20 transition-all duration-500 hover:scale-[1.02]`}>
              
              {/* Shimmer Ambient Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 block">OFFICIAL CINEFLIX GIFT PASS</span>
                  <h3 className="text-lg font-black font-['Cinzel',serif] tracking-wider">CINEFLIX</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <Gift className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              {/* Card Center Message */}
              <div className="relative z-10 space-y-1 my-2">
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">
                  {selectedTheme.name}
                </span>
                <p className="text-xs sm:text-sm text-white/90 italic font-medium line-clamp-2">
                  "{personalMessage}"
                </p>
                {recipientName && (
                  <span className="text-xs font-bold text-white block mt-1">
                    Kepada: <strong className="text-amber-300">{recipientName}</strong>
                  </span>
                )}
              </div>

              {/* Card Footer Balance */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[9px] uppercase tracking-wider opacity-80 block">Nilai Saldo Hadiah</span>
                  <span className="text-2xl font-black text-amber-300 drop-shadow-md">
                    Rp {selectedAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="font-mono text-[10px] opacity-75 bg-black/30 px-2.5 py-1 rounded-full border border-white/10">
                  VOUCHER PASS
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              💡 Saldo voucher ini dapat dipakai untuk pembelian tiket film bioskop maupun makanan di seluruh cabang CineFlix.
            </p>
          </div>
        </div>

        {/* Right Column: Customizer & Purchase Form */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* Step 1: Theme Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                1. Pilih Tema Desain Kartu Hadiah:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {giftCardThemes.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSelectedTheme(th)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTheme.id === th.id
                        ? 'bg-purple-600/20 border-purple-400 shadow-md shadow-purple-500/10'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{th.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{th.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Amount Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                2. Pilih Nominal Saldo:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {giftCardPresets.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => setSelectedAmount(preset.amount)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedAmount === preset.amount
                        ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold block">{preset.label}</span>
                    <span className="text-[9px] text-amber-300 block mt-0.5 font-semibold">{preset.bonus}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Recipient & Personal Note */}
            <form onSubmit={handleBuyGiftCard} className="space-y-4 pt-2 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Nama Penerima Kado:
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Jessica / Teman Terbaik"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Email Penerima (Notifikasi Hadiah):
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="jessica@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Pesan Kartu Ucapan Personal:
                </label>
                <textarea
                  rows={2}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-[#2575fc] text-white font-black text-sm shadow-xl shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-5 h-5 text-amber-300" />
                <span>Terbitkan E-Gift Card (Rp {selectedAmount.toLocaleString('id-ID')})</span>
              </button>
            </form>

          </div>

          {/* Stored Gift Cards Wallet */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="font-black text-lg text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Dompet Kartu Hadiah & Voucher Anda ({savedGiftCards.length})</span>
            </h3>

            <div className="space-y-3">
              {savedGiftCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 text-sm bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30">
                        {card.code}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        ✓ {card.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      Tema: {card.themeName} • Saldo: <strong className="text-white">Rp {card.amount.toLocaleString('id-ID')}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(card.code)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode Voucher</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
