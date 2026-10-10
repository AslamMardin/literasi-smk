import { ref, computed } from 'vue'
import { getEbookById } from '../data/ebooks'

const KEY_NAMA = 'literasi_nama_siswa'
const KEY_NIS = 'literasi_nis_siswa'
const KEY_KELAS = 'literasi_kelas_siswa'
const KEY_BOOKMARKS = 'literasi_bookmarks'
const KEY_LAST_READ = 'literasi_terakhir_dibaca'
const KEY_READING_POSITIONS = 'literasi_posisi_baca'

// State reaktif global (singleton di memory)
const studentName = ref(localStorage.getItem(KEY_NAMA) || '')
const studentNis = ref(localStorage.getItem(KEY_NIS) || '')
const studentClass = ref(localStorage.getItem(KEY_KELAS) || '')
const showNameModal = ref(
  !localStorage.getItem(KEY_NAMA) ||
  !localStorage.getItem(KEY_NIS) ||
  !localStorage.getItem(KEY_KELAS)
)
const bookmarks = ref([])
const lastRead = ref(null)
const readingPositions = ref([])

// Inisialisasi bookmarks dari localStorage
try {
  const savedBookmarks = localStorage.getItem(KEY_BOOKMARKS)
  bookmarks.value = savedBookmarks ? JSON.parse(savedBookmarks) : []
} catch (e) {
  bookmarks.value = []
}

// Inisialisasi ebook terakhir dibaca dari localStorage
try {
  const savedLastRead = localStorage.getItem(KEY_LAST_READ)
  lastRead.value = savedLastRead ? JSON.parse(savedLastRead) : null
} catch (e) {
  lastRead.value = null
}

try {
  const savedReadingPositions = localStorage.getItem(KEY_READING_POSITIONS)
  const parsedReadingPositions = savedReadingPositions ? JSON.parse(savedReadingPositions) : []
  readingPositions.value = Array.isArray(parsedReadingPositions) ? parsedReadingPositions : []
} catch (e) {
  readingPositions.value = []
  console.warn('Gagal membaca posisi baca tersimpan:', e)
}

export function useLiterasi() {
  const hasStudentName = computed(() => !!studentName.value.trim())
  const hasStudentIdentity = computed(() =>
    !!studentName.value.trim() && !!studentNis.value.trim() && !!studentClass.value.trim()
  )

  /**
   * Simpan profil siswa (NIS, nama, dan kelas) ke localStorage
   */
  function setStudentProfile({ nis, name, kelas } = {}) {
    const cleanNis = String(nis !== undefined ? nis : studentNis.value).trim()
    const cleanName = String(name || '').trim()
    const cleanClass = String(kelas !== undefined ? kelas : '').trim()

    if (cleanNis) {
      studentNis.value = cleanNis
      localStorage.setItem(KEY_NIS, cleanNis)
    }

    if (cleanName) {
      studentName.value = cleanName
      localStorage.setItem(KEY_NAMA, cleanName)
    }

    studentClass.value = cleanClass
    if (cleanClass) {
      localStorage.setItem(KEY_KELAS, cleanClass)
    } else {
      localStorage.removeItem(KEY_KELAS)
    }

    showNameModal.value = false
  }

  /**
   * Simpan nama & kelas siswa ke localStorage
   */
  function setStudentName(name, kelas, nis) {
    if (typeof name === 'object' && name !== null) {
      return setStudentProfile(name)
    }
    return setStudentProfile({
      name,
      kelas: kelas !== undefined ? kelas : studentClass.value,
      nis: nis !== undefined ? nis : studentNis.value,
    })
  }

  /**
   * Buka popup untuk ubah/edit nama
   */
  function openEditNameModal() {
    showNameModal.value = true
  }

  function closeNameModal() {
    showNameModal.value = false
  }

  /**
   * Cek apakah buku di-bookmark
   */
  function isBookmarked(bookId) {
    if (!bookId) return false
    return bookmarks.value.includes(bookId)
  }

  /**
   * Toggle bookmark ebook (tambah / hapus)
   */
  function toggleBookmark(bookId) {
    if (!bookId) return
    const idx = bookmarks.value.indexOf(bookId)
    if (idx > -1) {
      bookmarks.value.splice(idx, 1)
    } else {
      bookmarks.value.push(bookId)
    }
    localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(bookmarks.value))
  }

  /**
   * Dapatkan list objek ebook yang di-bookmark
   */
  const bookmarkedEbooks = computed(() => {
    return bookmarks.value
      .map((id) => getEbookById(id))
      .filter(Boolean)
  })

  /**
   * Rekam ebook terakhir yang dibaca ke localStorage
   */
  function recordLastRead(ebook) {
    if (!ebook || !ebook.id) return
    const data = {
      id: ebook.id,
      judul: ebook.judul,
      penulis: ebook.penulis,
      kategori: ebook.kategori,
      cover: ebook.cover,
      waktu: new Date().toISOString(),
    }
    lastRead.value = data
    localStorage.setItem(KEY_LAST_READ, JSON.stringify(data))
  }

  /**
   * Dapatkan objek ebook terakhir dibaca (sinkron dengan ebooks data)
   */
  const lastReadEbook = computed(() => {
    if (!lastRead.value?.id) return null
    const found = getEbookById(lastRead.value.id)
    return {
      ...lastRead.value,
      ebook: found || lastRead.value,
    }
  })

  function getReadingPosition(bookId) {
    return readingPositions.value.find((position) => position.id === bookId) || null
  }

  function saveReadingPosition(ebook, page) {
    if (!ebook?.id) return
    const savedPage = Math.max(1, Math.floor(Number(page) || 1))
    const position = {
      id: ebook.id,
      judul: ebook.judul,
      page: savedPage,
      waktu: new Date().toISOString(),
    }
    const index = readingPositions.value.findIndex((item) => item.id === ebook.id)
    if (index === -1) {
      readingPositions.value.unshift(position)
    } else {
      readingPositions.value.splice(index, 1, position)
    }
    localStorage.setItem(KEY_READING_POSITIONS, JSON.stringify(readingPositions.value))
  }

  function removeReadingPosition(bookId) {
    if (!bookId) return
    readingPositions.value = readingPositions.value.filter((position) => position.id !== bookId)
    localStorage.setItem(KEY_READING_POSITIONS, JSON.stringify(readingPositions.value))
  }

  return {
    studentName,
    studentNis,
    studentClass,
    studentKelas: studentClass,
    hasStudentName,
    hasStudentIdentity,
    showNameModal,
    setStudentName,
    setStudentProfile,
    openEditNameModal,
    closeNameModal,
    bookmarks,
    isBookmarked,
    toggleBookmark,
    bookmarkedEbooks,
    lastReadEbook,
    recordLastRead,
    readingPositions,
    getReadingPosition,
    saveReadingPosition,
    removeReadingPosition,
  }
}
