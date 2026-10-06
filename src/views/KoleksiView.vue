<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import SearchFilter from '../components/SearchFilter.vue'
import EbookGrid from '../components/EbookGrid.vue'
import { ebooks, getKategori } from '../data/ebooks'
import { filter } from '../data/filter'

const BATCH_SIZE = 10
const displayLimit = ref(BATCH_SIZE)
const isLoadingMore = ref(false)
const sentinelRef = ref(null)

const daftarKategori = getKategori()

const hasil = computed(() => {
  const q = filter.query.trim().toLowerCase()
  return ebooks.filter(
    (e) =>
      (!filter.kategori || e.kategori === filter.kategori) &&
      (!q || e.judul.toLowerCase().includes(q) || e.penulis.toLowerCase().includes(q))
  )
})

const ebooksTampil = computed(() => {
  return hasil.value.slice(0, displayLimit.value)
})

const hasMore = computed(() => {
  return displayLimit.value < hasil.value.length
})

// Reset limit saat pencarian atau filter kategori berubah
watch([() => filter.query, () => filter.kategori], () => {
  displayLimit.value = BATCH_SIZE
})

function loadMore() {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    displayLimit.value += BATCH_SIZE
    isLoadingMore.value = false
  }, 300)
}

function reset() {
  filter.query = ''
  filter.kategori = ''
  displayLimit.value = BATCH_SIZE
}

let sentinelObserver = null

function observeSentinel(el) {
  if (!el || typeof IntersectionObserver === 'undefined') return
  if (sentinelObserver) sentinelObserver.disconnect()

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        if (hasMore.value && !isLoadingMore.value) {
          loadMore()
        }
      }
    },
    {
      rootMargin: '160px',
    }
  )

  sentinelObserver.observe(el)
}

watch(sentinelRef, (newEl) => {
  if (newEl) {
    observeSentinel(newEl)
  }
})

onMounted(() => {
  if (sentinelRef.value) {
    observeSentinel(sentinelRef.value)
  }
})

onBeforeUnmount(() => {
  if (sentinelObserver) {
    sentinelObserver.disconnect()
    sentinelObserver = null
  }
})
</script>

<template>
  <div>
    <div class="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      <SearchFilter v-model:query="filter.query" v-model:kategori="filter.kategori" :daftar-kategori="daftarKategori" />

      <div class="mb-6 mt-8 flex items-center justify-between text-sm text-stone-500">
        <p>
          Menampilkan <span class="font-semibold text-[#4a1d1d]">{{ ebooksTampil.length }}</span> dari
          <span class="font-semibold text-[#4a1d1d]">{{ hasil.length }}</span> ebook
        </p>
        <button v-if="filter.query || filter.kategori" class="font-medium text-[#7F1D1D] hover:underline" @click="reset">
          Reset Filter
        </button>
      </div>

      <EbookGrid :ebooks="ebooksTampil" empty-text="Ebook tidak ditemukan." />

      <!-- Sentinel & Indikator Scroll Bertambah Buku -->
      <div v-if="hasMore" ref="sentinelRef" class="py-8 flex flex-col items-center justify-center">
        <div
          v-if="isLoadingMore"
          class="flex items-center gap-2.5 rounded-full bg-white/95 border border-amber-900/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#7F1D1D] shadow-sm backdrop-blur animate-pulse"
        >
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#7F1D1D] border-t-transparent"></span>
          <span>Memuat buku berikutnya...</span>
        </div>
        <button
          v-else
          type="button"
          @click="loadMore"
          class="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-white hover:text-[#7F1D1D] transition shadow-sm"
        >
          <i class="bi bi-chevron-down animate-bounce"></i>
          <span>Gulir ke bawah atau klik untuk memuat lebih banyak</span>
        </button>
      </div>

      <!-- Indikator Semua Buku Sudah Tampil -->
      <div v-else-if="hasil.length > BATCH_SIZE" class="mt-12 mb-6 flex flex-col items-center justify-center gap-1.5 py-6 text-center border-t border-stone-200/60">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/80 border border-stone-200/80 px-4 py-1.5 text-xs font-semibold text-stone-600 shadow-sm">
          <i class="bi bi-check2-circle text-[#7F1D1D] text-sm"></i>
          <span>Semua {{ hasil.length }} ebook telah ditampilkan</span>
        </div>
      </div>
    </div>
  </div>
</template>
