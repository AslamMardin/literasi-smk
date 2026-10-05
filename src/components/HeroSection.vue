<script setup>
import { ref } from 'vue'
import BookCover from './BookCover.vue'
import { ebooks } from '../data/ebooks'
import { filter } from '../data/filter'

const q = ref('')
const covers = ebooks.slice(14, 17)
console.log(covers)
const pos = [
  { left: '2%', top: '14%', transform: 'rotate(-9deg)' },
  { left: '27%', top: '0%', transform: 'rotate(1deg)', zIndex: 2 },
  { left: '52%', top: '16%', transform: 'rotate(10deg)' },
]

function cari() {
  filter.query = q.value.trim()
  filter.kategori = ''
  window.location.hash = '#/koleksi'
}
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-amber-50">
    <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-200/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"></div>

    <div class="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-24 pt-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-28 md:pt-20">
      <div class="animate-fade-up">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Gerakan Sulbar Madarras (GSM)</p>
       <div class="flex items-center gap-3 sm:gap-4">
  <img
    src="/favicon.png"
    alt="Logo SMKN Campalagian"
    class="h-12 w-12 object-contain sm:h-16 sm:w-16"
  />

  <h1 class="font-display text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
    SMK NEGERI CAMPALAGIAN
  </h1>
</div>
       

        <form class="mt-8 flex max-w-lg overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl" @submit.prevent="cari">
          <input
            v-model="q" type="search" placeholder="Cari judul atau penulis…"
            class="min-w-0 flex-1 bg-transparent px-4 text-sm text-emerald-950 outline-none placeholder:text-stone-400"
          />
          <button class="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-amber-50 transition hover:bg-emerald-900">
            Cari
          </button>
        </form>
      </div>

      <!-- Sampul buku bertumpuk -->
      <div class="relative mx-auto h-[16rem] w-full max-w-md">
  <div
    v-for="(b, i) in covers"
    :key="b.id"
    class="absolute w-44 overflow-hidden rounded-xl shadow-2xl shadow-black/40 ring-1 ring-white/20 lg:w-48"
    :style="pos[i]"
  >
    <BookCover :ebook="b" />
  </div>
</div>
    </div>
  </section>
</template>
