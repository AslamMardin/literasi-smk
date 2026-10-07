<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import EbookCard from './EbookCard.vue'

const props = defineProps({
  ebooks: { type: Array, default: () => [] },
})

const trackRef = ref(null)
const cardEls = ref([])
const currentIndex = ref(0)
let ticking = false

// Mouse drag scrolling state
let isMouseDown = false
let startX = 0
let scrollLeftStart = 0
let hasDragged = false

function updateFocus() {
  if (!trackRef.value) return
  const track = trackRef.value
  const containerCenter = track.scrollLeft + track.clientWidth / 2
  const children = track.children

  let closestIdx = 0
  let minDiff = Infinity

  for (let i = 0; i < children.length; i++) {
    const card = children[i]
    if (!card.classList.contains('carousel-card')) continue

    const cardCenter = card.offsetLeft + card.offsetWidth / 2
    const diff = Math.abs(containerCenter - cardCenter)

    if (diff < minDiff) {
      minDiff = diff
      closestIdx = i
    }

    // Hitung jarak relatif terhadap lebar kartu
    const baseWidth = card.offsetWidth || 220
    const reach = baseWidth * 1.3
    const ratio = Math.max(0, 1 - diff / reach) // 1 di tengah, 0 di samping

    // Transformasi halus: Skala 0.88 -> 1.10, Opacity 0.70 -> 1.0
    const scale = 0.88 + ratio * 0.22
    const opacity = 0.7 + ratio * 0.3
    const zIndex = Math.round(ratio * 15) + 1

    card.style.setProperty('--c-scale', scale.toFixed(3))
    card.style.setProperty('--c-opacity', opacity.toFixed(3))
    card.style.zIndex = zIndex
  }

  currentIndex.value = closestIdx
  ticking = false
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateFocus)
    ticking = true
  }
}

function scrollToIndex(index) {
  if (!trackRef.value) return
  const track = trackRef.value
  const cards = track.querySelectorAll('.carousel-card')
  if (cards[index]) {
    const card = cards[index]
    const targetScroll = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
    track.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }
}

function prev() {
  if (currentIndex.value > 0) {
    scrollToIndex(currentIndex.value - 1)
  }
}

function next() {
  if (currentIndex.value < props.ebooks.length - 1) {
    scrollToIndex(currentIndex.value + 1)
  }
}

function handleCardClick(idx, event) {
  if (hasDragged) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  // Jika kartu yang diklik bukan yang sedang di tengah, geser ke tengah dulu
  if (idx !== currentIndex.value) {
    event.preventDefault()
    event.stopPropagation()
    scrollToIndex(idx)
  }
}

// Support drag mouse di desktop
function onMouseDown(e) {
  isMouseDown = true
  hasDragged = false
  startX = e.pageX - trackRef.value.offsetLeft
  scrollLeftStart = trackRef.value.scrollLeft
}

function onMouseMove(e) {
  if (!isMouseDown) return
  const x = e.pageX - trackRef.value.offsetLeft
  const walk = (x - startX) * 1.4
  if (Math.abs(walk) > 6) {
    hasDragged = true
  }
  trackRef.value.scrollLeft = scrollLeftStart - walk
}

function onMouseUp() {
  isMouseDown = false
}

onMounted(() => {
  nextTick(() => {
    updateFocus()
    // Scroll awal ke item pertama di tengah
    if (trackRef.value) {
      trackRef.value.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', updateFocus)
    }
  })
})

onBeforeUnmount(() => {
  if (trackRef.value) {
    trackRef.value.removeEventListener('scroll', onScroll)
  }
  window.removeEventListener('resize', updateFocus)
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

.carousel-card {
  transform: scale(var(--c-scale, 0.9));
  opacity: var(--c-opacity, 0.75);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease;
  will-change: transform, opacity;
}

.carousel-card.is-center {
  filter: drop-shadow(0 16px 24px rgba(127, 29, 29, 0.22));
}
</style>

<template>
  <div class="relative py-2">
    <!-- Tombol Navigasi Kiri & Kanan (Desktop & Tablet) -->
    <button
      type="button"
      @click="prev"
      aria-label="Ebook sebelumnya"
      :disabled="currentIndex === 0"
      class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#7F1D1D] shadow-xl ring-1 ring-black/10 backdrop-blur hover:bg-[#7F1D1D] hover:text-amber-100 transition duration-200 disabled:opacity-20 disabled:pointer-events-none"
    >
      <i class="bi bi-chevron-left text-lg"></i>
    </button>

    <button
      type="button"
      @click="next"
      aria-label="Ebook berikutnya"
      :disabled="currentIndex >= ebooks.length - 1"
      class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#7F1D1D] shadow-xl ring-1 ring-black/10 backdrop-blur hover:bg-[#7F1D1D] hover:text-amber-100 transition duration-200 disabled:opacity-20 disabled:pointer-events-none"
    >
      <i class="bi bi-chevron-right text-lg"></i>
    </button>

    <!-- Side Gradient Fade untuk transisi samping yang halus -->
    <div class="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 sm:w-20 bg-gradient-to-r from-[#f8f1f1] to-transparent"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 sm:w-20 bg-gradient-to-l from-[#f8f1f1] to-transparent"></div>

    <!-- Track Carousel Horizontal -->
    <div
      ref="trackRef"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      class="scrollbar-hide flex items-center gap-4 sm:gap-7 overflow-x-auto py-10 sm:py-12 snap-x snap-mandatory touch-pan-x cursor-grab active:cursor-grabbing select-none px-[calc(50%-95px)] sm:px-[calc(50%-110px)] md:px-[calc(50%-120px)]"
    >
      <div
        v-for="(e, idx) in ebooks"
        :key="e.id"
        class="carousel-card shrink-0 snap-center w-[190px] sm:w-[220px] md:w-[240px]"
        :class="idx === currentIndex ? 'is-center' : ''"
        @click="handleCardClick(idx, $event)"
      >
        <EbookCard :ebook="e" :index="idx" />
      </div>
    </div>

    <!-- Indikator Posisi & Navigasi Titik -->
    <div class="mt-1 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-500">
      <!-- <div class="flex items-center gap-1.5">
        <span class="font-medium">Fokus Ebook:</span>
        <span class="rounded-full bg-[#7F1D1D]/10 px-2.5 py-0.5 font-bold text-[#7F1D1D]">
          {{ currentIndex + 1 }} / {{ ebooks.length }}
        </span>
      </div> -->

      <!-- Quick Jump Dots (Maks 10 titik agar tetap rapi) -->
      <!-- <div class="flex items-center gap-1.5">
        <button
          v-for="(e, i) in ebooks.slice(0, Math.min(ebooks.length, 10))"
          :key="e.id"
          type="button"
          @click="scrollToIndex(i)"
          :title="e.judul"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="currentIndex === i ? 'w-6 bg-[#7F1D1D]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'"
        ></button>
      </div> -->
    </div>
  </div>
</template>
