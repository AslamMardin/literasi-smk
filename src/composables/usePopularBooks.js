import { computed, ref } from 'vue'
import { ref as dbRef, onValue, runTransaction } from 'firebase/database'
import { rtdb } from '../services/firebase'
import { ebooks, getEbookById } from '../data/ebooks'

const COUNTS_PATH = 'statistik_buku_dibuka'
const bookCounts = ref({})
const isLoading = ref(true)
let isListenerActive = false

export function usePopularBooks() {
  if (!isListenerActive && typeof window !== 'undefined') {
    isListenerActive = true

    onValue(
      dbRef(rtdb, COUNTS_PATH),
      (snapshot) => {
        const value = snapshot.val()
        bookCounts.value = value && typeof value === 'object' ? value : {}
        isLoading.value = false
      },
      (error) => {
        console.error('Gagal membaca statistik buku:', error)
        isLoading.value = false
      }
    )
  }

  const mostOpenedBooks = computed(() =>
    Object.entries(bookCounts.value)
      .map(([id, count]) => ({
        ebook: getEbookById(id),
        openCount: Number(count),
      }))
      .filter(({ ebook, openCount }) => ebook && Number.isFinite(openCount) && openCount > 0)
      .sort((a, b) => b.openCount - a.openCount)
      .slice(0, 5)
      .map(({ ebook, openCount }) => ({ ...ebook, openCount }))
  )

  async function recordBookOpened(bookId) {
    if (!ebooks.some((ebook) => ebook.id === bookId)) {
      throw new Error(`Ebook tidak ditemukan: ${bookId}`)
    }

    const countRef = dbRef(rtdb, `${COUNTS_PATH}/${bookId}`)
    await runTransaction(countRef, (currentCount) => {
      const count = Number(currentCount)
      return Number.isSafeInteger(count) && count > 0 ? count + 1 : 1
    })
  }

  return {
    mostOpenedBooks,
    isLoading,
    recordBookOpened,
  }
}
