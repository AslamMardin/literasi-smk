<script setup>
import HeroSection from '../components/HeroSection.vue'
import StatsBar from '../components/StatsBar.vue'
import EbookSection from '../components/EbookSection.vue'
import BookCover from '../components/BookCover.vue'
import PopularBooksSection from '../components/PopularBooksSection.vue'
import { ebooks, getKategori, getPenulisCount, getTerbaru, getRekomendasi } from '../data/ebooks'
import { filter } from '../data/filter'
import { useLiterasi } from '../composables/useLiterasi'
import { usePopularBooks } from '../composables/usePopularBooks'

const { studentName, studentClass, hasStudentName, openEditNameModal, lastReadEbook } = useLiterasi()
const { mostOpenedBooks } = usePopularBooks()

const daftarKategori = getKategori()
const terbaru = getTerbaru(16)
const rekomendasi = getRekomendasi()

const jumlah = (k) => ebooks.filter((e) => e.kategori === k).length

function pilihKategori(k) {
  filter.query = ''
  filter.kategori = k
  window.location.hash = '#/koleksi'
}

function formatWaktu(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}
</script>

<template>
  <div>
    <HeroSection />
    <StatsBar :ebook="ebooks.length" :kategori="daftarKategori.length" :penulis="getPenulisCount()" />

    <!-- Section Sapaan Siswa & Ebook Terakhir Dibaca (localStorage) -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
      <div class="space-y-4">
        <!-- 1. Sapaan Nama & Kelas Siswa -->
        <div
          v-if="hasStudentName"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-900/15 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur"
        >
          <div class="flex items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7F1D1D] text-lg font-bold text-amber-100 shadow">
              {{ studentName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="font-display font-bold text-base sm:text-lg text-stone-900">
                  Hai, {{ studentName }}
                </h2>
              
              </div>
              <p class="text-xs text-stone-500 mt-0.5">
                Selamat datang kembali di perpustakaan digital SMK NEGERI CAMPALAGIAN! 
              </p>
            </div>
          </div>

         
        </div>

        <!-- 2. Kartu E-book Terakhir Dibaca (localStorage) -->
        <div
          v-if="lastReadEbook"
          class="overflow-hidden rounded-3xl border border-amber-900/20 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-5 sm:p-6 shadow-md transition hover:shadow-lg"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div class="flex items-center gap-4 w-full sm:w-auto min-w-0">
              <!-- Cover Ebook -->
              <div class="w-16 sm:w-20 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 aspect-[3/4]">
                <BookCover :ebook="lastReadEbook.ebook" class="w-full h-full object-cover" />
              </div>

              <!-- Detail Ebook -->
              <div class="min-w-0 flex-1">
                <div class="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-bold text-[#7F1D1D] mb-1">
                  <i class="bi bi-clock-history"></i>
                  <span>Terakhir Dibaca</span>
                </div>
                <h3 class="font-display font-bold text-stone-900 text-base sm:text-lg truncate">
                  {{ lastReadEbook.judul }}
                </h3>
                <p class="text-xs text-stone-500 truncate mt-0.5">
                  {{ lastReadEbook.penulis }} • {{ lastReadEbook.kategori }}
                </p>
                <p v-if="lastReadEbook.waktu" class="text-[11px] text-stone-400 mt-1">
                  Dibuka pada {{ formatWaktu(lastReadEbook.waktu) }}
                </p>
              </div>
            </div>

            <!-- Tombol Lanjutkan Membaca -->
            <div class="w-full sm:w-auto shrink-0 flex items-center justify-end">
              <a
                :href="`#/baca/${encodeURIComponent(lastReadEbook.id)}`"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7F1D1D] px-6 py-3 font-bold text-amber-50 shadow-md shadow-[#7F1D1D]/25 transition hover:bg-[#681818] hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                <span>Lanjutkan Membaca</span>
                <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>


    <EbookSection title="Ebook Terbaru" link="#/koleksi" :ebooks="terbaru" horizontal />

    

    <div class="bg-[#7F1D1D]/[0.04]">
      <EbookSection title="Rekomendasi" link="#/koleksi" :ebooks="rekomendasi" />
    </div>

    <PopularBooksSection :books="mostOpenedBooks" />

    <!-- Kategori -->
    <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <div class="mb-7">
        <h2 class="font-display text-2xl font-bold text-[#4a1d1d] sm:text-3xl">Kategori</h2>
        <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="(k, kIdx) in daftarKategori"
          :key="k"
          class="group rounded-2xl bg-white px-5 py-3 text-left shadow-sm ring-1 ring-[#7F1D1D]/5 transition hover:-translate-y-1 hover:shadow-xl animate-reveal"
          :style="{ animationDelay: `${(kIdx % 10) * 50}ms` }"
          @click="pilihKategori(k)"
        >
          <div class="flex items-center justify-between">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition group-hover:bg-[#7F1D1D] group-hover:text-amber-100">
              <i class="bi bi-bookmarks text-sm"></i>
            </span>
          </div>
          <p class="mt-3 font-semibold text-[#4a1d1d] group-hover:text-[#7F1D1D] transition">{{ k }}</p>
          <p class="text-xs text-stone-500">{{ jumlah(k) }} ebook</p>
        </button>
      </div>
    </section>
  </div>
</template>
