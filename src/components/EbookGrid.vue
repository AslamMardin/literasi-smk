<script setup>
import EbookCard from './EbookCard.vue'
defineProps({
  ebooks: { type: Array, default: () => [] },
  emptyText: { type: String, default: 'Belum ada ebook.' },
  horizontal: { type: Boolean, default: false },
})
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<template>
  <div
    v-if="ebooks.length"
    class="gap-4 sm:gap-x-6"
    :class="horizontal
      ? 'scrollbar-hide -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 touch-pan-x sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4'
      : 'grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-4'"
  >
    <div
      v-for="e in ebooks"
      :key="e.id"
      :class="horizontal ? 'w-[68vw] max-w-[240px] shrink-0 snap-start sm:w-auto sm:max-w-none' : ''"
    >
      <EbookCard :ebook="e" />
    </div>
  </div>
  <div v-else class="rounded-2xl border border-dashed border-[#7F1D1D]/20 bg-white/60 py-16 text-center text-stone-500">
    <p class="text-4xl">🔍</p>
    <p class="mt-3 text-sm">{{ emptyText }}</p>
  </div>
</template>
