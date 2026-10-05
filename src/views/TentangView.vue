<script setup>
import PageHeader from '../components/PageHeader.vue'

const tujuan = [
  {
    icon: 'bi-book',
    title: 'Membiasakan Membaca',
    text: 'Mendorong siswa untuk menjadikan membaca sebagai bagian dari kegiatan sehari-hari.'
  },
  {
    icon: 'bi-phone',
    title: 'Mudah Diakses',
    text: 'Koleksi bacaan dapat dibuka melalui HP, tablet, maupun komputer.'
  },
  {
    icon: 'bi-collection',
    title: 'Satu Ruang Bacaan',
    text: 'Berbagai ebook dikumpulkan dalam satu tempat agar lebih mudah ditemukan.'
  }
]

</script>

<template>
  <div>
    <PageHeader
      title="Tentang Literasi Digital"
      subtitle="Ruang baca digital SMKN Campalagian."
    />

    <main class="mx-auto max-w-5xl px-5 py-12 sm:px-6">

      <!-- Pengantar -->
      <section class="max-w-3xl">
    

        <p class="mt-5 text-base leading-7 text-stone-600">
          Literasi Digital SMKN Campalagian merupakan ruang baca yang
          menyediakan berbagai koleksi ebook untuk mendukung kegiatan
          membaca siswa. Website ini dibuat agar bahan bacaan dapat
          ditemukan dan dibaca dengan lebih mudah tanpa harus datang
          langsung ke perpustakaan.
        </p>
      </section>

     

    </main>
  </div>
</template>