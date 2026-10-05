<script setup>
import EbookGrid from './EbookGrid.vue'
defineProps({
  title: String,
  link: String, // jika diisi, tampil "Lihat semua"
  ebooks: { type: Array, default: () => [] },
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6">
    <div class="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-bold text-emerald-950 sm:text-3xl">{{ title }}</h2>
        <div class="mt-2 h-1 w-12 rounded-full bg-amber-400"></div>
      </div>
      <a v-if="link" :href="link" class="shrink-0 text-sm font-semibold text-emerald-800 transition hover:text-emerald-600">
        Lihat semua →
      </a>
    </div>
    <EbookGrid :ebooks="ebooks" />
  </section>
</template>
