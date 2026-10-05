<script setup>
import BookCover from './BookCover.vue'
defineProps({ ebook: { type: Object, required: true } })
</script>

<template>
  <a :href="`#/buku/${encodeURIComponent(ebook.id)}`" class="group block animate-fade-up">
    <div class="relative overflow-hidden rounded-xl shadow-md shadow-emerald-900/15 ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-emerald-900/25">
      <BookCover :ebook="ebook" class="transition duration-500 group-hover:scale-105" />
      <!-- <span class="absolute left-2.5 top-2.5 rounded-full bg-[#fbf7ef]/95 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 shadow">
        {{ ebook.kategori }}
      </span> -->
      <div class="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-emerald-950/90 to-transparent p-4 pt-10 text-center text-sm font-semibold text-amber-100 transition duration-300 group-hover:translate-y-0">
        Lihat Detail →
      </div>
    </div>
    <!-- <h3 class="font-display mt-3 line-clamp-2 text-[15px] font-bold leading-snug text-emerald-950 transition group-hover:text-emerald-700">
      {{ ebook.judul }}
    </h3>
    <p class="mt-0.5 truncate text-xs text-stone-500">{{ ebook.penulis }}</p> -->
  </a>
</template>
