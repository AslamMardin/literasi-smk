<script setup>
import { useLiterasi } from '../composables/useLiterasi'
import EbookGrid from '../components/EbookGrid.vue'
import PageHeader from '../components/PageHeader.vue'

const { bookmarkedEbooks, bookmarks } = useLiterasi()
</script>

<template>
  <div class="min-h-screen bg-[#f8f1f1] pb-20">
    <PageHeader
      title="E-book Tersimpan"
      :subtitle="`Koleksi buku favorit kamu yang telah di-bookmark (${bookmarkedEbooks.length} buku)`"
    />

    <div class="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div v-if="bookmarkedEbooks.length > 0">
        <div class="flex items-center justify-between mb-6 pb-3 border-b border-stone-200">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-600">
            Daftar Bookmark Kamu ({{ bookmarkedEbooks.length }})
          </span>
          <span class="text-xs text-stone-500">Tersimpan di browser perangkat ini</span>
        </div>

        <EbookGrid :ebooks="bookmarkedEbooks" />
      </div>

      <!-- Kondisi Belum Ada Bookmark -->
      <div
        v-else
        class="rounded-3xl border border-dashed border-[#7F1D1D]/30 bg-white/80 p-8 sm:p-14 text-center shadow-sm"
      >
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7F1D1D]/10 text-3xl text-[#7F1D1D]">
          <i class="bi bi-bookmark-star"></i>
        </div>
        <h3 class="font-display text-xl sm:text-2xl font-bold text-stone-800 mt-4">
          Belum Ada E-book!
        </h3>
        <p class="text-sm text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
          Kamu belum menyimpan buku favorit. 
        </p>
        <a
          href="#/koleksi"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-6 py-3 font-semibold text-amber-50 shadow-md hover:bg-[#681818] transition hover:-translate-y-0.5"
        >
          <i class="bi bi-book"></i>
          <span>Jelajahi Koleksi</span>
        </a>
      </div>
    </div>
  </div>
</template>
