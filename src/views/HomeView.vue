<script setup>
import HeroSection from '../components/HeroSection.vue'
import StatsBar from '../components/StatsBar.vue'
import EbookSection from '../components/EbookSection.vue'
import { ebooks, getKategori, getPenulisCount, getTerbaru, getRekomendasi } from '../data/ebooks'
import { filter } from '../data/filter'

const daftarKategori = getKategori()
const terbaru = getTerbaru(16)
const rekomendasi = getRekomendasi()

const ikon = { Novel: '📖', Teknologi: '💻', Pelajaran: '🎓', 'Pengembangan Diri': '🌱', Sastra: '✍️' }
const jumlah = (k) => ebooks.filter((e) => e.kategori === k).length

function pilihKategori(k) {
  filter.query = ''
  filter.kategori = k
  window.location.hash = '#/koleksi'
}
</script>

<template>
  <div>
    <HeroSection />
    <StatsBar :ebook="ebooks.length" :kategori="daftarKategori.length" :penulis="getPenulisCount()" />

    <EbookSection title="Ebook Terbaru" link="#/koleksi" :ebooks="terbaru" horizontal />

    <div class="bg-[#7F1D1D]/[0.04]">
      <EbookSection title="Rekomendasi" link="#/koleksi" :ebooks="rekomendasi" />
    </div>

    <!-- Kategori -->
    <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <div class="mb-7">
        <h2 class="font-display text-2xl font-bold text-[#4a1d1d] sm:text-3xl">Kategori</h2>
        <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="k in daftarKategori" :key="k"
          class="group rounded-2xl bg-white px-5 py-2 text-left shadow-sm ring-1 ring-[#7F1D1D]/5 transition hover:-translate-y-1 hover:shadow-xl"
          @click="pilihKategori(k)"
        >
          <p class="mt-4 font text-[#4a1d1d]">{{ k }}</p>
          <p class="text-xs text-stone-500">{{ jumlah(k) }} ebook</p>
        </button>
      </div>
    </section>

    <!-- Ajakan -->
    <!-- <section class="mx-auto max-w-6xl px-5 sm:px-6">
      <div class="flex flex-col items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-900 px-8 py-10 text-center text-amber-50 sm:flex-row sm:text-left">
        <p class="font-display text-2xl font-bold">Mulai membaca hari ini.</p>
        <a href="#/koleksi" class="rounded-xl bg-amber-300 px-7 py-3 font-semibold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200">
          Buka Koleksi
        </a>
      </div>
    </section> -->
  </div>
</template>
