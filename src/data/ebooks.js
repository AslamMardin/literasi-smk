import { ebooks } from './ebooks-data.js'

export { ebooks }

// Rekomendasi pilihan – ebook paling populer
export const rekomendasiIds = [
  '17F2jf9_Q6NA-q64ATyFnWU7DELVVjgQp', // Bumi Manusia – Pramoedya
  '1JY03R6DSRFt90uDQTGTywvuJLILGXqJC', // Sejarah Dunia
  '1xRUQ53GFbTADNA-tkDP1LikGMrdySWR_', // Filosofi Teras – Henry Manampiring
  '1kFeZ7oZg9kGKilpk4SmwXL2H2N2enWTH', // Sebuah Seni untuk Bersikap Bodo Amat
]

export const getEbookById = (id) => ebooks.find((e) => e.id === id)
export const getKategori = () => [...new Set(ebooks.map((e) => e.kategori))].sort()
export const getPenulisCount = () => new Set(ebooks.map((e) => e.penulis)).size
export const getTerbaru = (n = 4) => [...ebooks].reverse().slice(0, n)
export const getRekomendasi = () =>
  rekomendasiIds.map((id) => getEbookById(id)).filter(Boolean)
