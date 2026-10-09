import { ref } from 'vue'
import { rtdb } from '../services/firebase'
import {
  ref as dbRef,
  onValue,
  push,
  set,
  update,
  remove,
  serverTimestamp
} from 'firebase/database'

const KEY_LIKED_PUISI = 'literasi_liked_puisi_ids'
const PUISI_RETENTION_MS = 30 * 24 * 60 * 60 * 1000

const puisiList = ref([])
const isLoading = ref(true)
const likedIds = ref([])
let isListenerActive = false
const pendingExpiryDeletes = new Set()

// Inisialisasi daftar puisi yang sudah di-like di browser ini
try {
  const saved = localStorage.getItem(KEY_LIKED_PUISI)
  likedIds.value = saved ? JSON.parse(saved) : []
} catch (e) {
  likedIds.value = []
}

function saveLikedIds() {
  try {
    localStorage.setItem(KEY_LIKED_PUISI, JSON.stringify(likedIds.value))
  } catch (e) {
    console.error(e)
  }
}

export function usePuisi() {
  // Inisialisasi listener Firebase Realtime Database sekali saja
  if (!isListenerActive && typeof window !== 'undefined') {
    isListenerActive = true

    try {
      const puisiRef = dbRef(rtdb, 'karya_puisi')

      onValue(puisiRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const list = []
          const expiryCutoff = Date.now() - PUISI_RETENTION_MS
          Object.keys(data).forEach((key) => {
            const item = data[key]
            const createdAt = Number(item.createdAt) || 0
            if (createdAt && createdAt <= expiryCutoff) {
              if (!pendingExpiryDeletes.has(key)) {
                pendingExpiryDeletes.add(key)
                remove(dbRef(rtdb, `karya_puisi/${key}`)).then(
                  () => pendingExpiryDeletes.delete(key),
                  (error) => {
                    pendingExpiryDeletes.delete(key)
                    console.error(`Gagal menghapus puisi kedaluwarsa ${key}:`, error)
                  }
                )
              }
              return
            }

            const comments = item.komentar
              ? Object.entries(item.komentar).map(([commentId, comment]) => ({
                  id: commentId,
                  nama: comment.nama || 'Siswa',
                  kelas: comment.kelas || '',
                  isi: comment.isi || '',
                  createdAt: Number(comment.createdAt) || 0
                }))
              : []
            list.push({
              id: key,
              judul: item.judul || 'Tanpa Judul',
              penulis: item.penulis || 'Siswa Literasi',
              pemilikNis: String(item.pemilikNis || ''),
              kelas: item.kelas || '',
              kategori: item.kategori || 'Bebas',
              isi: item.isi || '',
              likes: Number(item.likes || 0),
              createdAt: Number(item.createdAt) || 0,
              comments
            })
          })
          // Urutkan dari yang terbaru
          puisiList.value = list.sort((a, b) => b.createdAt - a.createdAt)
        } else {
          puisiList.value = []
        }
        isLoading.value = false
      }, (error) => {
        console.warn('Firebase reading puisi error:', error)
        isLoading.value = false
      })
    } catch (err) {
      console.warn('Firebase init puisi error:', err)
      isLoading.value = false
    }
  }

  /**
   * Tambah karya puisi baru ke Firebase
   */
  async function tambahPuisi({ judul, penulis, pemilikNis, kelas, kategori, isi }) {
    if (!judul?.trim() || !penulis?.trim() || !pemilikNis?.trim() || !isi?.trim()) {
      throw new Error('NIS, nama penulis, judul, dan isi puisi wajib diisi.')
    }

    const payload = {
      judul: judul.trim(),
      penulis: penulis?.trim() || 'Siswa SMKN Campalagian',
      pemilikNis: pemilikNis.trim(),
      kelas: kelas?.trim() || '',
      kategori: kategori || 'Bebas',
      isi: isi.trim(),
      likes: 0,
      createdAt: serverTimestamp()
    }

    try {
      const puisiRef = dbRef(rtdb, 'karya_puisi')
      const newRef = push(puisiRef)
      await set(newRef, payload)
      return newRef.key
    } catch (err) {
      console.error('Gagal menambahkan puisi:', err)
      // Fallback lokal jika offline
      const localItem = {
        id: 'local-' + Date.now(),
        ...payload,
        createdAt: Date.now()
      }
      puisiList.value.unshift(localItem)
      return localItem.id
    }
  }

  async function tambahKomentar(puisiId, isi, { nama, kelas } = {}) {
    const target = puisiList.value.find((puisi) => puisi.id === puisiId)
    const cleanText = String(isi || '').trim()
    const cleanName = String(nama || '').trim()

    if (!target || !cleanName || !cleanText || cleanText.length > 500) {
      throw new Error('Komentar harus berisi 1-500 karakter dan nama profil siswa.')
    }

    const comment = {
      nama: cleanName,
      kelas: String(kelas || '').trim(),
      isi: cleanText,
      createdAt: Date.now()
    }

    if (puisiId.startsWith('sample-') || puisiId.startsWith('local-')) {
      target.comments ||= []
      target.comments.push({ id: `local-comment-${Date.now()}`, ...comment })
      return
    }

    try {
      const commentsRef = dbRef(rtdb, `karya_puisi/${puisiId}/komentar`)
      const newCommentRef = push(commentsRef)
      await set(newCommentRef, { ...comment, createdAt: serverTimestamp() })
    } catch (err) {
      console.error('Gagal menambahkan komentar ke Firebase:', err)
      throw new Error('Komentar gagal dikirim. Periksa koneksi lalu coba lagi.')
    }
  }

  /**
   * Perbarui karya puisi milik siswa yang sedang menggunakan profil ini
   */
  async function editPuisi(puisiId, { judul, kelas, kategori, isi }, { nis, name } = {}) {
    if (!puisiId || !judul?.trim() || !isi?.trim()) {
      throw new Error('Judul dan isi puisi wajib diisi.')
    }

    const target = puisiList.value.find((puisi) => puisi.id === puisiId)
    const normalizedEditor = String(name || '').trim().toLocaleLowerCase()
    const normalizedAuthor = String(target?.penulis || '').trim().toLocaleLowerCase()
    const editorNis = String(nis || '').trim()

    if (!target || !editorNis || editorNis !== String(target.pemilikNis || '').trim() || !normalizedEditor || normalizedEditor !== normalizedAuthor) {
      throw new Error('NIS dan nama profil harus sama dengan identitas pemilik puisi.')
    }

    if (puisiId.startsWith('sample-')) {
      throw new Error('Puisi contoh tidak dapat diedit.')
    }

    const changes = {
      judul: judul.trim(),
      kelas: kelas?.trim() || '',
      kategori: kategori || 'Bebas & Inspirasi',
      isi: isi.trim()
    }

    if (puisiId.startsWith('local-')) {
      Object.assign(target, changes)
      return
    }

    try {
      const itemRef = dbRef(rtdb, `karya_puisi/${puisiId}`)
      await update(itemRef, changes)
      Object.assign(target, changes)
    } catch (err) {
      console.error('Gagal memperbarui puisi di Firebase:', err)
      throw err
    }
  }

  /**
   * Cek apakah puisi sudah di-like
   */
  function hasLiked(puisiId) {
    return likedIds.value.includes(puisiId)
  }

  /**
   * Toggle Like pada puisi
   */
  async function toggleLike(puisiId) {
    if (!puisiId) return
    const isLiked = hasLiked(puisiId)
    const target = puisiList.value.find((p) => p.id === puisiId)

    if (isLiked) {
      // Hapus like
      likedIds.value = likedIds.value.filter((id) => id !== puisiId)
      if (target && target.likes > 0) target.likes--
    } else {
      // Beri like
      likedIds.value.push(puisiId)
      if (target) target.likes = (target.likes || 0) + 1
    }
    saveLikedIds()

    // Sinkronkan ke Firebase jika bukan sample
    if (target && !puisiId.startsWith('sample-') && !puisiId.startsWith('local-')) {
      try {
        const itemRef = dbRef(rtdb, `karya_puisi/${puisiId}`)
        await update(itemRef, { likes: Math.max(0, target.likes) })
      } catch (err) {
        console.warn('Gagal update like ke Firebase:', err)
      }
    }
  }

  /**
   * Hapus karya puisi dari database Firebase
   */
  async function hapusPuisi(puisiId) {
    if (!puisiId) return

    // Hapus dari state lokal
    puisiList.value = puisiList.value.filter((p) => p.id !== puisiId)

    // Jika tersimpan di Firebase, hapus nodenya
    if (!puisiId.startsWith('sample-') && !puisiId.startsWith('local-')) {
      try {
        const itemRef = dbRef(rtdb, `karya_puisi/${puisiId}`)
        await remove(itemRef)
      } catch (err) {
        console.error('Gagal menghapus puisi dari Firebase:', err)
        throw err
      }
    }
  }

  return {
    puisiList,
    isLoading,
    tambahPuisi,
    tambahKomentar,
    editPuisi,
    hapusPuisi,
    toggleLike,
    hasLiked
  }
}
