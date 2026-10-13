import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Halo! Saya AI Assistant CineFlix. Ada yang bisa saya bantu seputar film, pemesanan tiket, bioskop, atau makanan?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    "Cara pesan tiket?",
    "Lokasi bioskop di mana saja?",
    "Berapa harga tiket?",
    "Metode pembayaran apa saja?",
    "Ada menu makanan apa?"
  ];

  const knowledgeBase = [
    {
      keywords: [/cara pesan|booking|pesan tiket|reservasi|beli tiket/i],
      answer: "Langkah mudah pesan tiket di CineFlix:\n1. Pilih film di halaman Home atau Movie Details.\n2. Klik tombol 'Pesan Tiket'.\n3. Pilih bioskop, tanggal tayang, dan jam tayang.\n4. Tentukan kursi favorit Anda di studio.\n5. Pilih metode pembayaran (GoPay, DANA, ShopeePay, Kartu Kredit) dan dapatkan e-tiket ber-barcode secara instan!"
    },
    {
      keywords: [/lokasi|alamat|bioskop|cabang|dimana/i],
      answer: "CineFlix saat ini hadir di 3 lokasi premier:\n1. CINEFLIX RASUNA SAID (Epicentrum Walk Lt. 3, Jakarta Selatan)\n2. CINEFLIX DAGO ATAS (Dago Highlands Plaza Lt. 2, Bandung)\n3. CINEFLIX UBUD RAYA (Ubud Sunset Pavilion, Bali)"
    },
    {
      keywords: [/harga|tarif|biaya|berapa/i],
      answer: "Daftar tarif tiket bioskop CineFlix:\n- CINEFLIX RASUNA SAID: Weekday Rp 75.000 | Weekend Rp 85.000\n- CINEFLIX DAGO ATAS: Weekday Rp 80.000 | Weekend Rp 90.000\n- CINEFLIX UBUD RAYA: Weekday Rp 85.000 | Weekend Rp 95.000"
    },
    {
      keywords: [/bayar|metode pembayaran|pembayaran|gopay|dana|shopeepay/i],
      answer: "Kami menerima berbagai opsi pembayaran instan & aman:\n- E-Wallet: GoPay, ShopeePay, DANA\n- Global & Card: PayPal, Kartu Kredit / Debit Visa / Mastercard\n- Virtual Account Bank"
    },
    {
      keywords: [/makan|snack|popcorn|minum|food|beverage/i],
      answer: "Menu favorit Flix Foods kami meliputi:\n- Caramel Popcorn Jumbo (Rp 55.000)\n- Combo Duo Movie Snack (Rp 95.000)\n- Nachos Cheese Supreme (Rp 48.000)\n- Crispy Chicken Bites & Fries (Rp 52.000)\n- Artisan Roasted Coffee (Rp 38.000)\nBisa dipesan langsung di menu Flix Foods!"
    },
    {
      keywords: [/event|festival|maraton|nolan|marvel/i],
      answer: "Flix Events menyelenggarakan acara eksklusif seperti Marvel 10th Anniversary, Anime Film Festival, Cinema Under The Stars Bali, dan Nolan 70mm Retrospective. Cek tab Flix Events untuk reservasi pass tiket!"
    }
  ];

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botAnswer = "Maaf, saya belum mengerti pertanyaan Anda. Anda bisa menanyakan tentang: cara pesan tiket, lokasi bioskop, harga tiket, atau menu makanan di CineFlix.";
      
      for (const item of knowledgeBase) {
        if (item.keywords.some(regex => regex.test(query))) {
          botAnswer = item.answer;
          break;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botAnswer
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 text-emerald-300 animate-bounce" />
          <span>Butuh Bantuan?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  AI Assistant CineFlix
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-purple-200">Online 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick chips */}
          <div className="px-3 py-2 bg-black/20 border-b border-white/5 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-gray-200 px-2.5 py-1 rounded-full transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white rounded-tr-none shadow-md shadow-purple-500/10'
                      : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa saja tentang CineFlix..."
              className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
