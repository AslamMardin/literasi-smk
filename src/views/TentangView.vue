<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import PageHeader from '../components/PageHeader.vue'



const pengurusKegiatan = [
  { jabatan: 'Pembina / Penanggung Jawab', nama: 'Rasjuddin, S.Pd.I., MM.', foto: '/people/kepsek.PNG' },
  { jabatan: 'Ketua', nama: 'Abrianto Yasin, S.Pd.', foto: '/people/abi.jpeg' },
  { jabatan: 'Sekretaris', nama: 'Aslam Mardin, S.Kom., M.Kom.', foto: '/people/2023-2.jpg' },
  { jabatan: 'Bendahara', nama: 'Nisrawati, S.Pd.I', foto: '/images/avatar-bendahara.svg' },
  { jabatan: 'Koordinator materi, bahan pustaka dan kegiatan', nama: 'Andi Reski Tappawali, S.Pd', foto: '/images/avatar-koordinator.svg' }
]

const siswaTerlibat = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  nama: `Nama Siswa ${String(index + 1).padStart(2, '0')}`
}))

const kategoriGaleri = ['Semua', 'Kegiatan Baca', 'Perpustakaan', 'Literasi Digital']
const kategoriTerpilih = ref('Semua')
const activePengurusIndex = ref(0)
const dragOffset = ref(0)
const swipeDirection = ref(0)
const returningPengurusIndex = ref(null)
let dragStartX = null
let swipeFallbackTimer
let swipeAnimationFrame = 0
const visiblePengurusCards = 4
const swipeThreshold = 80
const isDragging = ref(false)
const dragVelocity = ref(0)
let lastDragX = 0
let lastDragTime = 0

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
  window.clearTimeout(swipeFallbackTimer)
  window.cancelAnimationFrame(swipeAnimationFrame)
})

function pengurusDepth(index) {
  return (index - activePengurusIndex.value + pengurusKegiatan.length) % pengurusKegiatan.length
}

function pengurusCardStyle(index) {
  const depth = pengurusDepth(index)
  const isActive = depth === 0
  const drag = isActive ? dragOffset.value : 0

  // Depth-based stacking offsets — wider spread so back cards are clearly visible
  const spreadX = depth * 38
  const spreadY = depth * -6
  const depthZ = depth * -70
  const depthScale = 1 - depth * 0.05

  // Active card follows drag with tilt/rotation
  const dragRotateZ = drag * 0.04
  const dragRotateY = drag * -0.06
  const stackRotateY = depth * -2

  // Depth-based opacity & blur falloff — keep back cards clearly visible
  const falloff = [1, 0.9, 0.75, 0.55]
  const blurValues = [0, 0.3, 0.8, 1.5]
  const isReturning = index === returningPengurusIndex.value

  return {
    transform: isReturning
      ? 'translate3d(calc(-50% - 120vw), calc(-50% + 20px), 60px) scale(0.78)'
      : `translate3d(calc(-50% + ${spreadX + drag}px), calc(-50% + ${spreadY}px), ${depthZ}px) scale(${depthScale}) rotateY(${stackRotateY + dragRotateY}deg) rotate(${depth * -1.2 + dragRotateZ}deg)`,
    opacity: isReturning ? 0 : depth < visiblePengurusCards ? (falloff[depth] ?? 0.2) : 0,
    filter: `blur(${blurValues[depth] ?? 3}px)`,
    zIndex: pengurusKegiatan.length * 2 - depth,
    visibility: depth < visiblePengurusCards ? 'visible' : 'hidden',
    pointerEvents: isActive ? 'auto' : 'none',
    '--exit-x': swipeDirection.value > 0 ? '-120vw' : '120vw',
    '--exit-rotation': swipeDirection.value > 0 ? '-14deg' : '14deg',
    transitionDuration: isReturning || (isDragging.value && isActive) ? '0ms' : undefined
  }
}

function navigatePengurus(direction) {
  if (swipeDirection.value || pengurusKegiatan.length < 2) return
  isDragging.value = false
  swipeDirection.value = direction
  dragStartX = null
  dragVelocity.value = 0

  if (direction < 0) {
    const previousIndex =
      (activePengurusIndex.value - 1 + pengurusKegiatan.length) % pengurusKegiatan.length
    returningPengurusIndex.value = previousIndex
    nextTick(() => {
      swipeAnimationFrame = window.requestAnimationFrame(() => {
        swipeAnimationFrame = window.requestAnimationFrame(() => {
          activePengurusIndex.value = previousIndex
          returningPengurusIndex.value = null
          swipeAnimationFrame = 0
        })
      })
    })
  }

  swipeFallbackTimer = window.setTimeout(finishPengurusSwipe, 550)
}

function finishPengurusSwipe() {
  if (!swipeDirection.value) return
  window.clearTimeout(swipeFallbackTimer)
  if (swipeDirection.value > 0) {
    activePengurusIndex.value =
      (activePengurusIndex.value + 1) % pengurusKegiatan.length
  }
  swipeDirection.value = 0
  returningPengurusIndex.value = null
  dragOffset.value = 0
  dragVelocity.value = 0
}

function startPengurusDrag(event) {
  if (swipeDirection.value) return
  isDragging.value = true
  dragStartX = event.clientX
  lastDragX = event.clientX
  lastDragTime = Date.now()
  dragVelocity.value = 0
  event.currentTarget.setPointerCapture(event.pointerId)
}

function movePengurusDrag(event) {
  if (dragStartX === null || swipeDirection.value) return
  const now = Date.now()
  const dt = now - lastDragTime
  if (dt > 0) {
    dragVelocity.value = (event.clientX - lastDragX) / dt
  }
  lastDragX = event.clientX
  lastDragTime = now
  dragOffset.value = event.clientX - dragStartX
}

function endPengurusDrag() {
  if (dragStartX === null) return
  isDragging.value = false
  const offset = dragOffset.value
  const velocity = dragVelocity.value
  dragStartX = null

  // Swipe triggers on threshold OR high velocity flick
  const velocityThreshold = 0.35
  if (Math.abs(offset) >= swipeThreshold || Math.abs(velocity) > velocityThreshold) {
    const direction = (Math.abs(offset) >= swipeThreshold)
      ? (offset < 0 ? 1 : -1)
      : (velocity < 0 ? 1 : -1)
    navigatePengurus(direction)
  } else {
    dragOffset.value = 0
    dragVelocity.value = 0
  }
}

function cancelPengurusDrag() {
  isDragging.value = false
  dragStartX = null
  dragOffset.value = 0
  dragVelocity.value = 0
}

function handlePengurusKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    navigatePengurus(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    navigatePengurus(1)
  }
}
const keahlianPencipta = [
  { nama: 'Web Development', icon: 'bi-code-slash' },
  { nama: 'UI & Web Design', icon: 'bi-palette-fill' },
  { nama: 'Graphic Design', icon: 'bi-brush-fill' },
  { nama: 'Jaringan', icon: 'bi-hdd-network-fill' },
  { nama: 'Computer Service', icon: 'bi-cpu-fill' },
  { nama: 'Data Analysis', icon: 'bi-graph-up' },
  { nama: 'Teknologi Pendidikan', icon: 'bi-mortarboard-fill' }
]



const fotoPenciptaGagal = ref(false)
</script>

<template>
  <div>
    <PageHeader
      title="Tentang Gerakan Sulbar Madarras (GSM)"
      subtitle="Ruang baca digital dan pusat literasi terpadu SMKN Campalagian."
    />

    <main class="mx-auto max-w-6xl px-5 py-12 sm:px-6 space-y-16">
      <!-- 1. Pengantar & Profil Singkat Gerakan Literasi -->
      <section class="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-10 shadow-sm">
        <div class="max-w-3xl">
          
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-[#4a1d1d] leading-tight">
            Membangun Budaya Gemar Membaca di Era Digital
          </h2>
          <p class="mt-4 text-base leading-relaxed text-stone-600">
            Literasi Digital SMKN Campalagian merupakan inisiatif ruang baca modern yang
            menyediakan berbagai koleksi ebook berkualitas, dokumentasi sejarah Mandar, dan karya sastra puisi siswa
            untuk mendukung kegiatan belajar dan memperkaya wawasan seluruh warga sekolah.
          </p>
        </div>

       
      </section>

      <!-- Struktur pengurus dan siswa yang terlibat -->
      <section class="space-y-6">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-[#4a1d1d]">
            Struktur GSM
          </h2>
          <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
        </div>

        <div
          class="gsm-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Carousel pengurus Gerakan Sulbar Madarras"
          tabindex="0"
          @keydown="handlePengurusKeydown"
        >
          <div class="gsm-carousel__stage">
            <article
              v-for="(pengurus, index) in pengurusKegiatan"
              :key="pengurus.jabatan"
              class="gsm-card"
              :class="{ 'is-exiting': swipeDirection > 0 && index === activePengurusIndex }"
              :style="pengurusCardStyle(index)"
              :aria-hidden="pengurusDepth(index) !== 0"
              :aria-roledescription="pengurusDepth(index) === 0 ? 'slide' : undefined"
              :aria-label="pengurusDepth(index) === 0 ? `${index + 1} dari ${pengurusKegiatan.length}: ${pengurus.jabatan}, ${pengurus.nama}` : undefined"
              @transitionend="index === activePengurusIndex && $event.propertyName === 'transform' && finishPengurusSwipe()"
            >
              <button
                type="button"
                class="gsm-card__button"
                :aria-label="`${pengurus.jabatan}: ${pengurus.nama}`"
                :tabindex="pengurusDepth(index) === 0 ? 0 : -1"
                @pointerdown="startPengurusDrag"
                @pointermove="movePengurusDrag"
                @pointerup="endPengurusDrag"
                @pointercancel="cancelPengurusDrag"
              >
                <img
                  :src="pengurus.foto"
                  :alt="`Ilustrasi avatar ${pengurus.jabatan}`"
                  class="gsm-card__image"
                  loading="lazy"
                >
             
                <span class="gsm-card__details">
                  <span class="gsm-card__role">{{ pengurus.jabatan }}</span>
                  <span class="gsm-card__name">{{ pengurus.nama }}</span>
                  <span class="gsm-card__hint">
                    <i class="bi bi-arrow-up-right-circle-fill" aria-hidden="true"></i>
                    Pengurus GSM
                  </span>
                </span>
              </button>
            </article>
          </div>

          <div class="gsm-carousel__footer">
          
            <div class="gsm-carousel__indicators" aria-label="Pilih pengurus">
              <button
                v-for="(pengurus, index) in pengurusKegiatan"
                :key="pengurus.jabatan"
                type="button"
                class="gsm-carousel__dot"
                :class="{ 'is-current': activePengurusIndex === index }"
                :aria-label="`Tampilkan pengurus ${index + 1}: ${pengurus.nama}`"
                :aria-current="activePengurusIndex === index ? 'true' : undefined"
                :disabled="Boolean(swipeDirection)"
                @click="activePengurusIndex = index"
              ></button>
            </div>
          
          </div>
        </div>

        <!-- <div class="rounded-2xl border border-amber-900/10 bg-white p-5 sm:p-6 shadow-sm">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-display text-lg font-bold text-[#4a1d1d]">
              Siswa yang Terlibat
            </h3>
            <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
              {{ siswaTerlibat.length }} siswa
            </span>
          </div>
          <ol class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="siswa in siswaTerlibat"
              :key="siswa.id"
              class="flex items-center gap-3 rounded-xl bg-[#fffdfb] px-3 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200/70"
            >
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7F1D1D]/10 text-xs font-bold text-[#7F1D1D]">
                {{ String(siswa.id).padStart(2, '0') }}
              </span>
              <span>{{ siswa.nama }}</span>
            </li>
          </ol>
        </div> -->
      </section>

      <!-- Galeri Foto Dokumentasi Kegiatan Literasi -->
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
              <!-- Tombol Zoom Icon -->
              <div class="mt-3 flex text-white shadow-text  items-center gap-1 text-xs font-semibold text-amber-300 opacity-0 transform translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <i class="bi bi-zoom-in"></i>
                <span>Klik untuk perbesar</span>
              </div>
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

             
            </div>
          </div>
        </div>
      </section>

      <!-- Profil Pencipta Aplikasi -->
      <section class="space-y-6">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-[#4a1d1d]">
            Tentang Pencipta
          </h2>
          <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
        </div>

        <div class="overflow-hidden rounded-3xl border border-amber-900/15 bg-white shadow-md">
          <!-- Banner Profil Atas -->
          <div class="relative bg-gradient-to-br from-[#3d1010] via-[#7F1D1D] to-[#991b1b] p-6 sm:p-10 text-amber-50">
            <!-- Background Glow Decor -->
            <div class="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"></div>

            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <!-- Foto Profil -->
              <div class="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-3xl sm:text-4xl font-extrabold text-[#4a1010] shadow-xl ring-4 ring-white/20">
                <img
                  v-if="!fotoPenciptaGagal"
                  src="https://aslammardin.github.io/img/accan.png"
                  alt="Foto Aslam Mardin"
                  class="h-full w-full object-cover object-center"
                  loading="lazy"
                  @error="fotoPenciptaGagal = true"
                >
                <span v-else aria-hidden="true">AM</span>
                
              </div>

              <!-- Identitas Utama -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span class="rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-0.5 text-xs font-bold text-amber-200">
                    Dosen Informatika 
                  </span>
                  <span class="inline-flex items-center gap-1 text-xs text-amber-100/80">
                    <i class="bi bi-geo-alt-fill text-amber-400"></i> Campalagian, Polewali Mandar
                  </span>
                </div>

                <h3 class="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Aslam Mardin, S.Kom., M.Kom., Gr.
                </h3>

                <p class="mt-2.5 text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-3xl">
                  Berasal dari Desa Bonde, Kecamatan Campalagian, Polewali Mandar. Menempuh pendidikan studi S1 di Universitas Al Asyariah Mandar tahun 2023 dan program magister di Universitas Handayani Makassar tahun 2025, serta aktif mengembangkan diri di bidang pendidikan dan teknologi informasi.
                </p>
              </div>
            </div>
          </div>

          <!-- Detail Informasi Pencipta -->
          <div class="p-6 sm:p-8 space-y-8 bg-[#fffdfb]">
          

            <!-- Visi Karya (2 Kolom) -->
              <div class="md:col-span-2 rounded-2xl bg-amber-50/50 border border-amber-200/50 p-5">
                <div class="flex items-center gap-2 text-[#7F1D1D] font-bold text-xs uppercase tracking-wider mb-2">
                  <i class="bi bi-compass-fill"></i>
                  <span>Visi di Balik Karya Ini</span>
                </div>
                <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Aplikasi ini merupakan salah satu bentuk pemanfaatan teknologi dalam mendukung budaya literasi, khususnya dalam mengenalkan dan mendokumentasikan pengetahuan serta sejarah lokal Mandar. Melalui karya ini, teknologi tidak hanya menjadi alat komputasi, tetapi juga media penjaga tradisi dan pengetahuan bagi generasi penerus.
                </p>
                <div class="mt-3 flex items-center gap-2 text-xs font-bold text-[#7F1D1D]">
                  <span>"Memajukan literasi dan pendidikan Sulawesi Barat."</span>
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

<style scoped>
.gsm-carousel {
  width: 100%;
  outline: none;
}

.gsm-carousel:focus-visible {
  border-radius: 1.5rem;
  outline: 3px solid rgb(217 119 6 / 60%);
  outline-offset: 4px;
}

.gsm-carousel__stage {
  position: relative;
  height: 32rem;
  overflow: hidden;
  perspective: 1000px;
  perspective-origin: 50% 44%;
  transform-style: preserve-3d;
}

/* Subtle depth-shadow glow behind the stack */
.gsm-carousel__stage::after {
  content: "";
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgb(120 53 15 / 18%) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.gsm-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(320px, 78vw);
  height: 27rem;
  transform-style: preserve-3d;
  /* Spring-like cubic-bezier — fast & snappy */
  transition:
    transform 380ms cubic-bezier(0.175, 0.885, 0.32, 1.08),
    opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 250ms ease;
  will-change: transform, opacity, filter;
}

.gsm-card.is-exiting {
  transform: translate3d(calc(-50% + var(--exit-x)), calc(-50% + 20px), 60px) rotate(var(--exit-rotation)) scale(0.78) !important;
  opacity: 0 !important;
  filter: blur(2px) !important;
  transition:
    transform 360ms cubic-bezier(0.55, 0.055, 0.675, 0.19),
    opacity 280ms ease-out,
    filter 280ms ease-out !important;
}

.gsm-card__button {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(120 53 15 / 12%);
  border-radius: 1.5rem;
  background: #3d1010;
  text-align: left;
  box-shadow:
    0 22px 50px rgb(41 24 15 / 22%),
    0 8px 20px rgb(41 24 15 / 12%),
    inset 0 1px 0 rgb(255 255 255 / 6%);
  isolation: isolate;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  transition: box-shadow 300ms ease;
}

.gsm-card__button:active {
  cursor: grabbing;
  box-shadow:
    0 30px 65px rgb(41 24 15 / 30%),
    0 12px 25px rgb(41 24 15 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 8%);
}

.gsm-card__button::after {
  position: absolute;
  z-index: 0;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 0 0 / 5%) 15%, rgb(0 0 0 / 15%) 42%, rgb(35 12 8 / 94%) 100%);
  content: "";
}

.gsm-card__button:focus-visible {
  outline: 3px solid rgb(217 119 6 / 70%);
  outline-offset: 2px;
}

.gsm-card__image {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 0.88;
  transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Subtle parallax on active card image */
.gsm-card__button:active .gsm-card__image {
  transform: scale(1.03);
}

.gsm-card__number {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 0.85rem;
  background: rgb(62 16 16 / 42%);
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  backdrop-filter: blur(8px);
  transition: transform 300ms ease, opacity 300ms ease;
}

.gsm-card.is-exiting .gsm-card__number {
  transform: scale(0.85);
  opacity: 0;
}

.gsm-card__details {
  position: absolute;
  right: 1.1rem;
  bottom: 1.25rem;
  left: 1.1rem;
  z-index: 1;
  display: grid;
  gap: 0.45rem;
  color: white;
  transition: transform 350ms ease, opacity 350ms ease;
}

.gsm-card.is-exiting .gsm-card__details {
  transform: translateY(8px);
  opacity: 0;
}

.gsm-card__role {
  color: #fcd34d;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  line-height: 1.4;
  text-transform: uppercase;
}

.gsm-card__name {
  font-family: inherit;
  font-size: clamp(1rem, 1.6vw, 1.3rem);
  font-weight: 800;
  line-height: 1.25;
}

.gsm-card__hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.3rem;
  color: rgb(255 255 255 / 75%);
  font-size: 0.75rem;
}

.gsm-carousel__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.gsm-carousel__arrow {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgb(120 53 15 / 16%);
  border-radius: 9999px;
  background: white;
  color: #7f1d1d;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgb(41 24 15 / 8%);
  transition: background 180ms ease, color 180ms ease, transform 220ms cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 180ms ease;
}

.gsm-carousel__arrow:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.06);
  background: #7f1d1d;
  color: white;
  box-shadow: 0 8px 20px rgb(127 29 29 / 25%);
}

.gsm-carousel__arrow:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
}

.gsm-carousel__arrow:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.gsm-carousel__indicators {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.gsm-carousel__dot {
  width: 0.55rem;
  height: 0.55rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: #d6c8b8;
  transition: width 280ms cubic-bezier(0.175, 0.885, 0.32, 1.275), background 220ms ease, transform 200ms ease;
}

.gsm-carousel__dot:hover:not(.is-current) {
  background: #c4a88a;
  transform: scale(1.25);
}

.gsm-carousel__dot.is-current {
  width: 1.5rem;
  background: #d97706;
}

.gsm-carousel__hint {
  margin-top: 0.65rem;
  color: #78716c;
  font-size: 0.75rem;
  text-align: center;
}

@media (max-width: 767px) {
  .gsm-carousel__stage {
    height: 29rem;
  }

  .gsm-card {
    width: min(320px, 82vw);
    height: 25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gsm-card,
  .gsm-carousel__arrow,
  .gsm-carousel__dot {
    transition-duration: 0.01ms;
  }

  .gsm-card.is-exiting {
    transition-duration: 0.01ms !important;
  }
}
</style>