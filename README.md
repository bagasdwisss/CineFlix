# 🎬 CineFlix - React Modern Cinema Web Application

CineFlix telah berhasil diperbaiki dan di-refactor secara menyeluruh dari kode HTML statis berbasis multi-file yang terpisah-pisah menjadi **Single Page Application (SPA) modern berbasis React + Vite**.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Anda berada di direktori proyek `c:\xampp\htdocs\CineFlix`.

### 1. Menjalankan Server Development (Vite)
```bash
npm run dev
```
Buka browser di: [http://localhost:5173](http://localhost:5173)

### 2. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil build yang optimal dan siap deploy akan dihasilkan di folder `dist/`.

### 3. Mengakses via XAMPP Apache
Karena proyek berada di folder `c:\xampp\htdocs\CineFlix`, Anda dapat membuka build produksi langsung di browser melalui Apache XAMPP:
👉 **[http://localhost/CineFlix/dist/](http://localhost/CineFlix/dist/)**

---

## 🛠️ Perbaikan & Peningkatan yang Dilakukan

1. **Migrasi Menyeluruh ke React & React Router**:
   - Menggantikan 30+ file HTML statis yang berulang (`index.html`, `movie1.html` s/d `movie10.html`, `events1.html` s/d `events5.html`, `payment.html`, `seat_selection.html`, `profile.html`, dll.) menjadi komponen React yang modular, rapi, dan reusable.
   - Menggunakan `HashRouter` untuk navigasi SPA tanpa reload halaman, kompatibel penuh dengan localhost Apache XAMPP sub-folder.

2. **Perbaikan Bug Kode Lama**:
   - **Bug Kursi Bioskop (`seat_selection.html`)**: Memperbaiki variabel loop ganda di script lama yang menyebabkan error scope pada kursi studio. Kini tata letak kursi teratur (Baris A-H, 16 kursi per baris dengan lorong tengah) dan status kursi terisi konsisten.
   - **Bug Login & Auth (`login.html`)**: Memperbaiki parsing `localStorage.getItem('users') || []` yang sebelumnya menyebabkan crash bila bernilai `null`.
   - **Bug URL & Navigation**: Menyinkronkan seluruh parameter URL dan navigasi antar halaman secara reaktif.

3. **Fitur-Fitur Lengkap yang Disediakan**:
   - **Cinematic Intro Splash (`/`)**: Animasi sorot lampu, logo bercahaya, dan efek mesin tik slogan *"Book Anytime, Anywhere"*.
   - **Navbar Interaktif**: Efek mesin tik animasi pada logo, tautan navigasi responsif, keranjang F&B, dan status user login.
   - **Beranda (`/home`)**:
     - Hero banner carousel dengan slider otomatis.
     - Slider film *"Now Showing in CineFlix"* dengan kontrol tombol panah dan indikator dot paginasi.
     - Kartu lokasi bioskop & cuplikan Flix Events.
   - **Detail Film Dinamis (`/movie/:id`)**:
     - Mendukung seluruh 10 film (*Avatar*, *Avengers: Endgame*, *Avatar 2*, *Titanic*, *Star Wars*, *Infinity War*, *Ne Zha 2*, *Spider-Man*, *Inside Out 2*, *Jurassic World*).
     - Pemutar modal video trailer asli (`.mp4`) dari folder `assets/`.
     - Foto pemeran (cast) asli dari `assets/`.
     - Tombol Watchlist & Pesan Tiket langsung.
   - **Alur Pemesanan Tiket Bioskop (`/booking`)**:
     - Pemilihan tanggal 7 hari ke depan (dilengkapi label Weekend vs Weekday).
     - Pemilihan bioskop (*CineFlix Rasuna Said*, *Dago Atas*, *Ubud Raya*) dengan tarif harga dinamis.
     - Pemilihan jam tayang (13:15, 15:30, 17:45, 20:00) dengan proteksi jam yang sudah lewat untuk hari ini.
   - **Pemilihan Kursi Studio (`/seat-selection`)**:
     - Visualisasi layar bioskop melengkung.
     - Status kursi: Tersedia, Terisi, dan Dipilih Anda.
     - Perhitungan harga real-time otomatis.
   - **Pembayaran Tiket & E-Tiket (`/payment` & `/receipt`)**:
     - Pilihan metode pembayaran: GoPay, ShopeePay, DANA, Kartu Kredit, PayPal.
     - Fitur voucher diskon promo (Gunakan kode: `CINEFLIX` untuk diskon 15%).
     - E-Tiket digital dengan barcode SVG asli (JsBarcode), kode booking resmi, efek pesta confetti, serta tombol cetak tiket (`window.print()`).
   - **Flix Events (`/events`, `/events/:id`, `/events/payment`)**:
     - Katalog festival film (Marvel 10th, Anime Expo, Rooftop Cinema Bali, Midnight Horror, Nolan 70mm).
     - Pemilihan kategori tiket pass dengan kuantitas fleksibel dan ringkasan pembayaran otomatis.
   - **Flix Foods (`/foods`, `/foods/payment`)**:
     - Katalog popcorn, combo snack, hot meals, dan minuman segar.
     - Filter kategori makanan dan drawer keranjang belanja instan.
   - **Flix News (`/news`, `/news/:id`)**:
     - 6 artikel berita industri perfilman dengan fitur pencarian dan filter kategori.
   - **Autentikasi & Profil (`/login`, `/register`, `/forgot-password`, `/profile`)**:
     - Akun demo siap pakai: `john.doe@example.com` / `password123`.
     - Pendaftaran akun baru dan fitur Ingat Saya.
     - Tab profil: Edit Informasi, Riwayat Tiket yang tersimpan, Watchlist, dan Pengaturan.
   - **AI Assistant Chatbot**:
     - Widget chatbot mengambang di pojok kanan bawah dengan basis pengetahuan seputar booking, bioskop, tarif, dan makanan.
     - Pilihan pertanyaan cepat (chip suggestion) dan balasan instan.

4. **Arsip Kode Lama**:
   - Seluruh file statis HTML/CSS/JS lama telah dicadangkan dengan aman di folder `legacy_html/`.

---

## 📁 Struktur Folder Proyek

```
CineFlix/
├── assets/                  # Aset gambar, poster, foto cast, dan video trailer
├── dist/                    # Hasil build produksi React (siap dijalankan)
├── legacy_html/             # Cadangan file HTML statis lama
├── src/
│   ├── components/          # Navbar, Footer, Chatbot, TrailerModal
│   ├── context/             # AuthContext, BookingContext
│   ├── data/                # moviesData, eventsData, foodsData, newsData
│   ├── pages/               # Intro, Home, MovieDetail, Booking, SeatSelection,
│   │                        # Payment, Receipt, Events, Foods, News, Login, dll.
│   ├── App.jsx              # Routing utama React Router
│   ├── index.css            # Styling global & custom scrollbar
│   └── main.jsx             # React DOM entry point
├── index.html               # File HTML root utama untuk Vite
├── package.json             # Konfigurasi dependensi dan scripts
└── vite.config.js           # Konfigurasi Vite & auto-copy aset
```
