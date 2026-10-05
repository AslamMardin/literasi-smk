<script setup>
import { computed } from 'vue'
import BookCover from '../components/BookCover.vue'
import EbookSection from '../components/EbookSection.vue'
import { ebooks, getEbookById } from '../data/ebooks'

const props = defineProps({ id: String })
const ebook = computed(() => getEbookById(props.id))
const serupa = computed(() =>
  ebooks.filter((e) => e.kategori === ebook.value?.kategori && e.id !== props.id).slice(0, 4)
)
</script>

<template>
  <div v-if="ebook">
    <div class="mx-auto max-w-5xl px-5 pt-8 sm:px-6">
      <a href="#/koleksi" class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-800/10">
        ← Koleksi
      </a>

      <div class="mt-4 grid items-center gap-8 rounded-3xl bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-900/5 sm:p-8 md:grid-cols-[260px_1fr] md:gap-12">
        <div class="mx-auto w-48 overflow-hidden rounded-xl shadow-2xl shadow-emerald-900/30 ring-1 ring-black/10 md:w-full">
          <BookCover :ebook="ebook" />
        </div>

        <div class="animate-fade-up text-center md:text-left">
          <span class="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-800">
            {{ ebook.kategori }}
          </span>
          <h1 class="font-display mt-4 text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
            {{ ebook.judul }}
          </h1>
          <p class="mt-2 text-lg text-stone-500">{{ ebook.penulis }}</p>

          <div class="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium text-emerald-900 md:justify-start">
            <span class="rounded-full bg-[#fbf7ef] px-3 py-1.5 ring-1 ring-emerald-900/10">📄 PDF</span>
            <span class="rounded-full bg-[#fbf7ef] px-3 py-1.5 ring-1 ring-emerald-900/10">🔓 Tanpa login</span>
          </div>

          <a
            :href="`#/baca/${encodeURIComponent(ebook.id)}`"
            class="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-9 py-4 font-semibold text-amber-50 shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:bg-emerald-900"
          >
            📖 Baca Ebook
          </a>
        </div>
      </div>
    </div>

    <EbookSection v-if="serupa.length" title="Ebook Serupa" :ebooks="serupa" />
  </div>

  <div v-else class="mx-auto max-w-xl px-5 py-24 text-center">
    <p class="text-5xl">📚</p>
    <h1 class="font-display mt-4 text-2xl font-bold text-emerald-950">Ebook tidak ditemukan</h1>
    <a href="#/koleksi" class="mt-6 inline-block rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-amber-50">Kembali ke Koleksi</a>
  </div>
</template>
