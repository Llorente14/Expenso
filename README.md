<div align="center">
  <h1 align="center">💵 Expenso - Aplikasi Manajemen Keuangan Pribadi 💵</h1>
  <p align="center">
    <strong>Solusi lengkap untuk melacak dan menganalisis pengeluaran Anda dengan mudah.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
    <img src="https://img.shields.io/badge/Node.js-18.x-339933.svg" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-4.x-000000.svg" alt="Express.js">
    <img src="https://img.shields.io/badge/MongoDB-4.4+-47A248.svg" alt="MongoDB">
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4.svg" alt="Tailwind CSS">
  </p>
</div>

---

**Expenso** adalah aplikasi web yang dirancang untuk membantu pengguna mengelola keuangan pribadi secara efisien. Dibangun dengan arsitektur **MVC (Model-View-Controller)** yang solid menggunakan Node.js dan Express.js, aplikasi ini memungkinkan pengguna untuk mencatat setiap pengeluaran, mengkategorikannya, dan mendapatkan wawasan berharga melalui dasbor analitik yang interaktif.

## ✨ Fitur Unggulan

Proyek ini dilengkapi dengan serangkaian fitur yang komprehensif untuk memberikan pengalaman manajemen keuangan yang lengkap.

###  CRUD Inti
| Modul | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **Pengeluaran** | ✅ Pengguna | ✅ Data pribadi | ✅ Data pribadi | ✅ Data pribadi |
| **Kategori** | ✅ Pengguna | ✅ Data pribadi | ✅ Data pribadi | ✅ Data pribadi |
| **Pengguna** | ✅ Admin | ✅ Admin (semua user) | ✅ Admin | ✅ Admin |
| **Profil** | ✅ Pengguna (Registrasi) | ✅ Data pribadi | ✅ Data pribadi | ❌ (Hanya oleh Admin)|

### 📊 Dasbor & Analitik
- **4 Statistik Ringkasan:** Memberikan gambaran umum cepat tentang total pengeluaran, pengeluaran bulan ini, rata-rata harian, dan jumlah transaksi.
- **2 Grafik Interaktif:**
  - Grafik Lingkaran (Pie Chart) untuk visualisasi distribusi pengeluaran berdasarkan kategori.
  - Grafik Batang (Bar Chart) untuk menampilkan tren pengeluaran dari waktu ke waktu.
- **Daftar Transaksi Terbaru:** Menampilkan beberapa pengeluaran terakhir di halaman utama untuk akses cepat.

### ⚙️ Fungsionalitas Tambahan
- **Pencarian (Searching):** Fitur pencarian dinamis untuk menemukan transaksi spesifik dengan mudah.
- **Pengurutan (Sorting):** Kemampuan untuk mengurutkan data pengeluaran berdasarkan tanggal atau jumlah.
- **Paginasi (Pagination):** Memecah daftar data yang panjang menjadi beberapa halaman untuk navigasi yang lebih baik dan performa yang lebih cepat.
- **Otentikasi Aman:** Sistem otentikasi berbasis sesi menggunakan **Passport.js** dengan *local strategy* dan hashing kata sandi menggunakan **bcrypt**.
- **Umpan Balik Responsif:** Pesan kesalahan yang jelas, seperti "Wrong password," saat login gagal untuk meningkatkan pengalaman pengguna.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi & Modul |
| :--- | :--- |
| **Runtime & Framework** | Node.js, Express.js |
| **View Engine** | EJS (Embedded JavaScript) |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB dengan Mongoose ODM |
| **Otentikasi & Sesi** | Passport, passport-local, bcrypt, express-session, connect-mongo |
| **Visualisasi Data** | Chart.js |
| **Utilitas & Lainnya** | dotenv, nodemon, express-flash |

---

## 🚀 Memulai Proyek

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih tinggi)
- [npm](https://www.npmjs.com/)
- Akses ke cluster [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) atau instalasi MongoDB lokal.

### Instalasi
1.  **Clone repositori ini:**
    ```sh
    git clone [https://github.com/Llorente14/Expenso.git](https://github.com/Llorente14/Expenso.git)
    cd Expenso
    ```

2.  **Install semua dependensi:**
    ```sh
    npm install
    ```

3.  **Konfigurasi Lingkungan:**
    Buat file `.env` di direktori root dengan menyalin dari `.env.example`.
    ```sh
    cp .env.example .env
    ```
    Kemudian, buka file `.env` dan isi variabel yang diperlukan:
    ```env
    # Port untuk server
    PORT=3000

    # URI koneksi ke database MongoDB Anda
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<database_name>?retryWrites=true&w=majority

    # Kunci rahasia untuk sesi
    SESSION_SECRET=iniadalahkuncirahasiayangkuat
    ```

### Menjalankan Aplikasi
-   **Mode Pengembangan (dengan Nodemon untuk hot-reloading):**
    ```sh
    npm run dev
    ```

-   **Mode Produksi:**
    ```sh
    npm start
    ```

Aplikasi akan tersedia di `http://localhost:3000`.

---

## 📁 Struktur Proyek (MVC)

Struktur direktori proyek ini dirancang untuk memisahkan concerns, sesuai dengan pola arsitektur MVC.

```
.
├── 📁 config/         # Konfigurasi (database, passport)
├── 📁 controllers/    # Logika bisnis (menghubungkan model dan view)
├── 📁 models/         # Skema database Mongoose
├── 📁 public/         # Aset statis (CSS, JS client, gambar)
├── 📁 routes/         # Definisi endpoint dan routing
├── 📁 views/          # File template EJS untuk antarmuka pengguna
├── .env.example      # Contoh file variabel lingkungan
├── app.js            # Entry point utama aplikasi Express
└── package.json      # Daftar dependensi dan skrip proyek
```

---

## 🤝 Berkontribusi

Kontribusi dari Anda sangat kami hargai! Jika Anda ingin membantu, silakan fork repositori ini, buat branch baru untuk fitur atau perbaikan Anda, dan ajukan *pull request*.

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
