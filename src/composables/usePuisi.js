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

// Contoh puisi & Kalindaqdaq awal (agar langsung berisi karya sastra indah)
const initialSamples = [
  {
    id: 'sample-1',
    judul: 'Kalindaqdaq Pesan Leluhur',
    penulis: 'Kearifan Sastra Mandar',
    kelas: 'Warisan Leluhur',
    kategori: 'Kalindaqdaq Mandar',
    isi: 'Mamballang paiq litaq\nPariama di pambare-bareang\nSiruntung tanda pau\nPallaki pole di Balanipa',
    likes: 18,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'sample-2',
    judul: 'Layar Sandeq Menerjang Badai',
    penulis: 'Ahmad Fauzi',
    kelas: 'X TKJ 1',
    kategori: 'Alam & Budaya Mandar',
    isi: 'Di bawah terik langit Selat Makassar\nLayar segitiga mengembang gagah\nMenembus gelombang tanpa gentar\nMembawa mimpi anak Mandar yang megah.',
    likes: 24,
    createdAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: 'sample-3',
    judul: 'Lentera di Ruang Kelas',
    penulis: 'Rani Nurfadillah',
    kelas: 'XI RPL',
    kategori: 'Sekolah & Cita-Cita',
    isi: 'Buku terbuka di meja kayu\nJari-jemari menari di atas tuts tuts ilmu\nDi SMKN Campalagian kami bertumpu\nMerajut masa depan di tanah kelahiranku.',
    likes: 15,
    createdAt: Date.now() - 1000 * 60 * 60 * 2
  }
]

const puisiList = ref([])
const isLoading = ref(true)
const likedIds = ref([])
let isListenerActive = false

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
          Object.keys(data).forEach((key) => {
            const item = data[key]
            list.push({
              id: key,
              judul: item.judul || 'Tanpa Judul',
              penulis: item.penulis || 'Siswa Literasi',
              pemilikNis: String(item.pemilikNis || ''),
              kelas: item.kelas || '',
              kategori: item.kategori || 'Bebas',
              isi: item.isi || '',
              likes: Number(item.likes || 0),
              createdAt: item.createdAt || Date.now()
            })
          })
          // Urutkan dari yang terbaru
          puisiList.value = list.sort((a, b) => b.createdAt - a.createdAt)
        } else {
          // Jika di database masih kosong, gunakan data sample
          puisiList.value = [...initialSamples]
        }
        isLoading.value = false
      }, (error) => {
        console.warn('Firebase reading puisi error:', error)
        if (puisiList.value.length === 0) {
          puisiList.value = [...initialSamples]
        }
        isLoading.value = false
      })
    } catch (err) {
      console.warn('Firebase init puisi error:', err)
      puisiList.value = [...initialSamples]
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
    editPuisi,
    hapusPuisi,
    toggleLike,
    hasLiked
  }
}
