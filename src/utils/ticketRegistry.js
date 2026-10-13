/**
 * Global Ticket Registry for CineFlix
 * Provides persistent storage, cross-device portable payload encoding,
 * and smart lookup for all issued cinema tickets, event passes, and food pickup vouchers.
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

/**
 * Smart extractor to pull out the booking ID from any raw text, full URL, or route fragment.
 * Supports: FLIX-xxxxxxxx, CNF-xxxxxxxx, EVT-xxxxxxxx, FOOD-xxxxxxxx
 */
export function extractBookingId(input) {
  if (!input) return '';
  const str = String(input).trim();

  // 1. Regex search for known CineFlix prefixes
  const match = str.match(/(FLIX|CNF|EVT|FOOD)-[A-Z0-9]+/i);
  if (match) {
    return match[0].toUpperCase();
  }

  // 2. Fallback: Parse URL or path segment
  try {
    const withoutQuery = str.split('?')[0].split('#').pop() || '';
    const lastSegment = withoutQuery.split('/').filter(Boolean).pop();
    if (lastSegment && /^[A-Z0-9_-]+$/i.test(lastSegment)) {
      return lastSegment.toUpperCase();
    }
  } catch (e) {
    // ignore
  }

  return str.toUpperCase();
}

/**
 * Encodes ticket details into a compact base64 string to embed directly in QR code URLs.
 * This solves the cross-device problem when scanning from a smartphone camera.
 */
export function encodeTicketPayload(ticket) {
  if (!ticket) return '';
  const bookingId = ticket.bookingId || ticket.orderId;
  if (!bookingId) return '';

  try {
    const compact = {
      id: bookingId,
      m: ticket.movie || '',
      c: ticket.cinema || '',
      s: ticket.studio || '',
      d: ticket.date || '',
      t: ticket.time || '',
      st: Array.isArray(ticket.seats) ? ticket.seats : [ticket.seats || 'A1'],
      p: ticket.grandTotal || ticket.totalPrice || 0,
      pm: ticket.paymentMethod || 'GoPay',
      n: ticket.buyerName || 'Pelanggan CineFlix',
      type: ticket.orderType || (String(bookingId).startsWith('EVT') ? 'event' : String(bookingId).startsWith('FOOD') ? 'food' : 'movie'),
      g: ticket.gate || '',
      pos: ticket.poster || '',
      chk: ticket.checkedIn ? 1 : 0
    };

    const jsonStr = JSON.stringify(compact);
    // Cross-platform safe UTF-8 base64 encoding
    return btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (e) {
    console.error('Failed to encode ticket payload:', e);
    return '';
  }
}

/**
 * Decodes a ticket payload from a base64 string or full URL containing ?d=...
 */
export function decodeTicketPayload(payloadOrUrl) {
  if (!payloadOrUrl) return null;
  try {
    let b64 = '';
    const str = String(payloadOrUrl).trim();

    // Check if input is a URL containing ?d= or &d=
    const match = str.match(/[?&]d=([^&#]+)/);
    if (match) {
      b64 = decodeURIComponent(match[1]);
    } else if (!str.includes('/') && !str.includes(' ')) {
      b64 = str;
    }

    if (!b64) return null;

    // Decode base64 UTF-8
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const compact = JSON.parse(jsonStr);

    if (!compact || (!compact.id && !compact.bookingId)) return null;

    const bId = compact.id || compact.bookingId;
    const inferredType = compact.type || compact.orderType || (
      bId.startsWith('EVT') ? 'event' : bId.startsWith('FOOD') ? 'food' : 'movie'
    );

    return {
      bookingId: bId,
      orderType: inferredType,
      movie: compact.m || compact.movie || 'Tiket Bioskop CineFlix',
      cinema: compact.c || compact.cinema || 'CINEFLIX CINEMA',
      studio: compact.s || compact.studio || (inferredType === 'food' ? 'Concession Counter' : 'Studio Reguler'),
      date: compact.d || compact.date || new Date().toLocaleDateString('id-ID'),
      time: compact.t || compact.time || '19:00 WIB',
      seats: compact.st || compact.seats || ['A1'],
      totalPrice: compact.p || compact.totalPrice || 0,
      grandTotal: compact.p || compact.grandTotal || 0,
      paymentMethod: compact.pm || compact.paymentMethod || 'GoPay',
      buyerName: compact.n || compact.buyerName || 'Pelanggan CineFlix',
      status: compact.chk ? 'SUDAH DIGUNAKAN (CHECKED IN)' : 'LUNAS & VALID',
      paymentDate: new Date().toLocaleDateString('id-ID') + ' WIB',
      gate: compact.g || compact.gate || (inferredType === 'food' ? 'Counter FnB • Jalur Ambil' : 'Gate 1 • Pintu Masuk'),
      poster: compact.pos || compact.poster || (inferredType === 'food' ? 'assets/food1.png' : 'assets/avatar.jpg'),
      checkedIn: Boolean(compact.chk)
    };
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves all tickets from registry, user history, and latest receipt to ensure no ticket is ever lost.
 */
export function getAllTickets() {
  const ticketMap = new Map();

  // 1. Default demo tickets
  INITIAL_TICKETS.forEach(t => {
    if (t.bookingId) ticketMap.set(String(t.bookingId).toUpperCase(), t);
  });

  // 2. Saved tickets in verified registry
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(t => {
          if (t.bookingId) ticketMap.set(String(t.bookingId).toUpperCase(), t);
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse verified tickets:', e);
  }

  // 3. Tickets from all users in cineflix_users
  try {
    const usersRaw = localStorage.getItem('cineflix_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      if (Array.isArray(users)) {
        users.forEach(u => {
          if (Array.isArray(u.ticketHistory)) {
            u.ticketHistory.forEach(t => {
              if (t && t.bookingId) {
                const key = String(t.bookingId).toUpperCase();
                if (!ticketMap.has(key)) {
                  ticketMap.set(key, t);
                }
              }
            });
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }

  // 4. Latest receipt fallback
  try {
    const receiptRaw = localStorage.getItem('cineflix_receipt') || localStorage.getItem('receiptData');
    if (receiptRaw) {
      const receipt = JSON.parse(receiptRaw);
      if (receipt && receipt.bookingId) {
        const key = String(receipt.bookingId).toUpperCase();
        if (!ticketMap.has(key)) {
          ticketMap.set(key, receipt);
        }
      }
    }
  } catch (e) {
    // ignore
  }

  return Array.from(ticketMap.values());
}

/**
 * Persist a ticket to the global verified ticket registry
 */
export function saveTicket(ticket) {
  if (!ticket) return;
  const bookingId = ticket.bookingId || ticket.orderId;
  if (!bookingId) return;

  try {
    const tickets = getAllTickets();
    const cleanId = String(bookingId).trim().toUpperCase();
    const existingIndex = tickets.findIndex(
      t => String(t.bookingId).trim().toUpperCase() === cleanId
    );

    const inferredType = ticket.orderType || (
      cleanId.startsWith('EVT') ? 'event' : cleanId.startsWith('FOOD') ? 'food' : 'movie'
    );

    const normalizedTicket = {
      ...ticket,
      bookingId: cleanId,
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

/**
 * Retrieve a ticket by bookingId or by a raw scanned input/URL
 */
export function getTicketByBookingId(input) {
  if (!input) return null;

  // 1. First, check if input contains an encoded portable payload (?d=...)
  const fromPayload = decodeTicketPayload(input);
  if (fromPayload) {
    // Automatically persist to this device's storage so it's cached
    saveTicket(fromPayload);
    return fromPayload;
  }

  // 2. Extract clean booking ID
  const cleanId = extractBookingId(input);
  if (!cleanId) return null;

  const tickets = getAllTickets();
  const match = tickets.find(t => String(t.bookingId).trim().toUpperCase() === cleanId);
  return match || null;
}

/**
 * Generates a bulletproof, portable verification URL for QR codes.
 * Accepts either a booking ID or the full ticket object.
 * When ticket object is passed, embeds a compressed base64 payload so any smartphone
 * can verify it instantly even if the phone's browser has an empty localStorage!
 */
export function getVerificationUrl(ticketOrId) {
  let bookingId = '';
  let payloadStr = '';

  if (ticketOrId && typeof ticketOrId === 'object') {
    bookingId = ticketOrId.bookingId || ticketOrId.orderId || '';
    payloadStr = encodeTicketPayload(ticketOrId);
  } else {
    bookingId = extractBookingId(ticketOrId);
    // Try to find if ticket exists in registry to attach payload
    const existing = getTicketByBookingId(bookingId);
    if (existing) {
      payloadStr = encodeTicketPayload(existing);
    }
  }

  // Resolve base URL before any '#' hash fragment
  const href = window.location.href;
  const hashIndex = href.indexOf('#');
  let baseUrl = hashIndex > -1 ? href.substring(0, hashIndex) : href;

  // Clean trailing index.html and ensure trailing slash
  baseUrl = baseUrl.replace(/index\.html\/?$/, '');
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  const queryPart = payloadStr ? `?d=${encodeURIComponent(payloadStr)}` : '';
  return `${baseUrl}#/verify/${encodeURIComponent(bookingId)}${queryPart}`;
}
