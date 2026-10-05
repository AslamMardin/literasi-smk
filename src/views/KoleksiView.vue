<script setup>
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SearchFilter from '../components/SearchFilter.vue'
import EbookGrid from '../components/EbookGrid.vue'
import { ebooks, getKategori } from '../data/ebooks'
import { filter } from '../data/filter'

const daftarKategori = getKategori()

const hasil = computed(() => {
  const q = filter.query.trim().toLowerCase()
  return ebooks.filter(
    (e) =>
      (!filter.kategori || e.kategori === filter.kategori) &&
      (!q || e.judul.toLowerCase().includes(q) || e.penulis.toLowerCase().includes(q))
  )
})

function reset() {
  filter.query = ''
  filter.kategori = ''
}
</script>

<template>
  <div>
    <!-- <PageHeader title="Koleksi Ebook" subtitle="Pilih bacaanmu." /> -->

    <div class="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      <SearchFilter v-model:query="filter.query" v-model:kategori="filter.kategori" :daftar-kategori="daftarKategori" />

      <div class="mb-6 mt-8 flex items-center justify-between text-sm text-stone-500">
        <p><span class="font-semibold text-[#4a1d1d]">{{ hasil.length }}</span> ebook</p>
        <button v-if="filter.query || filter.kategori" class="font-medium text-[#7F1D1D] hover:underline" @click="reset">
          Reset
        </button>
      </div>

      <EbookGrid :ebooks="hasil" empty-text="Ebook tidak ditemukan." />
    </div>
  </div>
</template>
