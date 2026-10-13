/**
 * Format numbers into Indonesian Rupiah currency string
 * e.g. 75000 -> "Rp 75.000"
 */
export function formatIDR(amount) {
  if (typeof amount !== 'number') return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Format Date object into human-readable Indonesian string
 * e.g. "15 Oktober 2026"
 */
export function formatDateID(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Generate a unique booking ID
 * e.g. "FLIX-84920138"
 */
export function generateBookingId(prefix = 'FLIX') {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${randomNum}`;
}

/**
 * Discount voucher calculator
 */
export const VOUCHER_CODES = {
  CINEFLIX: { type: 'percent', value: 0.15, desc: 'Diskon 15% Spesial CineFlix' },
  FLIXHEMAT: { type: 'flat', value: 10000, desc: 'Potongan Langsung Rp 10.000' },
  STUDENT50: { type: 'percent_capped', value: 0.25, max: 25000, desc: 'Diskon Pelajar 25% (Maks Rp 25.000)' }
};

export function evaluateVoucher(code, subtotal) {
  if (!code) return { valid: false, discount: 0, message: '' };
  const cleanCode = code.trim().toUpperCase();
  const voucher = VOUCHER_CODES[cleanCode];

  if (!voucher) {
    return { valid: false, discount: 0, message: 'Kode voucher tidak valid atau sudah kadaluarsa.' };
  }

  let discount = 0;
  if (voucher.type === 'percent') {
    discount = Math.round(subtotal * voucher.value);
  } else if (voucher.type === 'flat') {
    discount = Math.min(subtotal, voucher.value);
  } else if (voucher.type === 'percent_capped') {
    discount = Math.min(voucher.max, Math.round(subtotal * voucher.value));
  }

  return {
    valid: true,
    discount,
    code: cleanCode,
    desc: voucher.desc,
    message: `Voucher ${cleanCode} berhasil diterapkan! (${voucher.desc})`
  };
}

/**
 * Basic Email validation regex
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
