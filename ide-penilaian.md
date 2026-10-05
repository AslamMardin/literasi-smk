# PRD — Sistem Literasi Siswa

## 1. Tujuan

Mengembangkan fitur sistem literasi siswa pada aplikasi e-book yang sudah ada.

Sistem memungkinkan siswa untuk:

- login menggunakan NIS;
- menyimpan identitas siswa aktif di Local Storage;
- membaca e-book dari Google Drive;
- menyimpan halaman terakhir yang dibaca;
- menyimpan progress setiap buku;
- mengetahui buku terakhir yang dibaca;
- melihat histori bacaan;
- mendapatkan poin berdasarkan aktivitas membaca;
- melihat total poin;
- melihat peringkat siswa berdasarkan poin.

Sistem harus tetap sederhana dan tidak menggunakan sistem akun/password yang kompleks.

---

# 2. Teknologi

Gunakan teknologi yang sudah digunakan oleh aplikasi:

- Vue.js
- JavaScript
- Firebase
- Cloud Firestore
- Local Storage
- PDF.js / sistem pembaca PDF yang sudah digunakan aplikasi
- Google Drive sebagai sumber file PDF

Jangan melakukan perubahan besar terhadap struktur aplikasi yang sudah berjalan.

---

# 3. Sumber Data Buku

Data buku **tetap berada di JavaScript** dan tidak dipindahkan ke Firebase.

Contoh:

```js
{
  id: "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9",
  judul: "Saat Engkau Ingin Berubah",
  penulis: "Rahma",
  kategori: "Pengembangan Diri",
  cover: ...
}
```

`id` buku merupakan ID Google Drive yang sudah digunakan oleh aplikasi.

Firebase tidak perlu menyimpan file PDF.

Firebase juga tidak perlu menjadi database katalog buku.

### Pembagian sumber data

```text
ebooks.js
    ↓
Data katalog buku
    ↓
Google Drive
    ↓
File PDF

Firebase
    ↓
Data siswa
    ↓
Progress membaca
    ↓
Poin
    ↓
Aktivitas/history

Local Storage
    ↓
Siswa yang sedang login
```

---

# 4. Firebase Database

Gunakan collection:

```text
siswa
```

Contoh struktur:

```text
siswa
├── siswa001
├── siswa002
└── siswa003
```

Setiap dokumen siswa memiliki struktur:

```js
{
  nama: "Ahmad Fauzan",
  nis: "101001",
  kelas: "XII DKV 1",
  point: 150,
  bukuTerakhir: "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9",
  createdAt: timestamp,
  updatedAt: timestamp,

  progres: {
    "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9": {
      bookId: "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9",
      judul: "Saat Engkau Ingin Berubah",
      penulis: "Rahma",
      halamanTerakhir: 45,
      totalHalaman: 120,
      progress: 38,
      status: "sedang_dibaca",
      point: 25,
      terakhirDibaca: timestamp,
      selesaiPada: null
    }
  }
}
```

---

# 5. Data Siswa

Data siswa adalah **data master**.

Siswa tidak boleh membuat data siswa baru melalui website.

Contoh:

```js
{
  nama: "Ahmad Fauzan",
  nis: "101001",
  kelas: "XII DKV 1",
  point: 150
}
```

Data siswa dapat dimasukkan/dikelola oleh admin/guru.

---

# 6. Sistem Login Siswa

Tidak menggunakan Firebase Authentication.

Tidak menggunakan:

- password;
- email;
- username;
- akun Firebase Authentication.

Login cukup menggunakan:

```text
NIS
```

## Alur login

Saat aplikasi dibuka:

```text
Buka aplikasi
     ↓
Cek Local Storage
     ↓
Ada siswa aktif?
     ├── YA → Ambil siswaId → masuk aplikasi
     │
     └── TIDAK
            ↓
       Tampilkan modal login
            ↓
        Masukkan NIS
            ↓
       Cari NIS di Firebase
            ↓
       ┌────┴────┐
     DITEMUKAN  TIDAK
        ↓         ↓
      Login   NIS tidak ditemukan
```

Jika NIS tidak ditemukan:

```text
NIS tidak ditemukan.
Silakan periksa kembali NIS Anda.
```

**Jangan membuat siswa baru secara otomatis.**

Hal ini penting agar kesalahan pengetikan NIS tidak menghasilkan data siswa baru.

---

# 7. Local Storage

Local Storage hanya digunakan untuk mengetahui **siswa yang sedang aktif pada perangkat**.

Simpan:

```js
{
  siswaId: "siswa001",
  nis: "101001"
}
```

Contoh:

```js
localStorage.setItem(
  "siswaAktif",
  JSON.stringify({
    siswaId: "siswa001",
    nis: "101001"
  })
)
```

Jangan menyimpan hal berikut di Local Storage:

- progress;
- history;
- point;
- data seluruh buku;
- halaman terakhir.

Data tersebut tetap di Firebase.

Firebase menjadi sumber data utama.

---

# 8. Ganti Pengguna

Tambahkan fitur:

```text
Ganti Pengguna
```

Contoh pada menu profil:

```text
👤 Ahmad Fauzan
XII DKV 1

[ Ganti Pengguna ]
```

Ketika dipilih:

1. Hapus `siswaAktif` dari Local Storage.
2. Tampilkan modal login.
3. Siswa memasukkan NIS.
4. Cari NIS di Firebase.
5. Jika ditemukan, simpan siswa baru ke Local Storage.
6. Muat ulang data siswa.
7. Tampilkan dashboard siswa baru.

---

# 9. Data Progress Buku

Setiap buku yang pernah dibaca siswa disimpan berdasarkan `bookId`.

Contoh:

```js
"145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9": {
  bookId: "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9",
  judul: "Saat Engkau Ingin Berubah",
  penulis: "Rahma",

  halamanTerakhir: 45,
  totalHalaman: 120,
  progress: 38,

  status: "sedang_dibaca",

  point: 25,

  terakhirDibaca: timestamp,
  selesaiPada: null
}
```

## Status buku

Gunakan tiga status:

```text
belum_dibaca
sedang_dibaca
selesai
```

Buku yang belum pernah dibuka tidak perlu dibuat sebagai data progress di Firebase.

Progress dibuat ketika siswa mulai membaca buku.

---

# 10. Halaman Terakhir

Ketika siswa membaca PDF, sistem harus mencatat:

```text
halamanTerakhir
```

Contoh:

```text
halamanTerakhir: 45
```

Jika siswa keluar dari buku dan membukanya kembali, aplikasi harus membuka kembali buku tersebut pada halaman terakhir yang tersimpan.

Contoh:

```text
Siswa terakhir membaca halaman 45
             ↓
Membuka buku kembali
             ↓
PDF dibuka pada halaman 45
```

---

# 11. Perhitungan Progress

Progress dihitung berdasarkan:

```text
halamanTerakhir / totalHalaman × 100
```

Contoh:

```text
45 / 120 × 100 = 37,5%
```

Tampilkan sebagai:

```text
38%
```

Progress harus memiliki batas:

```text
0% ≤ progress ≤ 100%
```

Jika halaman mencapai halaman terakhir:

```text
progress = 100
status = "selesai"
```

---

# 12. Buku Terakhir Dibaca

Pada dokumen siswa terdapat:

```js
bukuTerakhir
```

Isinya adalah `bookId`.

Contoh:

```js
bukuTerakhir: "145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9"
```

Ketika siswa membuka buku:

1. update `bukuTerakhir`;
2. update progress buku;
3. update `terakhirDibaca`.

Data judul dan cover tetap diambil dari `ebooks.js`.

---

# 13. Histori Bacaan

Gunakan data `progres` sebagai histori bacaan.

**Tidak perlu membuat collection `history` terpisah.**

Alasannya agar tidak terjadi duplikasi data.

Contoh:

```text
progres
├── Buku A
├── Buku B
├── Buku C
└── Buku D
```

Semua buku yang pernah dibaca siswa otomatis menjadi histori.

Urutkan histori berdasarkan:

```text
terakhirDibaca
```

dari terbaru ke terlama.

---

# 14. Tampilan Histori Bacaan

Tambahkan halaman/menu:

```text
Histori Bacaan
```

Setiap item menampilkan:

- cover;
- judul;
- penulis;
- progress;
- halaman terakhir;
- total halaman;
- status;
- terakhir dibaca;
- tombol lanjutkan membaca.

Contoh:

```text
┌──────────────────────────────┐
│ [ COVER ]                    │
│                              │
│ Saat Engkau Ingin Berubah    │
│ Rahma                        │
│                              │
│ ████████░░░░ 38%             │
│ Halaman 45 / 120             │
│                              │
│ Sedang Dibaca                │
│ Terakhir: 6 Okt 2026         │
│                              │
│ [ Lanjutkan Membaca ]        │
└──────────────────────────────┘
```

Jika buku sudah selesai:

```text
✅ Selesai
100%
```

---

# 15. Menghubungkan Firebase dengan ebooks.js

Firebase menyimpan:

```js
bookId
```

Aplikasi mencari buku berdasarkan ID tersebut:

```js
const buku = ebooks.find(
  ebook => ebook.id === bookId
)
```

Dengan demikian aplikasi mendapatkan:

- judul;
- penulis;
- kategori;
- cover;
- informasi PDF.

Jangan membuat data buku kedua di Firebase sebagai database katalog.

---

# 16. Sistem Poin

Sistem poin digunakan untuk menentukan peringkat siswa.

Poin harus diberikan berdasarkan aktivitas membaca.

Sistem awal yang digunakan:

```text
25% progress → +10 poin
50% progress → +10 poin
75% progress → +10 poin
100% selesai → +20 poin
```

Total maksimal:

```text
50 poin / buku
```

Poin milestone hanya boleh diberikan **satu kali**.

Siswa tidak boleh mendapatkan poin berulang kali karena membuka halaman yang sama.

---

# 17. Pencegahan Poin Ganda

Sistem harus mengetahui milestone yang sudah diberikan.

Contoh:

```js
milestone: {
  "25": true,
  "50": true,
  "75": false,
  "100": false
}
```

Jika siswa sudah mendapatkan poin 25%, maka saat kembali membuka buku pada progress 25%:

```text
Tidak mendapatkan +10 lagi.
```

Jika progress meningkat menjadi 50%:

```text
Mendapatkan +10.
```

---

# 18. Total Poin Siswa

Total poin disimpan pada:

```js
point
```

Contoh:

```js
point: 150
```

Total poin digunakan untuk:

- dashboard;
- profil siswa;
- peringkat.

Jangan menyimpan ranking sebagai data permanen.

---

# 19. Peringkat Siswa

Tambahkan halaman:

```text
Peringkat
```

Ambil data seluruh siswa dari Firebase.

Urutkan berdasarkan:

```text
point DESC
```

Contoh:

```text
🏆 PERINGKAT LITERASI

🥇 Siti Rahma
   200 Poin

🥈 Ahmad Fauzan
   150 Poin

🥉 Muhammad Rizky
   100 Poin
```

Ranking dihitung secara dinamis.

Jangan menyimpan:

```text
ranking: 1
ranking: 2
ranking: 3
```

di Firebase.

Jika poin berubah, ranking otomatis berubah.

---

# 20. Filter Peringkat Berdasarkan Kelas

Jika memungkinkan, tambahkan filter:

```text
[ Semua Kelas ▼ ]
```

Pilihan:

```text
Semua Kelas
XII DKV 1
XII DKV 2
XI DKV 1
XI DKV 2
```

Ketika kelas dipilih, tampilkan ranking siswa pada kelas tersebut.

---

# 21. Dashboard Siswa

Setelah login, tampilkan dashboard:

```text
Halo, Ahmad Fauzan 👋

XII DKV 1

⭐ 150
Total Poin

📚 2
Buku Dibaca

✅ 1
Buku Selesai

📖 1
Sedang Dibaca
```

Kemudian:

```text
Lanjutkan Membaca
```

Menampilkan buku dari:

```text
bukuTerakhir
```

Dashboard juga menyediakan:

```text
[ Histori Bacaan ]
[ Peringkat ]
```

---

# 22. Fitur Lanjutkan Membaca

Jika siswa memiliki:

```text
bukuTerakhir
```

maka tampilkan:

```text
Lanjutkan Membaca

Saat Engkau Ingin Berubah

Progress 38%
Halaman 45 / 120

[ Lanjutkan ]
```

Ketika tombol ditekan, PDF langsung dibuka pada halaman terakhir.

---

# 23. Kondisi Siswa Baru

Jika siswa belum memiliki progress:

```text
Belum ada riwayat bacaan.
Yuk mulai membaca buku pertama kamu! 📚
```

Jika siswa belum pernah membaca buku:

```text
Belum ada buku yang sedang dibaca.
```

Jika belum ada buku terakhir:

```text
Belum ada buku terakhir.
```

---

# 24. Kondisi Loading

Saat mengambil data dari Firebase:

```text
Memuat data siswa...
```

Saat memuat histori:

```text
Memuat histori bacaan...
```

Saat memuat ranking:

```text
Memuat peringkat...
```

Jangan menampilkan halaman kosong ketika data masih dalam proses loading.

---

# 25. Kondisi Error

Jika Firebase gagal:

```text
Gagal mengambil data.
Silakan coba lagi.
```

Jika login gagal karena koneksi:

```text
Tidak dapat terhubung ke server.
Periksa koneksi internet dan coba lagi.
```

Jika NIS tidak ditemukan:

```text
NIS tidak ditemukan.
Periksa kembali NIS yang dimasukkan.
```

---

# 26. Struktur Komponen Vue

Gunakan struktur yang sesuai dengan project yang sudah ada.

Jika diperlukan, komponen dapat dibuat:

```text
components/
├── StudentLoginModal.vue
├── StudentProfile.vue
├── StudentDashboard.vue
├── ContinueReading.vue
├── ReadingProgress.vue
├── ReadingHistory.vue
├── RankingList.vue
└── ChangeStudentModal.vue
```

Untuk logic:

```text
composables/
├── useStudent.js
├── useReadingProgress.js
└── useRanking.js
```

Firebase:

```text
services/
└── firebase.js
```

Data buku tetap:

```text
data/
└── ebooks.js
```

Jika project sudah mempunyai struktur berbeda, pertahankan struktur yang ada dan sesuaikan implementasinya.

---

# 27. Firebase Service

Buat konfigurasi Firebase terpusat.

Minimal membutuhkan fungsi untuk:

```text
getStudentByNIS()
getStudent()
updateStudent()
updateReadingProgress()
getRanking()
```

Jangan membuat koneksi Firebase berulang-ulang di setiap komponen.

---

# 28. Aturan Data

### Data yang berasal dari Firebase:

- identitas siswa;
- kelas;
- total poin;
- buku terakhir;
- progress;
- halaman terakhir;
- status;
- tanggal aktivitas membaca.

### Data yang berasal dari ebooks.js:

- judul;
- penulis;
- kategori;
- cover;
- ID Google Drive;
- informasi PDF.

### Data Local Storage:

- siswaId;
- NIS siswa yang sedang aktif.

---

# 29. Keamanan Dasar

Tidak menggunakan Firebase Authentication untuk versi awal.

Namun implementasi harus:

- tidak membuat siswa baru dari input NIS;
- hanya menggunakan NIS yang sudah terdaftar;
- tidak menyimpan data sensitif di Local Storage;
- tidak memberikan akses ke data siswa lain melalui UI;
- mencegah penambahan poin berulang;
- memvalidasi `bookId`;
- menggunakan timestamp Firebase.

Jika sistem nantinya membutuhkan keamanan yang lebih tinggi, Firebase Authentication dapat ditambahkan pada versi berikutnya.

---

# 30. Alur Lengkap Sistem

```text
                    WEBSITE
                       │
                       ▼
                Cek Local Storage
                       │
              ┌────────┴────────┐
              │                 │
          Ada siswa          Tidak ada
              │                 │
              │             Login NIS
              │                 │
              │            Cari Firebase
              │                 │
              │          ┌──────┴──────┐
              │          │             │
              │       ditemukan    tidak ada
              │          │             │
              │          └──────┐      │
              │                 │      └── Error
              └─────────────────┘
                       │
                       ▼
                 Dashboard Siswa
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Katalog      Histori      Peringkat
          │            │            │
          ▼            │