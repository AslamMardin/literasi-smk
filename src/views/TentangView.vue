<script setup>
import PageHeader from '../components/PageHeader.vue'

const fitur = [
  { i: '🔓', t: 'Tanpa Login', d: 'Langsung buka dan baca.' },
  { i: '📱', t: 'Di Mana Saja', d: 'HP, tablet, atau laptop.' },
  { i: '🆓', t: 'Gratis', d: 'Terbuka untuk semua siswa.' },
]
const langkah = [
  { n: 1, t: 'Pilih ebook', d: 'Cari di koleksi.' },
  { n: 2, t: 'Klik Baca', d: 'Buka dari halaman detail.' },
  { n: 3, t: 'Selamat membaca', d: 'Geser halaman dengan tombol.' },
]
</script>

<template>
  <div>
    <PageHeader title="Tentang" subtitle="Perpustakaan digital SMKN Campalagian." />

    <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <div class="grid gap-5 sm:grid-cols-3">
        <div v-for="f in fitur" :key="f.t" class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl">
          <p class="text-3xl">{{ f.i }}</p>
          <p class="font-display mt-3 text-lg font-bold text-emerald-950">{{ f.t }}</p>
          <p class="mt-1 text-sm text-stone-500">{{ f.d }}</p>
        </div>
      </div>

      <h2 class="font-display mb-6 mt-16 text-2xl font-bold text-emerald-950">Cara Membaca</h2>
      <div class="grid gap-5 sm:grid-cols-3">
        <div v-for="s in langkah" :key="s.n" class="flex items-start gap-4 rounded-2xl bg-emerald-900/[0.05] p-5">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 font-bold text-amber-50">{{ s.n }}</span>
          <div>
            <p class="font-semibold text-emerald-950">{{ s.t }}</p>
            <p class="text-sm text-stone-500">{{ s.d }}</p>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <a href="#/koleksi" class="inline-block rounded-xl bg-emerald-800 px-8 py-3.5 font-semibold text-amber-50 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-900">
          Lihat Koleksi
        </a>
      </div>
    </section>
  </div>
</template>
