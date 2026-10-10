<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
// Jika worker di project Anda diimport dengan cara lain, samakan baris ini dengan yang sudah berhasil.
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { getEbookById } from '../data/ebooks'
import { downloadUrls, previewUrl, viewUrl } from '../data/drive'
import { useLiterasi } from '../composables/useLiterasi'
import { usePopularBooks } from '../composables/usePopularBooks'
import { startReadingTimer } from '../composables/useReadingTimer'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const props = defineProps({ id: String })
const ebook = computed(() => getEbookById(props.id))
const {
  isBookmarked,
  toggleBookmark,
  recordLastRead,
  readingPositions,
  getReadingPosition,
  saveReadingPosition,
  removeReadingPosition,
  studentNis,
  studentName,
  studentClass,
} = useLiterasi()
const { recordBookOpened } = usePopularBooks()

const status = ref('loading') // loading | ready | fallback
const page = ref(1)
const total = ref(0)
const zoom = ref(1)
const showReadingPositions = ref(false)
const addingCurrentPosition = ref(false)
const newPositionPage = ref(1)
const canvas = ref(null)
const wrap = ref(null)
const hasCurrentPosition = computed(() =>
  readingPositions.value.some((position) => position.id === ebook.value?.id)
)

// Sengaja bukan ref (objek PDF.js tidak boleh dibungkus proxy reaktif)
let pdfDoc = null
let renderTask = null
let renderToken = 0
let destroyed = false
let resizeTimer = null
let stopReadingTimer = null

watch(
  [studentNis, studentName, studentClass],
  ([nis, name, kelas]) => {
    stopReadingTimer?.()
    stopReadingTimer = null
    if (nis.trim() && name.trim() && kelas.trim()) {
      stopReadingTimer = startReadingTimer({ nis, name, kelas })
    }
  },
  { immediate: true }
)

async function loadPdf() {
  if (!ebook.value) return
  status.value = 'loading'
  for (const url of downloadUrls(ebook.value.id)) {
    try {
      const doc = await pdfjsLib.getDocument({ url }).promise
      if (destroyed) return doc.destroy()
      pdfDoc = doc
      total.value = doc.numPages
      const savedPosition = getReadingPosition(ebook.value.id)
      page.value = Math.min(Math.max(1, savedPosition?.page || 1), doc.numPages)
      status.value = 'ready'
      await nextTick()
      renderPage()
      return
    } catch (err) {
      console.warn('PDF.js gagal memuat:', url, err)
    }
  }
  status.value = 'fallback' // pakai Google Drive /preview
}

async function renderPage() {
  if (!pdfDoc || !canvas.value || !wrap.value) return
  const token = ++renderToken
  renderTask?.cancel()

  const pg = await pdfDoc.getPage(page.value)
  if (token !== renderToken) return

  const base = pg.getViewport({ scale: 1 })
  const lebar = Math.min(wrap.value.clientWidth, 1000)
  const viewport = pg.getViewport({ scale: (lebar / base.width) * zoom.value })
  const dpr = window.devicePixelRatio || 1

  const c = canvas.value
  c.width = Math.floor(viewport.width * dpr)
  c.height = Math.floor(viewport.height * dpr)
  c.style.width = `${viewport.width}px`
  c.style.height = `${viewport.height}px`

  renderTask = pg.render({
    canvasContext: c.getContext('2d'),
    viewport,
    transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
  })
  try {
    await renderTask.promise
  } catch (e) {
    if (e?.name !== 'RenderingCancelledException') console.error(e)
  }
}

function goTo(n) {
  const v = Math.min(Math.max(1, Number(n) || 1), total.value)
  page.value = v
}

function changeSavedPage(position, amount) {
  const updatedPage = Math.max(1, Number(position.page) + amount)
  updateSavedPage(position, updatedPage)
}

function updateSavedPage(position, value) {
  let updatedPage = Math.max(1, Math.floor(Number(value) || 1))
  if (position.id === ebook.value?.id && status.value === 'ready') {
    updatedPage = Math.min(updatedPage, total.value)
    goTo(updatedPage)
  }
  const savedEbook = getEbookById(position.id)
  saveReadingPosition(savedEbook || { id: position.id, judul: position.judul }, updatedPage)
}

function startAddingCurrentPosition() {
  newPositionPage.value = page.value
  addingCurrentPosition.value = true
}

function saveCurrentPosition() {
  const requestedPage = Math.max(1, Math.floor(Number(newPositionPage.value) || 1))
  const savedPage = total.value ? Math.min(requestedPage, total.value) : requestedPage
  saveReadingPosition(ebook.value, savedPage)
  addingCurrentPosition.value = false
}

const zoomIn = () => (zoom.value = Math.min(3, +(zoom.value + 0.25).toFixed(2)))
const zoomOut = () => (zoom.value = Math.max(0.5, +(zoom.value - 0.25).toFixed(2)))

watch(page, (currentPage) => {
  if (status.value === 'ready' && ebook.value && hasCurrentPosition.value) {
    saveReadingPosition(ebook.value, currentPage)
  }
})
watch([page, zoom], renderPage)

function onKey(e) {
  if (e.key === 'Escape' && showReadingPositions.value) {
    showReadingPositions.value = false
    return
  }
  if (showReadingPositions.value) return
  if (status.value !== 'ready' || e.target.tagName === 'INPUT') return
  if (e.key === 'ArrowRight') goTo(page.value + 1)
  if (e.key === 'ArrowLeft') goTo(page.value - 1)
}
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(renderPage, 200)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  if (ebook.value) {
    recordLastRead(ebook.value)
    recordBookOpened(ebook.value.id).catch((error) => {
      console.error('Gagal mencatat pembukaan ebook:', error)
    })
  }
  loadPdf()
})
onBeforeUnmount(() => {
  destroyed = true
  stopReadingTimer?.()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  renderTask?.cancel()
  pdfDoc?.destroy()
  pdfDoc = null
})
</script>

<template>
  <div v-if="ebook" class="min-h-[calc(100vh-4rem)] bg-stone-200/70">
    <!-- Toolbar -->
    <div class="sticky top-16 z-30 border-b border-[#4a1d1d]/20 bg-[#7F1D1D] text-amber-50 shadow-md">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 text-sm">
        <div class="flex min-w-0 items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <a :href="`#/buku/${encodeURIComponent(ebook.id)}`" class="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 transition hover:bg-white/20">← Kembali</a>
            <a href="#/koleksi" class="hidden shrink-0 rounded-lg px-3 py-1.5 transition hover:bg-white/10 sm:block">Koleksi</a>
            <span class="font-display block max-w-[180px] truncate font-semibold md:max-w-none">
              {{ ebook.judul }}
            </span>
          </div>


          <button
            type="button"
            @click="showReadingPositions = true"
            class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
          >
            <i class="bi bi-bookmark-check"></i>
            <span>Posisi baca</span>
          </button>
        </div>

        <div v-if="status === 'ready'" class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="font-semibold">Zoom</span>
            <button aria-label="Perkecil tampilan" class="rounded-lg bg-white/15 px-4 py-1.5 text-lg font-semibold transition hover:bg-white/25 disabled:opacity-40" :disabled="zoom <= 0.5" @click="zoomOut">−</button>
            <span class="w-12 text-center font-semibold">{{ Math.round(zoom * 100) }}%</span>
            <button aria-label="Perbesar tampilan" class="rounded-lg bg-white/15 px-4 py-1.5 text-lg font-semibold transition hover:bg-white/25 disabled:opacity-40" :disabled="zoom >= 3" @click="zoomIn">+</button>
          </div>
          <div class="flex items-center gap-2">
            <button aria-label="Halaman sebelumnya" class="rounded-lg bg-white/10 px-3 py-1.5 transition hover:bg-white/20 disabled:opacity-40" :disabled="page <= 1" @click="goTo(page - 1)">‹</button>
            <span class="flex items-center gap-1">
              <input
                :value="page" type="number" min="1" :max="total"
                class="w-14 rounded-md bg-white/10 px-2 py-1 text-center outline-none focus:bg-white/20"
                @change="goTo($event.target.value)"
              />
              <span class="opacity-80">/ {{ total }}</span>
            </span>
            <button aria-label="Halaman berikutnya" class="rounded-lg bg-white/10 px-3 py-1.5 transition hover:bg-white/20 disabled:opacity-40" :disabled="page >= total" @click="goTo(page + 1)">›</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showReadingPositions"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      @click.self="showReadingPositions = false"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-position-title"
        class="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div class="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <div>
            <h2 id="reading-position-title" class="font-display text-lg font-bold text-[#4a1d1d]">
              Posisi baca tersimpan
            </h2>
            <p class="mt-1 text-sm text-stone-500">
              Nomor halaman menunjukkan halaman terakhir yang dibaca. Edit angkanya atau gunakan +/−.
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup posisi baca"
            class="rounded-lg px-2 py-1 text-xl text-stone-500 hover:bg-stone-100"
            @click="showReadingPositions = false"
          >×</button>
        </div>

        <div class="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          <div
            v-if="!hasCurrentPosition"
            class="rounded-xl border border-amber-300 bg-amber-50 p-4"
          >
            <p class="font-semibold text-stone-800">{{ ebook.judul }}</p>
            <p class="mt-1 text-sm text-stone-600">
              Buku ini belum ada di catatan posisi baca. Mau ditambahkan?
            </p>
            <div v-if="addingCurrentPosition" class="mt-3 flex flex-wrap items-center gap-2">
              <div class="flex flex-col">
                <label for="new-reading-page" class="text-sm font-medium text-stone-700">
                  Halaman terakhir dibaca
                </label>
                <span class="text-xs text-stone-500">Contoh: 12</span>
              </div>
              <input
                id="new-reading-page"
                v-model.number="newPositionPage"
                type="number"
                min="1"
                :max="total || undefined"
                class="w-20 rounded-lg border border-stone-300 px-2 py-2 text-center text-sm outline-none focus:border-amber-500"
                @keydown.enter="saveCurrentPosition"
              />
              <button
                type="button"
                class="rounded-lg bg-[#7F1D1D] px-3 py-2 text-sm font-semibold text-white hover:bg-[#681818]"
                @click="saveCurrentPosition"
              >Simpan</button>
              <button
                type="button"
                class="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-amber-100"
                @click="addingCurrentPosition = false"
              >Batal</button>
            </div>
            <button
              v-else
              type="button"
              class="mt-3 rounded-lg bg-[#7F1D1D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#681818]"
              @click="startAddingCurrentPosition"
            >Tambah</button>
          </div>

          <div
            v-for="position in readingPositions"
            :key="position.id"
            class="flex items-center gap-3 rounded-xl border p-3"
            :class="position.id === ebook.id
              ? 'border-amber-400 bg-amber-50'
              : 'border-stone-200 bg-white'"
          >
            <div class="min-w-0 flex-1">
              <span class="block truncate font-semibold text-stone-800">{{ position.judul }}</span>
              <span
                v-if="position.id === ebook.id"
                class="mt-0.5 block text-xs font-medium text-amber-800"
              >Sedang dibaca · nomor halaman bisa diedit</span>
            </div>
            <div v-if="position.id === ebook.id" class="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                :aria-label="`Kurangi halaman ${position.judul}`"
                class="h-9 w-9 rounded-lg bg-stone-100 text-lg font-semibold text-stone-700 hover:bg-stone-200 disabled:opacity-40"
                :disabled="position.page <= 1"
                @click="changeSavedPage(position, -1)"
              >−</button>
              <div class="flex flex-col items-center">
                <label
                  class="text-[10px] leading-tight text-stone-500"
                  :for="`saved-page-${position.id}`"
                >Halaman terakhir</label>
                <input
                  :id="`saved-page-${position.id}`"
                  :value="position.page"
                  type="number"
                  min="1"
                  :max="total || undefined"
                  class="w-16 rounded-lg border border-stone-300 px-2 py-2 text-center text-sm outline-none focus:border-amber-500"
                  @change="updateSavedPage(position, $event.target.value)"
                />
              </div>
              <button
                type="button"
                :aria-label="`Tambah halaman ${position.judul}`"
                class="h-9 w-9 rounded-lg bg-stone-100 text-lg font-semibold text-stone-700 hover:bg-stone-200 disabled:opacity-40"
                :disabled="total > 0 && position.page >= total"
                @click="changeSavedPage(position, 1)"
              >+</button>
            </div>
            <span
              v-else
              class="shrink-0 rounded-lg bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-600"
            >Hal. {{ position.page }}</span>
            <button
              type="button"
              :aria-label="`Hapus catatan posisi baca ${position.judul}`"
              :title="`Hapus catatan ${position.judul}`"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600"
              @click="removeReadingPosition(position.id)"
            >
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
          <p v-if="!readingPositions.length && hasCurrentPosition" class="py-6 text-center text-sm text-stone-500">
            Belum ada posisi baca tersimpan.
          </p>
        </div>
      </section>
    </div>

    <!-- Area baca -->
    <div ref="wrap" class="mx-auto max-w-5xl ">
      <div v-if="status === 'loading'" class="flex flex-col items-center py-32 text-[#4a1d1d]">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#7F1D1D]/20 border-t-[#7F1D1D]"></div>
        <p class="mt-4 text-sm">Membuka ebook…</p>
      </div>

      <div v-show="status === 'ready'" class="overflow-auto">
        <canvas ref="canvas" class="mx-auto block rounded bg-white shadow-2xl"></canvas>
      </div>

      <div v-if="status === 'fallback'">
        <!-- <p class="mb-3 rounded-lg bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
          Mode pratinjau Google Drive digunakan karena file tidak dapat dimuat langsung.
        </p> -->
  
        <iframe
          :src="previewUrl(ebook.id)"
          class="h-[80vh] w-full bg-white shadow-2xl"
          allow="autoplay"
          title="Pratinjau Ebook"
        ></iframe>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto max-w-xl px-5 py-24 text-center">
    <h1 class="font-display mt-4 text-2xl font-bold text-[#4a1d1d]">Ebook tidak ditemukan</h1>
    <a href="#/koleksi" class="mt-6 inline-block rounded-xl bg-[#7F1D1D] px-6 py-3 font-semibold text-amber-50">Kembali ke Koleksi</a>
  </div>
</template>
