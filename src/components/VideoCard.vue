<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})

defineEmits(['play'])
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-[#7F1D1D]/5 ring-1 ring-[#7F1D1D]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7F1D1D]/15">
    <!-- Thumbnail Container -->
    <div
      class="relative aspect-video w-full overflow-hidden bg-stone-900 cursor-pointer"
      @click="$emit('play', video)"
    >
      <img
        :src="video.parsed.thumbnail"
        :alt="video.judul"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

      <!-- Badge Tipe (Playlist / Video) -->
      <div class="absolute left-3 top-3 flex items-center gap-1.5">
        <span
          v-if="video.tipe === 'playlist' || video.parsed.type === 'playlist'"
          class="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-amber-950 shadow-md backdrop-blur"
        >
          <i class="bi bi-collection-play-fill text-xs"></i>
          <span>Playlist</span>
        </span>
        <span
          v-else
          class="flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-md backdrop-blur"
        >
          <i class="bi bi-play-circle-fill text-xs"></i>
          <span>Video</span>
        </span>

        <span
          v-if="video.kategori"
          class="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-stone-200 backdrop-blur"
        >
          {{ video.kategori }}
        </span>
      </div>

      <!-- Play Button Glow Icon Center -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-900/60 ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110">
          <i class="bi bi-play-fill text-2xl ml-0.5"></i>
        </div>
      </div>

      <!-- Bottom Info on Thumbnail: Channel + Duration -->
      <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-stone-200">
        <span class="truncate font-medium flex items-center gap-1 max-w-[70%]">
          <i class="bi bi-person-circle text-amber-300"></i>
          <span class="truncate">{{ video.channel || 'Literasi Mandar' }}</span>
        </span>

        <!-- Badge Durasi Video -->
        <span
          v-if="video.durasi"
          class="rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white tracking-wider backdrop-blur"
        >
          {{ video.durasi }}
        </span>
      </div>
    </div>

    <!-- Content / Detail -->
    <div class="flex flex-1 flex-col p-4">
      <!-- Info Bar: Views & Durasi Detil -->
      <div v-if="video.views" class="mb-1.5 flex items-center gap-2 text-[11px] text-stone-500 font-medium">
        <span class="flex items-center gap-1">
          <i class="bi bi-eye"></i>
          {{ typeof video.views === 'number' ? video.views.toLocaleString('id-ID') : video.views }} tayangan
        </span>
      </div>
      <h3
        class="font-display line-clamp-2 text-sm sm:text-base font-bold text-[#4a1313] transition hover:text-[#7F1D1D] cursor-pointer"
        @click="$emit('play', video)"
        :title="video.judul"
      >
        {{ video.judul }}
      </h3>

      <p class="mt-1.5 flex-1 line-clamp-2 text-xs leading-relaxed text-stone-600">
        {{ video.deskripsi || 'Video edukasi dan panduan literasi interaktif.' }}
      </p>

      <!-- Action Buttons -->
      <div class="mt-4 flex items-center gap-2 pt-2 border-t border-stone-100">
        <button
          type="button"
          @click="$emit('play', video)"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7F1D1D] px-3 py-2 text-xs font-bold text-amber-50 shadow transition hover:bg-[#631414] active:scale-[0.98]"
        >
          <i class="bi bi-play-fill text-sm"></i>
          <span>Putar Video</span>
        </button>

        <a
          :href="video.parsed.directUrl || video.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
          title="Buka langsung di YouTube"
        >
          <i class="bi bi-youtube text-sm"></i>
        </a>
      </div>
    </div>
  </div>
</template>
