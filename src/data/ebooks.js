import { ebooks } from './ebooks-data.js'

export { ebooks }

// Rekomendasi pilihan – ebook paling populer
export const rekomendasiIds = [
  '1YCggD6EJLAzr2EB5kaKtWWvr15Siv4XS', // Bicara itu ada seninya
  '1JY03R6DSRFt90uDQTGTywvuJLILGXqJC', // Sejarah Dunia
  '1xRUQ53GFbTADNA-tkDP1LikGMrdySWR_', // Filosofi Teras – Henry Manampiring
  '1ZIk0aSuKBw5oJsZYROewU8GwTM-J6otV', // Trik Memikat & Mempengaruhi Lawan Bicara
  '1TQ0ri1YQAiKTcYEo7ZapePZb_KZ3go0Z', // Berdamai Diri sendiri
  '145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9', // Saat Engkau Ingin Berubah
]

export const getEbookById = (id) => ebooks.find((e) => e.id === id)
export const getKategori = () => [...new Set(ebooks.map((e) => e.kategori))].sort()
export const getPenulisCount = () => new Set(ebooks.map((e) => e.penulis)).size
export const getTerbaru = (n = 4) => [...ebooks].reverse().slice(0, n)
export const getRekomendasi = () =>
  rekomendasiIds.map((id) => getEbookById(id)).filter(Boolean)
