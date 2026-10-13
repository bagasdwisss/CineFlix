import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  id: {
    home: 'Beranda',
    foods: 'Flix Foods',
    events: 'Flix Events',
    merchandise: 'Merchandise',
    giftCards: 'E-Gift Card',
    news: 'Berita',
    profile: 'Profil Saya',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    scanner: 'Gate Scanner',
    searchPlaceholder: 'Cari film, event, atau makanan...',
    bookNow: 'Pesan Tiket',
    seeDetails: 'Lihat Detail',
    selectSeats: 'Pilih Kursi',
    totalPrice: 'Total Harga',
    payNow: 'Bayar Sekarang',
    verifiedTicket: 'Tiket Resmi Terverifikasi',
    downloadTicket: 'Download Gambar Tiket (HD)',
    installApp: 'Install Aplikasi',
    soundEnabled: 'Suara Aktif',
    soundMuted: 'Suara Senyap',
    language: 'Bahasa'
  },
  en: {
    home: 'Home',
    foods: 'Flix Foods',
    events: 'Flix Events',
    merchandise: 'Flix Merch',
    giftCards: 'Gift Cards',
    news: 'News',
    profile: 'My Profile',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    scanner: 'Gate Scanner',
    searchPlaceholder: 'Search movies, events, snacks...',
    bookNow: 'Book Now',
    seeDetails: 'View Details',
    selectSeats: 'Select Seats',
    totalPrice: 'Total Price',
    payNow: 'Pay Now',
    verifiedTicket: 'Official Verified Ticket',
    downloadTicket: 'Download Ticket (HD Image)',
    installApp: 'Install App',
    soundEnabled: 'Sound On',
    soundMuted: 'Sound Muted',
    language: 'Language'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('cineflix_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('cineflix_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'id',
      setLang: () => {},
      toggleLanguage: () => {},
      t: (key) => key
    };
  }
  return context;
};
