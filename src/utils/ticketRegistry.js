/**
 * Global Ticket Registry for CineFlix
 * Provides persistent storage and retrieval for all issued cinema tickets,
 * event passes, and food pickup vouchers, enabling real verification when scanning barcodes / QR codes.
 */

const STORAGE_KEY = 'cineflix_verified_tickets';

// Default initial demo tickets (Movie, Event, and Food)
const INITIAL_TICKETS = [
  {
    bookingId: "FLIX-98214532",
    orderType: "movie",
    movie: "Avatar: The Way of Water",
    movieId: "movie3",
    poster: "assets/Avatar-The-Way-of-Water-2022.jpg",
    cinema: "CINEFLIX RASUNA SAID",
    studio: "Studio 1 (Dolby Atmos)",
    date: "14 Mei 2026",
    time: "17:45",
    seats: ["F8", "F9"],
    totalPrice: 150000,
    grandTotal: 150000,
    paymentMethod: "GoPay",
    status: "LUNAS & VALID",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    paymentDate: "12 Mei 2026, 14:20 WIB",
    ticketCount: 2,
    serviceFee: 4000,
    gate: "Gate 1 • Studio 1"
  },
  {
    bookingId: "CNF-77492015",
    orderType: "movie",
    movie: "Avengers: Endgame",
    movieId: "movie2",
    poster: "assets/Avengers-Endgame.jpg",
    cinema: "CINEFLIX GRAND INDONESIA",
    studio: "Studio IMAX 3D",
    date: "20 Mei 2026",
    time: "20:15",
    seats: ["D10", "D11", "D12"],
    totalPrice: 225000,
    grandTotal: 225000,
    paymentMethod: "DANA Wallet",
    status: "LUNAS & VALID",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    paymentDate: "10 Mei 2026, 18:30 WIB",
    ticketCount: 3,
    serviceFee: 4000,
    gate: "Gate 3 • IMAX 3D"
  },
  {
    bookingId: "EVT-88291043",
    orderType: "event",
    movie: "Marvel Studios 10th Anniversary Celebration",
    poster: "assets/event1.jpg",
    cinema: "CineFlix Grand Indonesia, Jakarta",
    studio: "Main Exhibition Hall & Studio IMAX",
    date: "15-17 April 2026",
    time: "10:00 - 22:00 WIB",
    seats: ["VIP All-Access Pass (x1)", "Premium Pass (x1)"],
    totalPrice: 2250000,
    grandTotal: 2250000,
    paymentMethod: "GoPay",
    status: "LUNAS & VALID",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    paymentDate: "11 Mei 2026, 09:15 WIB",
    ticketCount: 2,
    serviceFee: 112500,
    gate: "Gate VIP 1 • Pintu Khusus Festival"
  },
  {
    bookingId: "FOOD-39102941",
    orderType: "food",
    movie: "CineFlix Concession FnB Combo",
    poster: "assets/food2.png",
    cinema: "CineFlix Grand Indonesia",
    studio: "Concession Counter Lantai 5",
    date: "Hari Ini",
    time: "Siap Diambil",
    seats: ["Caramel Popcorn Jumbo (x1)", "Artisan Roasted Coffee (x2)"],
    totalPrice: 131000,
    grandTotal: 131000,
    paymentMethod: "ShopeePay",
    status: "LUNAS & SIAP DIAMBIL",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    paymentDate: "Hari ini, 12:45 WIB",
    ticketCount: 3,
    serviceFee: 0,
    gate: "Counter FnB 2 • Jalur Cepat Online"
  }
];

export function getAllTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TICKETS;
  } catch (e) {
    console.error('Failed to load tickets from registry:', e);
    return INITIAL_TICKETS;
  }
}

export function saveTicket(ticket) {
  if (!ticket || !ticket.bookingId) return;
  try {
    const tickets = getAllTickets();
    const existingIndex = tickets.findIndex(
      t => String(t.bookingId).trim().toUpperCase() === String(ticket.bookingId).trim().toUpperCase()
    );

    const bId = String(ticket.bookingId).trim().toUpperCase();
    const inferredType = ticket.orderType || (
      bId.startsWith('EVT') ? 'event' : bId.startsWith('FOOD') ? 'food' : 'movie'
    );
    
    // Normalize ticket structure
    const normalizedTicket = {
      ...ticket,
      orderType: inferredType,
      studio: ticket.studio || ticket.cinemaStudio || (inferredType === 'food' ? 'Concession Counter' : 'Studio Reguler'),
      poster: ticket.poster || (inferredType === 'food' ? 'assets/food1.png' : 'assets/avatar.jpg'),
      status: ticket.status || 'LUNAS & VALID',
      paymentDate: ticket.paymentDate || ticket.paymentTime || new Date().toLocaleString('id-ID'),
      buyerName: ticket.buyerName || ticket.name || 'Pelanggan CineFlix',
      gate: ticket.gate || (inferredType === 'food' ? 'Counter FnB • Jalur Pengambilan' : 'Gate 1 • Pintu Masuk')
    };

    let updated;
    if (existingIndex > -1) {
      updated = [...tickets];
      updated[existingIndex] = { ...updated[existingIndex], ...normalizedTicket };
    } else {
      updated = [normalizedTicket, ...tickets];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return normalizedTicket;
  } catch (e) {
    console.error('Failed to save ticket to registry:', e);
  }
}

export function getTicketByBookingId(bookingId) {
  if (!bookingId) return null;
  const cleanId = String(bookingId).trim().toUpperCase();
  const tickets = getAllTickets();
  return tickets.find(t => String(t.bookingId).trim().toUpperCase() === cleanId) || null;
}

export function getVerificationUrl(bookingId) {
  const base = `${window.location.origin}${window.location.pathname}`;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}#/verify/${encodeURIComponent(bookingId)}`;
}
