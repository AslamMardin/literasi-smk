<script setup>
import EbookCard from './EbookCard.vue'
defineProps({
  ebooks: { type: Array, default: () => [] },
  emptyText: { type: String, default: 'Belum ada ebook.' },
})
</script>

<template>
  <div v-if="ebooks.length" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
    <EbookCard v-for="e in ebooks" :key="e.id" :ebook="e" />
  </div>
  <div v-else class="rounded-2xl border border-dashed border-[#7F1D1D]/20 bg-white/60 py-16 text-center text-stone-500">
    <p class="text-4xl">🔍</p>
    <p class="mt-3 text-sm">{{ emptyText }}</p>
  </div>
</template>
