<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PageHeader from '../components/PageHeader.vue'

const tujuan = [
  {
    icon: 'bi-hourglass-bottom',
    title: 'Membiasakan Membaca',
    text: 'Mendorong siswa untuk menjadikan membaca sebagai kebiasaan positif dan menyenangkan setiap hari.'
  },
  {
    icon: 'bi-phone-landscape',
    title: 'Akses Fleksibel',
    text: 'Koleksi bacaan dapat dibuka kapan saja melalui HP, tablet, maupun laptop siswa.'
  },
  {
    icon: 'bi-house-fill',
    title: 'Satu Ruang Terpadu',
    text: 'Ratusan ebook berkualitas dikumpulkan dalam satu platform terpadu yang mudah dijelajahi.'
  }
]

const kategoriGaleri = ['Semua', 'Kegiatan Baca', 'Perpustakaan', 'Literasi Digital']
const kategoriTerpilih = ref('Semua')

// Daftar dokumentasi foto kegiatan literasi SMKN Campalagian
const galeri = [
  {
    id: 1,
    judul: 'Kegiatan Membaca 15 Menit',
    kategori: 'Kegiatan Baca',
    deskripsi: 'Siswa-siswi memanfaatkan waktu pagi untuk membaca buku pilihan sebelum jam pelajaran dimulai.',
    foto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    tanggal: 'Oktober 2024'
  },
  {
    id: 2,
    judul: 'Ruang Perpustakaan Nyaman',
    kategori: 'Perpustakaan',
    deskripsi: 'Koleksi buku dan sudut baca yang tenang mendukung konsentrasi belajar para siswa.',
    foto: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    tanggal: 'September 2024'
  },
  {
    id: 3,
    judul: 'Akses E-book & Digital Reader',
    kategori: 'Literasi Digital',
    deskripsi: 'Pemanfaatan platform web literasi untuk membaca buku digital di smartphone dan laptop.',
    foto: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
    tanggal: 'Agustus 2024'
  },
  {
    id: 4,
    judul: 'Koleksi Buku Referensi & Kejuruan',
    kategori: 'Perpustakaan',
    deskripsi: 'Berbagai literatur kejuruan dan pengembangan diri tertata rapi di rak perpustakaan.',
    foto: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
    tanggal: 'Juli 2024'
  },
  {
    id: 5,
    judul: 'Diskusi & Review Buku Bersama',
    kategori: 'Kegiatan Baca',
    deskripsi: 'Sesi berbagi wawasan dan bedah cerita yang telah dibaca guna melatih daya kritis.',
    foto: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
    tanggal: 'Juni 2024'
  },
  {
    id: 6,
    judul: 'Pojok Baca Interaktif',
    kategori: 'Literasi Digital',
    deskripsi: 'Suasana santai di pojok literasi yang ramah untuk eksplorasi pengetahuan baru.',
    foto: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=900&q=80',
    tanggal: 'Mei 2024'
  }
]

const galeriTampil = computed(() => {
  if (kategoriTerpilih.value === 'Semua') return galeri
  return galeri.filter((g) => g.kategori === kategoriTerpilih.value)
})

// Modal Lightbox
const activePhoto = ref(null)
const activeIndex = ref(0)

function openLightbox(photo, index) {
  activePhoto.value = photo
  activeIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  activePhoto.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  const list = galeriTampil.value
  activeIndex.value = (activeIndex.value - 1 + list.length) % list.length
  activePhoto.value = list[activeIndex.value]
}

function nextPhoto() {
  const list = galeriTampil.value
  activeIndex.value = (activeIndex.value + 1) % list.length
  activePhoto.value = list[activeIndex.value]
}

function handleKeydown(e) {
  if (!activePhoto.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <PageHeader
      title="Tentang Gerakan Sulbar Madarras (GSM)"
      subtitle="Ruang baca digital SMKN Campalagian."
    />

    <main class="mx-auto max-w-6xl px-5 py-12 sm:px-6 space-y-16">
      <!-- 1. Pengantar & Profil Singkat -->
      <section class="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-10 shadow-sm">
        <div class="max-w-3xl">
         
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-[#4a1d1d] leading-tight">
            Membangun Budaya Gemar Membaca di Era Digital
          </h2>
          <p class="mt-4 text-base leading-relaxed text-stone-600">
            Literasi Digital SMKN Campalagian merupakan inisiatif ruang baca modern yang
            menyediakan berbagai koleksi ebook berkualitas untuk mendukung kegiatan belajar
            dan memperkaya wawasan seluruh siswa. Website ini dirancang agar bahan bacaan
            dapat diakses kapan saja dan di mana saja dengan mudah.
          </p>
        </div>

        <!-- 3 Pilar Tujuan -->
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-stone-100">
          <div
            v-for="t in tujuan"
            :key="t.title"
            class="rounded-2xl border border-stone-200/60 bg-[#fdfbfb] p-5 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7F1D1D] text-amber-100 text-lg shadow-sm">
              <i :class="`bi ${t.icon}`"></i>
            </div>
            <h3 class="font-display mt-4 font-bold text-stone-900 text-base">{{ t.title }}</h3>
            <p class="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">{{ t.text }}</p>
          </div>
        </div>
      </section>

      <!-- 2. Galeri Foto Dokumentasi Kegiatan Literasi -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-[#4a1d1d]">
              Galeri Foto Literasi
            </h2>
            <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
          </div>
        </div>

        <!-- Grid Foto -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(item, idx) in galeriTampil"
            :key="item.id"
            class="group relative overflow-hidden rounded-2xl bg-stone-900 shadow-md ring-1 ring-black/5 aspect-[4/3] cursor-pointer animate-reveal"
            :style="{ animationDelay: `${idx * 60}ms` }"
            @click="openLightbox(item, idx)"
          >
            <!-- Gambar Foto -->
            <img
              :src="item.foto"
              :alt="item.judul"
              class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-hover:opacity-90"
              loading="lazy"
            />

            <!-- Badge Kategori Pojok Kiri Atas -->
            <div class="absolute top-3 left-3 z-10">
              <span class="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-amber-200 shadow-sm">
                {{ item.kategori }}
              </span>
            </div>

            <!-- Overlay & Keterangan Saat Hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 flex flex-col justify-end text-white transition duration-300">
              <p class="text-[11px] font-medium text-amber-300/90 flex items-center gap-1 mb-1">
                <i class="bi bi-calendar3 text-[10px]"></i>
                <span>{{ item.tanggal }}</span>
              </p>
              <h3 class="font-display font-bold text-base sm:text-lg leading-snug text-white group-hover:text-amber-200 transition">
                {{ item.judul }}
              </h3>
              <p class="mt-1 line-clamp-2 text-xs text-stone-300/90 leading-relaxed">
                {{ item.deskripsi }}
              </p>

              <!-- Tombol Zoom Icon -->
              <div class="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-300 opacity-0 transform translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <i class="bi bi-zoom-in"></i>
                <span>Klik untuk perbesar</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Lightbox (Perbesar Foto Layar Penuh) -->
    <div
      v-if="activePhoto"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md animate-fade-up"
      @click.self="closeLightbox"
    >
      <!-- Tombol Tutup (X) -->
      <button
        type="button"
        @click="closeLightbox"
        aria-label="Tutup foto"
        class="absolute top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 transition shadow-lg text-xl"
      >
        <i class="bi bi-x-lg"></i>
      </button>

      <!-- Tombol Geser Kiri -->
      <button
        type="button"
        @click.stop="prevPhoto"
        aria-label="Foto sebelumnya"
        class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 transition shadow-lg text-2xl"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- Tombol Geser Kanan -->
      <button
        type="button"
        @click.stop="nextPhoto"
        aria-label="Foto berikutnya"
        class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 transition shadow-lg text-2xl"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <!-- Kotak Foto & Detail -->
      <div class="relative max-w-4xl w-full flex flex-col items-center max-h-[90vh]">
        <div class="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-black/60 flex items-center justify-center">
          <img
            :src="activePhoto.foto"
            :alt="activePhoto.judul"
            class="max-h-[68vh] w-auto max-w-full object-contain rounded-2xl"
          />
        </div>

        <!-- Deskripsi Foto di Bawah -->
        <div class="mt-4 w-full rounded-2xl bg-stone-900/90 border border-white/10 p-4 sm:p-5 text-white backdrop-blur flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                {{ activePhoto.kategori }}
              </span>
              <span class="text-xs text-stone-400">• {{ activePhoto.tanggal }}</span>
            </div>
            <h3 class="font-display text-lg font-bold text-white">{{ activePhoto.judul }}</h3>
            <p class="text-xs text-stone-300 mt-1 max-w-xl">{{ activePhoto.deskripsi }}</p>
          </div>

          <div class="text-xs text-stone-400 font-semibold self-end sm:self-center shrink-0">
            {{ activeIndex + 1 }} dari {{ galeriTampil.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>