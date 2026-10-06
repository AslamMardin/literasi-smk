<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  sejarahArticles,
  sejarahCategories,
  getSejarahById,
  getFeaturedSejarah
} from '../data/sejarah'

const props = defineProps({
  id: String
})

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const selectedArticle = ref(null)
const copied = ref(false)

// Cek apakah ada artikel aktif dari URL props / hash
function updateSelectedFromRoute() {
  if (props.id) {
    const found = getSejarahById(props.id)
    if (found) {
      selectedArticle.value = found
      window.scrollTo(0, 0)
      return
    }
  }
  selectedArticle.value = null
}

onMounted(() => {
  updateSelectedFromRoute()
})

watch(() => props.id, () => {
  updateSelectedFromRoute()
})

const featured = computed(() => getFeaturedSejarah())

const filteredArticles = computed(() => {
  return sejarahArticles.filter((a) => {
    const matchCat =
      selectedCategory.value === 'Semua' || a.kategori === selectedCategory.value

    const q = searchQuery.value.toLowerCase().trim()
    const matchQuery =
      !q ||
      a.judul.toLowerCase().includes(q) ||
      a.isi.toLowerCase().includes(q) ||
      a.kategori.toLowerCase().includes(q)

    return matchCat && matchQuery
  })
})

function openArticle(article) {
  window.location.hash = `#/sejarah/${encodeURIComponent(article.id)}`
  selectedArticle.value = article
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeArticle() {
  window.location.hash = '#/sejarah'
  selectedArticle.value = null
}

function nextArticle() {
  if (!selectedArticle.value) return
  const currentNo = selectedArticle.value.no
  const next = sejarahArticles.find((a) => a.no === currentNo + 1)
  if (next) openArticle(next)
}

function prevArticle() {
  if (!selectedArticle.value) return
  const currentNo = selectedArticle.value.no
  const prev = sejarahArticles.find((a) => a.no === currentNo - 1)
  if (prev) openArticle(prev)
}

function copyArticleLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

/**
 * Format markdown teks sederhana menjadi HTML (header, bullet, blockquote, tabel)
 */
function formatMarkdown(text) {
  if (!text) return ''

  let html = text
    // Replace markdown headers ### dan ##
    .replace(/^### (.*$)/gim, '<h3 class="font-display text-lg font-bold text-[#4a1313] mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-display text-xl font-bold text-[#7F1D1D] mt-8 mb-3 border-b border-[#7F1D1D]/10 pb-1.5">$1</h2>')
    // Blockquote
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-amber-500 bg-amber-50/70 p-4 my-4 rounded-r-xl italic text-stone-700">$1</blockquote>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-stone-900">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Bullet points
    .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc text-stone-700 mb-1">$1</li>')

  // Ubah baris ganda menjadi paragraf
  const paragraphs = html.split(/\n\n+/)
  return paragraphs
    .map((p) => {
      const trimmed = p.trim()
      if (
        trimmed.startsWith('<h2') ||
        trimmed.startsWith('<h3') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed
      }
      return `<p class="my-3 leading-relaxed text-stone-700 text-sm sm:text-base">${trimmed.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}
</script>

<template>
  <div class="pb-24">
    <!-- JIKA SEDANG MEMBACA DETAIL ARTIKEL (READER MODE) -->
    <div v-if="selectedArticle" class="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
      <!-- Breadcrumb & Tombol Kembali -->
      <div class="mb-6 flex items-center justify-between">
        <button
          type="button"
          @click="closeArticle"
          class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#7F1D1D] shadow-sm ring-1 ring-[#7F1D1D]/10 transition hover:bg-[#7F1D1D] hover:text-white"
        >
          <i class="bi bi-arrow-left"></i>
          <span>Kembali ke Daftar Sejarah</span>
        </button>

        <button
          type="button"
          @click="copyArticleLink"
          class="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
        >
          <i class="bi" :class="copied ? 'bi-check-lg text-emerald-600' : 'bi-share'"></i>
          <span>{{ copied ? 'Link Tersalin!' : 'Bagikan' }}</span>
        </button>
      </div>

      <!-- Kartu Artikel Lengkap -->
      <article class="overflow-hidden rounded-3xl bg-white p-6 sm:p-10 shadow-xl shadow-[#7F1D1D]/5 ring-1 ring-[#7F1D1D]/10">
        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-[#7F1D1D] px-3 py-1 font-bold text-amber-50">
            Bab {{ selectedArticle.no }}
          </span>
          <span class="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-950">
            {{ selectedArticle.kategori }}
          </span>
          <span class="text-stone-400 font-medium">
            • {{ selectedArticle.bacaMenit }}
          </span>
        </div>

        <!-- Judul Besar -->
        <h1 class="font-display mt-4 text-2xl sm:text-4xl font-bold leading-tight text-[#4a1313]">
          {{ selectedArticle.judul }}
        </h1>

        <!-- Garis Aksen Emas -->
        <div class="my-6 h-1 w-20 bg-gradient-to-r from-amber-400 to-[#7F1D1D] rounded-full"></div>

        <!-- Isi Artikel (HTML Rendered) -->
        <div
          class="prose prose-stone max-w-none text-stone-800 leading-relaxed font-sans"
          v-html="formatMarkdown(selectedArticle.isi)"
        ></div>

        <!-- Footer Navigasi Bab (Sebelum & Sesudah) -->
        <div class="mt-12 flex items-center justify-between border-t border-stone-100 pt-6">
          <button
            type="button"
            v-if="selectedArticle.no > 1"
            @click="prevArticle"
            class="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7F1D1D] hover:underline"
          >
            <i class="bi bi-chevron-left"></i>
            <span>Bab Sebelumnya</span>
          </button>
          <div v-else></div>

          <button
            type="button"
            v-if="selectedArticle.no < sejarahArticles.length"
            @click="nextArticle"
            class="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7F1D1D] hover:underline"
          >
            <span>Bab Selanjutnya</span>
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </article>
    </div>

    <!-- JIKA MODE DAFTAR BLOG ENSIKLOPEDIA -->
    <div v-else>
      <!-- Hero Header Banner -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#3d1010] via-[#7F1D1D] to-[#1b0909] px-5 py-12 text-amber-50 sm:py-16 sm:px-6">
        <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-red-400/10 blur-3xl"></div>

        <div class="relative z-10 mx-auto max-w-5xl text-center">
          <div class="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3.5 py-1 text-xs font-semibold text-amber-200 backdrop-blur mb-3">
            <i class="bi bi-hourglass-split text-amber-300"></i>
            <span>Ensiklopedia & Catatan Sejarah Mandar</span>
          </div>

          <h1 class="font-display text-2xl font-bold tracking-tight sm:text-4xl">
            Jejak Sejarah & Peradaban Mandar
          </h1>
          <p class="mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm text-stone-300 leading-relaxed">
            Menelusuri kisah Pitu Ba'bana Binanga, Pitu Ulunna Salu, kepemimpinan Todilaling, kejayaan maritim Sandeq, hingga terbentuknya Sulawesi Barat.
          </p>

          <!-- Search Bar -->
          <div class="mx-auto mt-6 max-w-lg">
            <div class="relative flex items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl">
              <span class="pl-3 text-stone-400">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Cari topik sejarah, nama raja, atau peristiwa..."
                class="w-full bg-transparent px-3 text-xs sm:text-sm text-[#3d1010] outline-none placeholder:text-stone-400"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-stone-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        <!-- Kategori Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          <button
            v-for="cat in sejarahCategories"
            :key="cat"
            type="button"
            @click="selectedCategory = cat"
            class="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-sm"
            :class="selectedCategory === cat
              ? 'bg-[#7F1D1D] text-amber-50 shadow-md ring-2 ring-[#7F1D1D]/30'
              : 'bg-white text-stone-600 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D]'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Featured Article Highlight (Hanya jika sedang di tab Semua dan tidak sedang mencari) -->
        <div
          v-if="selectedCategory === 'Semua' && !searchQuery && featured"
          class="my-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a1414] to-[#7F1D1D] text-amber-50 p-6 sm:p-8 shadow-xl relative group cursor-pointer"
          @click="openArticle(featured)"
        >
          <div class="absolute top-0 right-0 p-8 opacity-10 font-display font-black text-8xl pointer-events-none select-none">
            {{ featured.no }}
          </div>

          <div class="relative z-10 max-w-2xl">
            <span class="inline-block rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-amber-950 mb-3">
              ⭐ Artikel Pilihan • Bab {{ featured.no }}
            </span>
            <h2 class="font-display text-xl sm:text-3xl font-bold leading-tight group-hover:text-amber-200 transition">
              {{ featured.judul }}
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-amber-100/80 line-clamp-3 leading-relaxed">
              {{ featured.ringkasan }}
            </p>
            <div class="mt-5 flex items-center gap-3">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>Baca Selengkapnya</span>
                <i class="bi bi-arrow-right"></i>
              </span>
              <span class="text-xs text-amber-200/60">• {{ featured.bacaMenit }}</span>
            </div>
          </div>
        </div>

        <!-- Info Hasil Hitungan -->
        <div class="mt-4 flex items-center justify-between text-xs text-stone-500">
          <span>Menampilkan <strong class="text-[#7F1D1D]">{{ filteredArticles.length }}</strong> artikel sejarah</span>
          <span v-if="selectedCategory !== 'Semua'">Kategori: <strong class="text-stone-700">{{ selectedCategory }}</strong></span>
        </div>

        <!-- Grid Artikel Blog -->
        <div v-if="filteredArticles.length > 0" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="a in filteredArticles"
            :key="a.id"
            @click="openArticle(a)"
            class="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-md shadow-[#7F1D1D]/5 ring-1 ring-[#7F1D1D]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7F1D1D]/15 cursor-pointer"
          >
            <div>
              <!-- Bab & Kategori Header -->
              <div class="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <span class="rounded-md bg-[#7F1D1D]/10 px-2 py-0.5 text-[11px] font-bold text-[#7F1D1D]">
                  Bab {{ a.no }}
                </span>
                <span class="text-[11px] text-stone-400 font-medium">
                  {{ a.bacaMenit }}
                </span>
              </div>

              <!-- Judul -->
              <h3 class="font-display mt-3 text-base sm:text-lg font-bold leading-snug text-[#4a1313] transition group-hover:text-[#7F1D1D]">
                {{ a.judul }}
              </h3>

              <!-- Kategori Pill -->
              <div class="mt-1.5">
                <span class="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                  {{ a.kategori }}
                </span>
              </div>

              <!-- Ringkasan Isi -->
              <p class="mt-2.5 line-clamp-3 text-xs leading-relaxed text-stone-600">
                {{ a.ringkasan }}
              </p>
            </div>

            <!-- Footer Link -->
            <div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-bold text-[#7F1D1D] group-hover:text-[#5a1212]">
              <span>Baca Artikel</span>
              <i class="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="mt-12 flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200/60">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-3">
            <i class="bi bi-journal-text text-3xl"></i>
          </div>
          <h3 class="font-display text-base font-bold text-stone-800">
            Artikel Tidak Ditemukan
          </h3>
          <p class="mt-1 text-xs text-stone-500 max-w-sm">
            Tidak ada artikel sejarah yang sesuai dengan kata kunci "{{ searchQuery }}".
          </p>
          <button
            type="button"
            @click="searchQuery = ''; selectedCategory = 'Semua'"
            class="mt-4 rounded-xl bg-[#7F1D1D] px-5 py-2.5 text-xs font-bold text-amber-50 transition hover:bg-[#661616]"
          >
            Reset Pencarian
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
