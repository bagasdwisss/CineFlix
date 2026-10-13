/**
 * CineFlix E-Gift Cards Catalog & Themes
 */

export const giftCardThemes = [
  {
    id: "theme1",
    name: "Movie Date Night",
    subtitle: "Untuk Nonton Romantis Berdua",
    gradient: "from-pink-600 via-purple-600 to-indigo-800",
    icon: "Heart",
    bgPattern: "hearts"
  },
  {
    id: "theme2",
    name: "Birthday Cinema Bash",
    subtitle: "Hadiah Ulang Tahun Spesial",
    gradient: "from-amber-500 via-orange-600 to-red-700",
    icon: "Gift",
    bgPattern: "stars"
  },
  {
    id: "theme3",
    name: "Ultimate Cinephile Pass",
    subtitle: "Bebas Nonton Film Apapun",
    gradient: "from-[#6a11cb] via-purple-700 to-[#2575fc]",
    icon: "Film",
    bgPattern: "film"
  },
  {
    id: "theme4",
    name: "Thank You / Best Friends",
    subtitle: "Apresiasi Sahabat Terbaik",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    icon: "Sparkles",
    bgPattern: "sparkles"
  }
];

export const giftCardPresets = [
  { amount: 100000, label: "Rp 100.000", bonus: "+50 Poin Flix" },
  { amount: 200000, label: "Rp 200.000", bonus: "+120 Poin Flix" },
  { amount: 350000, label: "Rp 350.000", bonus: "+250 Poin Flix (Popcorn Gratis)" },
  { amount: 500000, label: "Rp 500.000", bonus: "+400 Poin Flix (VIP Lounge Access)" }
];
