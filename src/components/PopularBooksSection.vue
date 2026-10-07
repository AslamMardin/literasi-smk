<script setup>
import BookCover from './BookCover.vue'

defineProps({
  books: { type: Array, default: () => [] },
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
  <section v-if="books.length" class="mx-auto max-w-6xl px-5  sm:px-6">
    <div class="mb-7 flex items-end justify-between gap-4">
      <h2 class="font-display text-2xl font-bold text-[#4a1d1d] sm:text-3xl">
        <span>Buku Paling Banyak Dibuka</span>
        <span class="mt-1 block text-sm font-normal text-stone-500">
          Terpopuler berdasarkan jumlah dibuka semua pengunjung.
        </span>
      </h2>
      
    </div>

    <div class="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 touch-pan-x cursor-grab active:cursor-grabbing sm:mx-0 sm:px-0">
      <a
        v-for="(book, index) in books"
        :key="book.id"
        :href="`#/buku/${encodeURIComponent(book.id)}`"
        class="group relative w-[68vw] max-w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#7F1D1D]/10 transition hover:-translate-y-1 hover:shadow-xl sm:w-[220px]"
      >
        <div class="relative aspect-[3/4] overflow-hidden">
          <BookCover :ebook="book" class="transition duration-500 group-hover:scale-105" />
          <span
            class="absolute left-3 top-3 rounded-full bg-[#7F1D1D] px-3 py-1 text-xs font-bold text-amber-100 shadow"
          >
            #{{ index + 1 }}
          </span>
        </div>
        <div class="p-4">
          <h3 class="truncate font-display font-bold text-stone-900">{{ book.judul }}</h3>
          <p class="mt-1 truncate text-xs text-stone-500">{{ book.penulis }}</p>
          <p class="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#7F1D1D]">
            <i class="bi bi-eye-fill"></i>
            {{ book.openCount.toLocaleString('id-ID') }} kali dibuka
          </p>
        </div>
      </a>
    </div>
  </section>
</template>
