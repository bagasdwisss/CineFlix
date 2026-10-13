/**
 * Global Ticket Registry for CineFlix
 * Provides persistent storage and retrieval for all issued cinema tickets,
 * enabling real verification when scanning barcodes / QR codes.
 */

const STORAGE_KEY = 'cineflix_verified_tickets';

// Default initial demo tickets
const INITIAL_TICKETS = [
  {
    bookingId: "FLIX-98214532",
    movie: "Avatar: The Way of Water",
    movieId: "movie3",
    poster: "assets/Avatar-The-Way-of-Water-2022.jpg",
    cinema: "CINEFLIX RASUNA SAID",
    studio: "Studio 1 (Dolby Atmos)",
    date: "14 Mei 2026",
    time: "17:45",
    seats: ["F8", "F9"],
    totalPrice: 150000,
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
    movie: "Avengers: Endgame",
    movieId: "movie2",
    poster: "assets/Avengers-Endgame.jpg",
    cinema: "CINEFLIX GRAND INDONESIA",
    studio: "Studio IMAX 3D",
    date: "20 Mei 2026",
    time: "20:15",
    seats: ["D10", "D11", "D12"],
    totalPrice: 225000,
    paymentMethod: "DANA Wallet",
    status: "LUNAS & VALID",
    buyerName: "John Doe",
    buyerEmail: "john.doe@example.com",
    paymentDate: "10 Mei 2026, 18:30 WIB",
    ticketCount: 3,
    serviceFee: 4000,
    gate: "Gate 3 • IMAX 3D"
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
    const existingIndex = tickets.findIndex(t => t.bookingId === ticket.bookingId);
    
    // Normalize ticket structure
    const normalizedTicket = {
      ...ticket,
      studio: ticket.studio || ticket.cinemaStudio || 'Studio Reguler',
      poster: ticket.poster || 'assets/avatar.jpg',
      status: ticket.status || 'LUNAS & VALID',
      paymentDate: ticket.paymentDate || ticket.paymentTime || new Date().toLocaleString('id-ID'),
      buyerName: ticket.buyerName || ticket.name || 'Pelanggan CineFlix',
      gate: ticket.gate || 'Gate 1 • Pintu Masuk Studio'
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
