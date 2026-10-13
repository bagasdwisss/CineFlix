import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  id: {
    // Navigation & Common
    home: 'Film',
    foods: 'Flix Foods',
    events: 'Events',
    merchandise: 'Merch',
    giftCards: 'Gift Cards',
    news: 'Berita',
    profile: 'Profil Saya',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    scanner: 'Gate Scanner',
    searchPlaceholder: 'Cari judul film, genre, atau aktor...',
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
    language: 'Bahasa',
    lightMode: 'Mode Terang',
    darkMode: 'Mode Gelap',
    displayTheme: 'Mode Tampilan',
    switchToLight: 'Aktifkan Mode Terang',
    switchToDark: 'Aktifkan Mode Gelap',
    
    // Home Page
    featuredSpotlight: 'Pilihan Sorotan',
    nowShowing: 'Sedang Tayang di Bioskop',
    nowShowingSub: 'Tonton film blockbuster terbaik dengan kualitas Dolby Atmos & IMAX',
    comingSoon: 'Segera Hadir di Bioskop',
    comingSoonSub: 'Daftar film menarik yang akan segera tayang di layar CineFlix',
    filterGenre: 'Kategori Genre',
    allGenres: 'Semua Genre',
    sortBy: 'Urutkan:',
    sortDefault: 'Default / Terpopuler',
    sortRating: 'Rating Tertinggi',
    sortTitle: 'Nama Film (A - Z)',
    noMoviesFound: 'Tidak ada film yang cocok dengan pencarian Anda.',
    watchTrailer: 'Tonton Trailer',
    exclusiveEventsTitle: 'Event & Festival Sinematik CineFlix',
    exclusiveEventsSub: 'Ikuti perayaan premier film, meet & greet aktor, dan festival komik',
    exploreFoodsTitle: 'Flix Foods & Concession Bioskop',
    exploreFoodsSub: 'Pesan popcorn karamel hangat dan minuman segar langsung siap ambil di konter',
    whyCineFlix: 'Kenapa Memilih Bioskop CineFlix?',
    why1Title: 'Layar IMAX & Laser 4K',
    why1Desc: 'Proyeksi gambar ultra tajam dengan kontras mendalam dan kecerahan spektakuler.',
    why2Title: 'Tata Suara Dolby Atmos',
    why2Desc: 'Audio 360 derajat multidimensi yang membuat Anda seolah berada di dalam adegan.',
    why3Title: 'E-Tiket & Scanner Cepat',
    why3Desc: 'Check-in pintu studio tanpa antre, cukup scan barcode dari layar smartphone Anda.',
    why4Title: 'Kursi VIP Recliner & Bed',
    why4Desc: 'Kenyamanan kelas satu dengan sandaran elektrik 180° dan pengantar makanan langsung.',

    // Movie Detail
    synopsis: 'Sinopsis Film',
    director: 'Sutradara (Director)',
    writers: 'Penulis Skenario',
    cast: 'Pemeran Utama (Cast)',
    duration: 'Durasi',
    genre: 'Genre',
    ageRating: 'Klasifikasi Usia',
    releaseDate: 'Tanggal Rilis',
    boxOffice: 'Pendapatan Box Office',
    awards: 'Penghargaan',
    productionInfo: 'Informasi Produksi',
    showingInStudios: 'Tayang di studio:',
    bookCinemaTicket: 'Pesan Tiket Bioskop',
    bookTicketsNow: 'Pesan Tiket Sekarang',
    userReviews: 'Ulasan & Rating Komunitas',
    writeReview: 'Tulis Ulasan Film',
    noReviewsYet: 'Belum ada ulasan untuk film ini. Jadilah yang pertama memberikan review!',
    backToHome: 'Kembali ke Beranda',
    watchlist: 'Watchlist',
    saved: 'Tersimpan',

    // Booking Page
    step1of3: 'Langkah 1 dari 3',
    bookingTitle: 'PESAN TIKET BIOSKOP',
    bookingSubtitle: 'Pilih film, tanggal, lokasi bioskop, dan jam tayang yang Anda inginkan.',
    step1Movie: '1. Pilih Film',
    step2Date: '2. Pilih Tanggal Tayang',
    step3Cinema: '3. Pilih Bioskop',
    step4Time: '4. Pilih Jam Tayang',
    ticketPriceLabel: 'Harga:',
    perTicket: '/ tiket',
    passed: 'Berlalu',
    proceedToSeats: 'Pilih Kursi Bioskop',

    // Seat Selection Page
    step2of3: 'Langkah 2 dari 3',
    seatSelectionTitle: 'PILIH KURSI BIOSKOP',
    seatSelectionSubtitle: 'Pilih posisi tempat duduk terbaik untuk kenyamanan menonton maksimal.',
    cinemaScreen: 'LAYAR BIOSKOP UTAMA',
    screenInstruction: 'Arah Pandang Layar Depan Studio',
    seatAvailable: 'Tersedia',
    seatSelected: 'Dipilih',
    seatOccupied: 'Terisi',
    selectedSeatsCount: 'Kursi Dipilih',
    selectedSeatsLabel: 'Tempat Duduk Terpilih',
    noSeatsSelected: 'Belum ada kursi dipilih',
    seatSubtotal: 'Subtotal Kursi',
    deliverToSeatActive: 'Antar ke Kursi Aktif',
    previewPOV: 'Pratinjau Sudut Pandang 3D (POV)',
    splitBill: 'Pesan Bareng (Split Bill)',
    fnbCombo: 'Paket Combo Hemat',
    proceedToPayment: 'Lanjut ke Pembayaran',
    weekend: 'Akhir Pekan',
    weekday: 'Hari Kerja',

    // Flix Foods Page
    foodsBadge: 'CineFlix Concession & FnB',
    foodsTitle: 'FLIX FOODS & DRINKS',
    foodsSubtitle: 'Pesan popcorn hangat, minuman dingin, dan camilan favorit secara online. Langsung ambil di konter tanpa antre!',
    pickupAtCinema: 'Ambil di Bioskop:',
    cartLabel: 'Keranjang',
    emptyCartTitle: 'Keranjang Anda Kosong',
    emptyCartDesc: 'Tambahkan menu lezat untuk menemani tontonan bioskop Anda.',
    addToCart: '+ Keranjang',
    foodCategories: {
      All: 'Semua Menu',
      Popcorn: 'Popcorn',
      Combo: 'Paket Combo',
      Snack: 'Camilan',
      'Hot Meal': 'Makanan Berat',
      Beverage: 'Minuman'
    },
    orderFoodNow: 'Lanjut ke Pembayaran Makanan',
    pickupNotes: 'Catatan Pesanan Khusus (opsional):',

    // Events Page
    eventsBadge: 'Pengalaman Sinematik Eksklusif',
    eventsTitle: 'FLIX EVENTS & FESTIVALS',
    eventsSubtitle: 'Nikmati festival film eksklusif, screening spesial karya sutradara legendaris, dan premiere karpet merah tak terlupakan.',
    getEventPass: 'Pilih Tiket Pass',
    eventDate: 'Tanggal Event',
    eventTime: 'Waktu Pelaksanaan',
    eventLocation: 'Lokasi Acara',
    eventPassPurchased: 'Pass Terkonfirmasi',

    // News Page
    newsBadge: 'Kabar Terkini Dunia Perfilman',
    newsTitle: 'FLIX NEWS & ARTICLES',
    newsSubtitle: 'Berita film terbaru, rumor Marvel & DC, rekor box office global, dan ulasan mendalam perfilman.',
    searchNewsPlaceholder: 'Cari berita film...',
    readMore: 'Baca Selengkapnya',
    byAuthor: 'Oleh',

    // Merch Page
    merchBadge: 'Toko Merchandise Resmi',
    merchTitle: 'FLIX MERCHANDISE',
    merchSubtitle: 'Koleksi merchandise eksklusif, tumbler cinema club, action figure, dan poster film original berlisensi.',
    tumblerClub: 'Tumbler Club 🥤',
    collectibles: 'Action Figures',
    apparel: 'Apparel & Kaos',
    posters: 'Poster Resmi',
    allMerch: 'Semua Koleksi',

    // Gift Cards Page
    giftBadge: 'Kartu Hadiah Sinema',
    giftTitle: 'FLIX E-GIFT CARDS',
    giftSubtitle: 'Kirim hadiah tiket bioskop dan camilan spesial kepada sahabat, kerabat, atau orang tersayang.',
    createGiftCard: 'Buat Gift Card',
    recipientName: 'Nama Penerima',
    recipientEmail: 'Email Penerima',
    giftMessage: 'Pesan Personal',
    buyGiftCard: 'Beli & Kirim Gift Card',

    // Payment & Receipt
    paymentSummary: 'Ringkasan Pemesanan',
    choosePaymentMethod: 'Pilih Metode Pembayaran',
    serviceFee: 'Biaya Layanan & Pajak',
    grandTotal: 'Total Pembayaran',
    paymentSuccess: 'PEMBAYARAN BERHASIL!',
    ticketIssued: 'E-Tiket resmi Anda telah terbit dan siap digunakan di bioskop.',
    bookingCode: 'Kode Booking',
    showtime: 'Jadwal Tayang',
    cinemaStudio: 'Bioskop & Studio',
    seatsOrdered: 'Nomor Kursi',
    printTicket: 'Cetak Tiket',
    testScanTicket: 'Uji Coba Scan Tiket Ini',
    viewInProfile: 'Lihat di Profil Saya',

    // Profile Page
    profileTitle: 'Akun & Profil Pengguna',
    myTicketsTab: 'Tiket Saya',
    myWatchlistTab: 'Watchlist Film',
    passportTab: 'Paspor Bioskop',
    settingsTab: 'Edit Profil',
    securityTab: 'Keamanan Akun',
    flixPoints: 'Flix Points',
    memberTier: 'Member VIP',

    // Footer
    footerDesc: 'Jaringan bioskop modern terkemuka di Indonesia. Nikmati pengalaman menonton film terbaik dengan teknologi audio visual termutakhir.',
    quickLinks: 'Tautan Cepat',
    cinemas: 'Jaringan Bioskop',
    contactSupport: 'Bantuan & Layanan',
    copyright: 'Hak Cipta Dilindungi Undang-Undang.',
    rightsReserved: 'Seluruh hak cipta dilindungi CineFlix Cinema Corporation.'
  },
  en: {
    // Navigation & Common
    home: 'Movies',
    foods: 'Flix Foods',
    events: 'Events',
    merchandise: 'Merch',
    giftCards: 'Gift Cards',
    news: 'News',
    profile: 'My Profile',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    scanner: 'Gate Scanner',
    searchPlaceholder: 'Search movie title, genre, or actor...',
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
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    displayTheme: 'Theme Mode',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',

    // Home Page
    featuredSpotlight: 'Featured Spotlight',
    nowShowing: 'Now Showing in Cinemas',
    nowShowingSub: 'Watch the best blockbusters with premium Dolby Atmos & IMAX projection',
    comingSoon: 'Coming Soon to Theaters',
    comingSoonSub: 'Exciting upcoming movie releases arriving soon at CineFlix screens',
    filterGenre: 'Genre Category',
    allGenres: 'All Genres',
    sortBy: 'Sort By:',
    sortDefault: 'Default / Popular',
    sortRating: 'Highest Rating',
    sortTitle: 'Title (A - Z)',
    noMoviesFound: 'No movies match your current search filter.',
    watchTrailer: 'Watch Trailer',
    exclusiveEventsTitle: 'CineFlix Cinematic Events & Festivals',
    exclusiveEventsSub: 'Attend premier screenings, actor meet-and-greets, and comic festivals',
    exploreFoodsTitle: 'Flix Foods & Cinema Concessions',
    exploreFoodsSub: 'Order warm caramel popcorn and fresh drinks ready for instant counter pickup',
    whyCineFlix: 'Why Choose CineFlix Cinema?',
    why1Title: 'IMAX & 4K Laser Screens',
    why1Desc: 'Ultra-crisp picture projection with extraordinary contrast and spectacular brightness.',
    why2Title: 'Dolby Atmos Spatial Sound',
    why2Desc: 'Multidimensional 360-degree soundscape that immerses you directly inside the film.',
    why3Title: 'Express E-Ticket Scanner',
    why3Desc: 'Zero-wait studio entrance. Simply scan your digital barcode from your phone screen.',
    why4Title: 'VIP Recliner & Bed Loungers',
    why4Desc: 'First-class comfort with 180-degree electric reclining and seat-delivered food service.',

    // Movie Detail
    synopsis: 'Movie Synopsis',
    director: 'Director',
    writers: 'Screenplay / Writers',
    cast: 'Lead Cast',
    duration: 'Duration',
    genre: 'Genre',
    ageRating: 'Age Rating',
    releaseDate: 'Release Date',
    boxOffice: 'Box Office Revenue',
    awards: 'Awards',
    productionInfo: 'Production Details',
    showingInStudios: 'Showing in studios:',
    bookCinemaTicket: 'Book Cinema Tickets',
    bookTicketsNow: 'Book Tickets Now',
    userReviews: 'Community Reviews & Ratings',
    writeReview: 'Write a Movie Review',
    noReviewsYet: 'No reviews yet for this movie. Be the first to share your thoughts!',
    backToHome: 'Back to Home',
    watchlist: 'Watchlist',
    saved: 'Saved',

    // Booking Page
    step1of3: 'Step 1 of 3',
    bookingTitle: 'BOOK CINEMA TICKETS',
    bookingSubtitle: 'Choose your preferred movie, date, cinema location, and showtime.',
    step1Movie: '1. Select Movie',
    step2Date: '2. Select Screening Date',
    step3Cinema: '3. Select Cinema',
    step4Time: '4. Select Showtime',
    ticketPriceLabel: 'Price:',
    perTicket: '/ ticket',
    passed: 'Passed',
    proceedToSeats: 'Select Cinema Seats',

    // Seat Selection Page
    step2of3: 'Step 2 of 3',
    seatSelectionTitle: 'SELECT CINEMA SEATS',
    seatSelectionSubtitle: 'Choose your best seating positions for an optimal viewing experience.',
    cinemaScreen: 'MAIN CINEMA SCREEN',
    screenInstruction: 'Studio Screen Facing Direction',
    seatAvailable: 'Available',
    seatSelected: 'Selected',
    seatOccupied: 'Occupied',
    selectedSeatsCount: 'Seats Selected',
    selectedSeatsLabel: 'Selected Seats',
    noSeatsSelected: 'No seats selected yet',
    seatSubtotal: 'Seats Subtotal',
    deliverToSeatActive: 'Deliver to Seat Active',
    previewPOV: '3D Screen Vision (POV)',
    splitBill: 'Group Booking (Split Bill)',
    fnbCombo: 'Value FnB Combo',
    proceedToPayment: 'Proceed to Payment',
    weekend: 'Weekend',
    weekday: 'Weekday',

    // Flix Foods Page
    foodsBadge: 'CineFlix Concession & FnB',
    foodsTitle: 'FLIX FOODS & DRINKS',
    foodsSubtitle: 'Order warm popcorn, fresh chilled drinks, and favorite snacks online. Fast counter pickup without waiting!',
    pickupAtCinema: 'Pickup Cinema:',
    cartLabel: 'Cart',
    emptyCartTitle: 'Your Cart is Empty',
    emptyCartDesc: 'Add delicious snacks and drinks to accompany your cinema screening.',
    addToCart: '+ Add to Cart',
    foodCategories: {
      All: 'All Items',
      Popcorn: 'Popcorn',
      Combo: 'Combo Packs',
      Snack: 'Snacks',
      'Hot Meal': 'Hot Meals',
      Beverage: 'Drinks'
    },
    orderFoodNow: 'Proceed to Food Checkout',
    pickupNotes: 'Special Order Notes (optional):',

    // Events Page
    eventsBadge: 'Exclusive Cinematic Experience',
    eventsTitle: 'FLIX EVENTS & FESTIVALS',
    eventsSubtitle: 'Experience exclusive film festivals, director retrospectives, and unforgettable red-carpet screenings.',
    getEventPass: 'Get Event Pass',
    eventDate: 'Event Date',
    eventTime: 'Event Time',
    eventLocation: 'Venue Location',
    eventPassPurchased: 'Pass Confirmed',

    // News Page
    newsBadge: 'Latest Cinema News',
    newsTitle: 'FLIX NEWS & ARTICLES',
    newsSubtitle: 'Catch the latest movie updates, Marvel & DC rumors, global box office records, and in-depth reviews.',
    searchNewsPlaceholder: 'Search movie news...',
    readMore: 'Read More',
    byAuthor: 'By',

    // Merch Page
    merchBadge: 'Official Merch Store',
    merchTitle: 'FLIX MERCHANDISE',
    merchSubtitle: 'Exclusive movie merchandise collection, cinema club tumblers, action figures, and authentic licensed posters.',
    tumblerClub: 'Tumbler Club 🥤',
    collectibles: 'Action Figures',
    apparel: 'Apparel & T-Shirts',
    posters: 'Official Posters',
    allMerch: 'All Collections',

    // Gift Cards Page
    giftBadge: 'Cinema Gift Cards',
    giftTitle: 'FLIX E-GIFT CARDS',
    giftSubtitle: 'Send the gift of cinema tickets and gourmet popcorn to friends, family, or loved ones.',
    createGiftCard: 'Create Gift Card',
    recipientName: 'Recipient Name',
    recipientEmail: 'Recipient Email',
    giftMessage: 'Personal Message',
    buyGiftCard: 'Buy & Send Gift Card',

    // Payment & Receipt
    paymentSummary: 'Booking Summary',
    choosePaymentMethod: 'Select Payment Method',
    serviceFee: 'Service Fee & Taxes',
    grandTotal: 'Total Payment',
    paymentSuccess: 'PAYMENT SUCCESSFUL!',
    ticketIssued: 'Your official E-Ticket has been issued and is ready for studio entry.',
    bookingCode: 'Booking Code',
    showtime: 'Showtime',
    cinemaStudio: 'Cinema & Studio',
    seatsOrdered: 'Seat Numbers',
    printTicket: 'Print Ticket',
    testScanTicket: 'Test Scan This Ticket',
    viewInProfile: 'View in My Profile',

    // Profile Page
    profileTitle: 'User Profile & Account',
    myTicketsTab: 'My Tickets',
    myWatchlistTab: 'Watchlist',
    passportTab: 'Cinema Passport',
    settingsTab: 'Edit Profile',
    securityTab: 'Account Security',
    flixPoints: 'Flix Points',
    memberTier: 'VIP Member',

    // Footer
    footerDesc: 'Leading modern cinema network in Indonesia. Enjoy the ultimate moviegoing experience equipped with state-of-the-art audiovisual technology.',
    quickLinks: 'Quick Links',
    cinemas: 'Cinema Locations',
    contactSupport: 'Customer Support',
    copyright: 'All Rights Reserved.',
    rightsReserved: 'All copyrights reserved by CineFlix Cinema Corporation.'
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

  const t = (key, fallback = '') => {
    const value = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['id']?.[key];
    if (value !== undefined) return value;
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isId: lang === 'id', isEn: lang === 'en' }}>
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
      t: (key, fallback = '') => fallback || key,
      isId: true,
      isEn: false
    };
  }
  return context;
};
