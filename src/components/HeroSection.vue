<script setup>
import { ref } from 'vue'
import BookCover from './BookCover.vue'
import { ebooks } from '../data/ebooks'
import { filter } from '../data/filter'

const q = ref('')
const covers = ebooks.slice(14, 17)

const pos = [
  { left: '2%', top: '14%', zIndex: 1, animClass: 'animate-float-1' },
  { left: '27%', top: '0%', zIndex: 2, animClass: 'animate-float-2' },
  { left: '52%', top: '16%', zIndex: 1, animClass: 'animate-float-3' },
]

function cari() {
  filter.query = q.value.trim()
  filter.kategori = ''
  window.location.hash = '#/koleksi'
}
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-[#3d1010] via-[#7F1D1D] to-[#1b0909] text-amber-50">
    <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-200/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#d7a6a6]/10 blur-3xl"></div>

    <div class="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-24 pt-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-28 md:pt-20">
      <div class="animate-fade-up">
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
        <p class="my-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Gerakan Sulbar Madarras (GSM)
        </p>

        <form class="mt-2 flex max-w-lg overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl" @submit.prevent="cari">
          <input
            v-model="q" type="search" placeholder="Cari judul atau penulis…"
            class="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#3d1010] outline-none placeholder:text-stone-400"
          />
          <button class="rounded-xl bg-[#7F1D1D] px-5 py-3 text-sm font-semibold text-amber-50 transition hover:bg-[#5b1717]">
            Cari
          </button>
        </form>
      </div>

      <!-- Sampul buku bertumpuk dengan animasi melayang (floating fly animation) bergantian -->
      <div class="relative ml-[-3%] mx-auto h-[18rem] w-full max-w-md select-none">
        <a
          v-for="(b, i) in covers"
          :key="b.id"
          :href="`#/buku/${encodeURIComponent(b.id)}`"
          class="absolute w-44 overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/20 lg:w-48 transition-all duration-300 hover:!z-30 hover:scale-110 hover:shadow-amber-500/20"
          :class="pos[i].animClass"
          :style="{
            left: pos[i].left,
            top: pos[i].top,
            zIndex: pos[i].zIndex,
          }"
          :title="`Lihat detail ${b.judul}`"
        >
          <BookCover :ebook="b" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animasi Melayang Buku 1 (Kiri) */
@keyframes float-left {
  0%, 100% {
    transform: translateY(0px) rotate(-9deg);
  }
  50% {
    transform: translateY(-14px) rotate(-6.5deg);
  }
}

/* Animasi Melayang Buku 2 (Tengah - Sedikit Lebih Tinggi) */
@keyframes float-center {
  0%, 100% {
    transform: translateY(0px) rotate(1deg);
  }
  50% {
    transform: translateY(-18px) rotate(3deg);
  }
}

/* Animasi Melayang Buku 3 (Kanan) */
@keyframes float-right {
  0%, 100% {
    transform: translateY(0px) rotate(10deg);
  }
  50% {
    transform: translateY(-13px) rotate(12.5deg);
  }
}

.animate-float-1 {
  animation: float-left 4.6s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-center 4s ease-in-out infinite 0.7s;
}

.animate-float-3 {
  animation: float-right 4.8s ease-in-out infinite 1.5s;
}

/* Jeda animasi saat hover agar mudah diklik */
.animate-float-1:hover,
.animate-float-2:hover,
.animate-float-3:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float-1,
  .animate-float-2,
  .animate-float-3 {
    animation: none;
  }
}
</style>
