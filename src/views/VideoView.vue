<script setup>
import { ref, computed } from 'vue'
import { videos, videoCategories, parseYouTubeUrl } from '../data/videos'
import VideoCard from '../components/VideoCard.vue'
import VideoModal from '../components/VideoModal.vue'

const searchQuery = ref('')
const selectedCategory = ref('Semua')

// Video yang sedang diputar di modal
const activeVideo = ref(null)
const isModalOpen = ref(false)

// Siapkan data video dengan parsed YouTube metadata
const parsedVideos = computed(() => {
  return videos.map((v) => ({
    ...v,
    parsed: parseYouTubeUrl(v.url, v.thumbnail)
  }))
})

// Filter data video
const filteredVideos = computed(() => {
  return parsedVideos.value.filter((v) => {
    const matchCategory =
      selectedCategory.value === 'Semua' || v.kategori === selectedCategory.value

    const q = searchQuery.value.toLowerCase().trim()
    const matchQuery =
      !q ||
      v.judul.toLowerCase().includes(q) ||
      (v.deskripsi && v.deskripsi.toLowerCase().includes(q)) ||
      (v.channel && v.channel.toLowerCase().includes(q))

    return matchCategory && matchQuery
  })
})

// Paginasi / Limit agar rendering 250+ video tetap super cepat dan ringan
const visibleLimit = ref(12)
const visibleVideos = computed(() => filteredVideos.value.slice(0, visibleLimit.value))
const hasMore = computed(() => visibleLimit.value < filteredVideos.value.length)

function loadMore() {
  visibleLimit.value += 12
}

function setCategory(cat) {
  selectedCategory.value = cat
  visibleLimit.value = 12
}

function openPlayer(video) {
  activeVideo.value = video
  isModalOpen.value = true
}

function closePlayer() {
  isModalOpen.value = false
  activeVideo.value = null
}
</script>

<template>
  <div class="pb-20">
    <!-- Header Banner Video -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[#3d1010] via-[#7F1D1D] to-[#1b0909] px-5 py-12 text-amber-50 sm:py-16 sm:px-6">
      <div class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-400/10 blur-3xl"></div>

      <div class="relative z-10 mx-auto max-w-5xl text-center">
        <div class="inline-flex items-center gap-2  px-3.5 py-1 text-xs font-semibold text-amber-200 backdrop-blur mb-3">
          <i class="bi bi-play-btn-fill text-white" style="font-size: 4rem;"></i>
        </div>

        <!-- <h1 class="font-display text-2xl font-bold tracking-tight sm:text-4xl">
          Video Literasi & Edukasi SMK
        </h1> -->
        <p class="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-stone-300">
          Tonton playlist pembelajaran, video tutorial, serta konten inspiratif yang dapat diputar langsung di web atau melalui aplikasi YouTube.
        </p>

        <!-- Search Bar -->
        <div class="mx-auto mt-6 max-w-lg">
          <div class="relative flex items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl">
            <span class="pl-3 text-stone-400">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari judul video, materi, atau playlist..."
              class="w-full bg-transparent px-3 text-sm text-[#3d1010] outline-none placeholder:text-stone-400"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-stone-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
    <div class="my-10"></div>
    <!-- Main Content -->
    <main class="mx-auto max-w-6xl px-4 sm:px-6 -mt-4">
      <!-- Filter Kategori Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
        <button
          v-for="cat in videoCategories"
          :key="cat"
          type="button"
          @click="setCategory(cat)"
          class="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-sm"
          :class="selectedCategory === cat
            ? 'bg-[#7F1D1D] text-amber-50 shadow-md ring-2 ring-[#7F1D1D]/30'
            : 'bg-white text-stone-600 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D]'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Hasil / Info Hitungan -->
      <div class="mt-4 flex items-center justify-between text-xs text-stone-500">
        <span>Menampilkan <strong class="text-[#7F1D1D]">{{ visibleVideos.length }}</strong> dari <strong class="text-[#7F1D1D]">{{ filteredVideos.length }}</strong> video</span>
        <span v-if="selectedCategory !== 'Semua'">Kategori: <span class="font-semibold text-stone-700">{{ selectedCategory }}</span></span>
      </div>

      <!-- Video Grid -->
      <div v-if="filteredVideos.length > 0" class="mt-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <VideoCard
            v-for="v in visibleVideos"
            :key="v.id"
            :video="v"
            @play="openPlayer"
          />
        </div>

        <!-- Tombol Muat Lebih Banyak -->
        <div v-if="hasMore" class="mt-10 text-center">
          <button
            type="button"
            @click="loadMore"
            class="inline-flex items-center gap-2 rounded-2xl bg-[#7F1D1D] px-6 py-3 text-xs sm:text-sm font-bold text-amber-50 shadow-lg shadow-[#7F1D1D]/20 transition-all hover:bg-[#661616] hover:scale-105 active:scale-95"
          >
            <i class="bi bi-arrow-down-circle"></i>
            <span>Muat Lebih Banyak ({{ filteredVideos.length - visibleVideos.length }} video tersisa)</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="mt-12 flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200/60">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-3">
          <i class="bi bi-film text-3xl"></i>
        </div>
        <h3 class="font-display text-base font-bold text-stone-800">
          Video Tidak Ditemukan
        </h3>
        <p class="mt-1 text-xs text-stone-500 max-w-sm">
          Tidak ada video yang cocok dengan kata kunci "{{ searchQuery }}". Coba cari dengan kata kunci lain.
        </p>
        <button
          @click="searchQuery = ''; selectedCategory = 'Semua'"
          class="mt-4 rounded-xl bg-[#7F1D1D] px-4 py-2 text-xs font-bold text-amber-50 transition hover:bg-[#661616]"
        >
          Reset Filter
        </button>
      </div>
    </main>

    <!-- Modal Player Popup -->
    <VideoModal
      :is-open="isModalOpen"
      :video="activeVideo"
      @close="closePlayer"
    />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
