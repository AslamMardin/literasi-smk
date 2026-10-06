<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  video: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close'])

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && video"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md transition-all"
      @click.self="emit('close')"
    >
      <div class="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#1e1414] shadow-2xl ring-1 ring-white/10 animate-fade-up">
        <!-- Header Modal -->
        <div class="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 bg-[#2b1919]/60">
          <div class="flex items-center gap-2.5 overflow-hidden pr-3">
            <span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow">
              <i class="bi bi-youtube text-sm"></i>
            </span>
            <div class="truncate">
              <h3 class="truncate text-sm font-bold text-amber-50 sm:text-base">
                {{ video.judul }}
              </h3>
              <p class="text-[11px] text-amber-200/70 truncate">
                {{ video.channel || 'Literasi SMK' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Tombol Buka di YouTube Asli -->
            <a
              :href="video.parsed?.directUrl || video.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition"
              title="Buka di YouTube Web / Aplikasi"
            >
              <i class="bi bi-box-arrow-up-right"></i>
              <span>Buka di YouTube</span>
            </a>

            <!-- Tombol Close -->
            <button
              type="button"
              @click="emit('close')"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-red-600 hover:text-white transition"
              title="Tutup (Esc)"
            >
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Video Iframe Container (16:9 Aspect Ratio) -->
        <div class="relative w-full bg-black" style="padding-top: 56.25%;">
          <iframe
            v-if="video.parsed?.embedUrl"
            :src="video.parsed.embedUrl"
            title="YouTube video player"
            class="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <!-- Footer / Deskripsi Singkat -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#170e0e] px-4 py-3 sm:px-6 text-xs text-stone-300">
          <p class="text-stone-400 text-xs line-clamp-2 sm:line-clamp-1">
            {{ video.deskripsi || 'Video edukasi dan materi literasi terpadu.' }}
          </p>

          <a
            :href="video.parsed?.directUrl || video.url"
            target="_blank"
            rel="noopener noreferrer"
            class="sm:hidden flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-bold text-white transition hover:bg-red-700"
          >
            <i class="bi bi-youtube"></i>
            <span>Buka di Aplikasi YouTube</span>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-up {
  animation: modalFadeIn 0.22s ease-out forwards;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
