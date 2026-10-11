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
import { installPrompt, promptPwaInstall } from '../composables/usePwaInstall'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const props = defineProps({ id: String })
const ebook = computed(() => getEbookById(props.id))
const showInstallNotice = ref(false)
const showIosInstallInstructions = ref(false)
const installDismissed = ref(false)
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
let installNoticeTimer = null
let installNoticeDelayElapsed = false

const installDismissedKey = 'literasi-install-notice-dismissed'

async function promptInstall() {
  const outcome = await promptPwaInstall()
  showInstallNotice.value = false
  if (outcome !== 'accepted') {
    dismissInstallNotice()
  }
}

function dismissInstallNotice() {
  showInstallNotice.value = false
  showIosInstallInstructions.value = false
  installDismissed.value = true
  localStorage.setItem(installDismissedKey, 'true')
}

function maybeShowInstallNotice() {
  if (
    !installNoticeDelayElapsed ||
    installDismissed.value ||
    window.matchMedia('(display-mode: standalone)').matches
  ) return

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  if (installPrompt.value || isIos) {
    showInstallNotice.value = true
    showIosInstallInstructions.value = isIos && !installPrompt.value
  }
}

function scheduleInstallNotice() {
  if (installDismissed.value || window.matchMedia('(display-mode: standalone)').matches) return

  installNoticeTimer = setTimeout(() => {
    installNoticeDelayElapsed = true
    maybeShowInstallNotice()
  }, 30_000)
}

watch(installPrompt, maybeShowInstallNotice)

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
      scheduleInstallNotice()
      await nextTick()
      renderPage()
      return
    } catch (err) {
      console.warn('PDF.js gagal memuat:', url, err)
    }
  }
  status.value = 'fallback' // pakai Google Drive /preview
  scheduleInstallNotice()
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

function confirmRemoveReadingPosition(position) {
  if (window.confirm(`Hapus posisi baca untuk "${position.judul}"?`)) {
    removeReadingPosition(position.id)
  }
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
  installDismissed.value = localStorage.getItem(installDismissedKey) === 'true'
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
  clearTimeout(installNoticeTimer)
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
        <div class="flex min-w-0 items-center justify-between gap-1 sm:gap-3">
          <div class="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
            <a :href="`#/buku/${encodeURIComponent(ebook.id)}`" aria-label="Kembali ke detail buku" class="shrink-0 rounded-lg bg-white/10 px-2 py-1.5 transition hover:bg-white/20 sm:px-3">
              <i class="bi bi-arrow-left sm:hidden" aria-hidden="true"></i>
              <span class="hidden sm:inline">← Kembali</span>
            </a>
            <a href="#/koleksi" class="hidden shrink-0 rounded-lg px-3 py-1.5 transition hover:bg-white/10 sm:block">Koleksi</a>
            <span class="font-display block min-w-0 max-w-[110px] truncate font-semibold sm:max-w-[180px] md:max-w-none">
              {{ ebook.judul }}
            </span>
          </div>


          <div class="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
            <button
              type="button"
              :aria-label="isBookmarked(ebook.id) ? 'Hapus dari bookmark' : 'Tambahkan ke bookmark'"
              :title="isBookmarked(ebook.id) ? 'Hapus dari bookmark' : 'Tambahkan ke bookmark'"
              @click="toggleBookmark(ebook.id)"
              class="flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold transition hover:bg-white/20 sm:px-3"
            >
              <i :class="isBookmarked(ebook.id) ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'"></i>
              <span class="hidden sm:inline">{{ isBookmarked(ebook.id) ? 'Tersimpan' : 'Bookmark' }}</span>
            </button>
            <button
              type="button"
              :aria-label="`Posisi baca, ${readingPositions.length} tersimpan`"
              @click="showReadingPositions = true"
              class="flex items-center gap-1.5 rounded-lg bg-amber-300 px-2 py-1.5 text-xs font-semibold text-[#4a1d1d] transition hover:bg-amber-400 sm:px-3"
            >
              <i class="bi bi-bookmark-check"></i>
              <span class="hidden sm:inline">Posisi baca</span>
              <span class="rounded-full bg-amber-950 px-1.5 py-0.5  text-white text-[10px] leading-none">
                {{ readingPositions.length }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="status === 'ready'" class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1 sm:gap-2">
            <span class="hidden font-semibold sm:inline">Zoom</span>
            <button aria-label="Perkecil tampilan" class="rounded-lg bg-white/15 px-3 py-1.5 text-lg font-semibold transition hover:bg-white/25 disabled:opacity-40 sm:px-4" :disabled="zoom <= 0.5" @click="zoomOut">−</button>
            <span class="w-10 text-center font-semibold sm:w-12">{{ Math.round(zoom * 100) }}%</span>
            <button aria-label="Perbesar tampilan" class="rounded-lg bg-white/15 px-3 py-1.5 text-lg font-semibold transition hover:bg-white/25 disabled:opacity-40 sm:px-4" :disabled="zoom >= 3" @click="zoomIn">+</button>
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
      @click.self="showReadingPositions = false"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-position-title"
        class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[85vh]"
      >
        <div class="flex shrink-0 items-start justify-between gap-3 border-b border-stone-200 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
          <div>
            <h2 id="reading-position-title" class="font-display text-base font-bold text-[#4a1d1d] sm:text-lg">
              Posisi baca<span class="hidden sm:inline"> tersimpan</span>
            </h2>
            <p class="mt-1  text-sm text-stone-500 ">
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

        <div class="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 sm:p-4">
          <div
            v-if="!hasCurrentPosition"
            class="rounded-xl border border-amber-300 bg-amber-50 p-4"
          >
            <p class="font-semibold text-stone-800">{{ ebook.judul }}</p>
            <p class="mt-1 hidden text-sm text-stone-600 sm:block">
              Buku ini belum ada di catatan posisi baca. Mau ditambahkan?
            </p>
            <div v-if="addingCurrentPosition" class="mt-3 flex flex-wrap items-center gap-2">
              <div class="flex flex-col">
                <label for="new-reading-page" class="sr-only text-sm font-medium text-stone-700 sm:not-sr-only">
                  Halaman terakhir dibaca
                </label>
                <span class="hidden text-xs text-stone-500 sm:inline">Contoh: 12</span>
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
                aria-label="Simpan posisi baca"
                class="rounded-lg bg-[#7F1D1D] px-3 py-2 text-sm font-semibold text-white hover:bg-[#681818]"
                @click="saveCurrentPosition"
              ><i class="bi bi-check-lg sm:hidden" aria-hidden="true"></i><span class="hidden sm:inline">Simpan</span></button>
              <button
                type="button"
                aria-label="Batal menambahkan posisi baca"
                class="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-amber-100"
                @click="addingCurrentPosition = false"
              ><i class="bi bi-x-lg sm:hidden" aria-hidden="true"></i><span class="hidden sm:inline">Batal</span></button>
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
            class="flex items-center gap-2 rounded-xl border p-2.5 sm:gap-3 sm:p-3"
            :class="position.id === ebook.id
              ? 'border-amber-400 bg-amber-50'
              : 'border-stone-200 bg-white'"
          >
            <div class="min-w-0 flex-1">
              <span class="block truncate font-semibold text-stone-800">{{ position.judul }}</span>
              <span
                v-if="position.id === ebook.id"
                class="mt-0.5 hidden text-xs font-medium text-amber-800 sm:block"
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
                  class="sr-only text-[10px] leading-tight text-stone-500 sm:not-sr-only"
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
              class="shrink-0 rounded-lg bg-stone-100 px-2 py-2 text-sm font-semibold text-stone-600 sm:px-3"
            ><span class="hidden sm:inline">Hal. </span>{{ position.page }}</span>
            <button
              type="button"
              :aria-label="`Hapus catatan posisi baca ${position.judul}`"
              :title="`Hapus catatan ${position.judul}`"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600"
              @click="confirmRemoveReadingPosition(position)"
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

    <aside
      v-if="showInstallNotice"
      class="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-4 text-[#4a1d1d] shadow-2xl sm:inset-x-auto sm:right-6"
      aria-labelledby="install-notice-title"
    >
      <div class="flex items-start gap-3">
        <img src="/pwa-192.png" alt="" class="h-11 w-11 shrink-0 rounded-xl">
        <div class="min-w-0 flex-1">
          <h2 id="install-notice-title" class="font-display font-bold">Akses Literasi lebih mudah</h2>
          <p class="mt-1 text-sm text-stone-600">
            Tambahkan ke layar utama agar mudah dibuka kembali.
          </p>
          <p v-if="showIosInstallInstructions" class="mt-2 text-sm text-stone-700">
            Ketuk <strong>Bagikan</strong> di Safari, lalu pilih
            <strong>Tambahkan ke Layar Utama</strong>.
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-if="installPrompt"
              type="button"
              class="rounded-lg bg-[#7F1D1D] px-3 py-2 text-sm font-semibold text-amber-50 transition hover:bg-[#631717]"
              @click="promptInstall"
            >Pasang</button>
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
              @click="dismissInstallNotice"
            >Nanti</button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Tutup pemberitahuan pemasangan"
          class="-mr-2 -mt-2 rounded-lg px-2 py-1 text-xl text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          @click="dismissInstallNotice"
        >×</button>
      </div>
    </aside>

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
