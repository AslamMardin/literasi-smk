import { sejarahArticles } from './sejarah-data.js'

export { sejarahArticles }

/**
 * Mengambil daftar kategori artikel sejarah unik
 */
export const getSejarahCategories = () => {
  const cats = [...new Set(sejarahArticles.map((a) => a.kategori))].filter(Boolean)
  return ['Semua', ...cats]
}

export const sejarahCategories = getSejarahCategories()

/**
 * Cari artikel berdasarkan ID / slug atau nomor Bab
 */
export const getSejarahById = (id) => {
  if (!id) return null
  return (
    sejarahArticles.find((a) => a.id === id) ||
    sejarahArticles.find((a) => a.no === Number(id))
  )
}

/**
 * Cari artikel berdasarkan nomor bab
 */
export const getSejarahByNo = (no) => sejarahArticles.find((a) => a.no === no)

/**
 * Artikel unggulan (Featured)
 */
export const getFeaturedSejarah = () => {
  // Artikel Allamungan Batu di Luyo (no 13) atau Pitu Ba'bana Binanga (no 6)
  return getSejarahByNo(13) || sejarahArticles[0]
}
