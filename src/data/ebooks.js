// Ganti "id" dengan File ID Google Drive asli (atau tempel URL Drive lengkap, otomatis diambil ID-nya).
// Ebook terbaru = data paling akhir di array. Rekomendasi diatur lewat rekomendasiIds.
const cover = (teks, warna) =>
  `https://placehold.co/450x600/${warna}/fef3c7/png?text=${encodeURIComponent(teks)}&font=playfair-display`

export const ebooks = [
  { id: "DUMMY_ID_1", judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", cover: cover("Laskar\nPelangi", "166534") },
  { id: "DUMMY_ID_2", judul: "Dasar Pemrograman Web", penulis: "Tim Guru RPL", kategori: "Teknologi", cover: cover("Dasar\nPemrograman\nWeb", "14532d") },
  { id: "DUMMY_ID_3", judul: "Akuntansi untuk SMK", penulis: "Siti Rahmawati", kategori: "Pelajaran", cover: cover("Akuntansi\nuntuk SMK", "3f6212") },
  { id: "DUMMY_ID_4", judul: "Bumi Manusia", penulis: "Pramoedya A. Toer", kategori: "Novel", cover: cover("Bumi\nManusia", "365314") },
  { id: "DUMMY_ID_5", judul: "Kewirausahaan Muda", penulis: "Budi Santoso", kategori: "Pelajaran", cover: cover("Kewirausahaan\nMuda", "115e59") },
  { id: "DUMMY_ID_6", judul: "Jaringan Komputer Dasar", penulis: "Ahmad Fauzi", kategori: "Teknologi", cover: cover("Jaringan\nKomputer", "064e3b") },
  { id: "DUMMY_ID_7", judul: "Atomic Habits (Ringkasan)", penulis: "James Clear", kategori: "Pengembangan Diri", cover: cover("Atomic\nHabits", "4d7c0f") },
  { id: "DUMMY_ID_8", judul: "Kumpulan Puisi Pelajar", penulis: "Siswa SMKN Campalagian", kategori: "Sastra", cover: cover("Kumpulan\nPuisi", "78350f") },
]

export const rekomendasiIds = ["DUMMY_ID_1", "DUMMY_ID_2", "DUMMY_ID_7", "DUMMY_ID_4"]

export const getEbookById = (id) => ebooks.find((e) => e.id === id)
export const getKategori = () => [...new Set(ebooks.map((e) => e.kategori))].sort()
export const getPenulisCount = () => new Set(ebooks.map((e) => e.penulis)).size
export const getTerbaru = (n = 4) => [...ebooks].reverse().slice(0, n)
export const getRekomendasi = () =>
  rekomendasiIds.map((id) => getEbookById(id)).filter(Boolean)
