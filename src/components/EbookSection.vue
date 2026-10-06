<script setup>
import EbookGrid from './EbookGrid.vue'
import EbookCarousel from './EbookCarousel.vue'

defineProps({
  title: String,
  link: String, // jika diisi, tampil "Lihat semua"
  ebooks: { type: Array, default: () => [] },
  horizontal: { type: Boolean, default: false },
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6">
    <div class="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-bold text-[#4a1d1d] sm:text-3xl">{{ title }}</h2>
        <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
      </div>
      <a v-if="link" :href="link" class="shrink-0 text-sm font-semibold text-[#7F1D1D] transition hover:text-[#5b1717]">
        Lihat semua →
      </a>
    </div>

    <!-- Tampilkan Carousel Center-Focus saat horizontal aktif, atau Grid standar -->
    <EbookCarousel v-if="horizontal" :ebooks="ebooks" />
    <EbookGrid v-else :ebooks="ebooks" />
  </section>
</template>
