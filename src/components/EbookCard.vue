<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BookCover from './BookCover.vue'
import { useLiterasi } from '../composables/useLiterasi'

const props = defineProps({
  ebook: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const { isBookmarked, toggleBookmark } = useLiterasi()

const cardRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && cardRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          isVisible.value = true
          if (observer) {
            observer.disconnect()
            observer = null
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '80px 200px 80px 200px',
      }
    )
    observer.observe(cardRef.value)
  } else {
    isVisible.value = true
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div
    ref="cardRef"
    class="w-full transition-opacity"
    :class="isVisible ? 'animate-reveal' : 'opacity-0'"
    :style="isVisible ? { animationDelay: `${(props.index % 8) * 60}ms` } : {}"
  >
    <a :href="`#/buku/${encodeURIComponent(ebook.id)}`" class="group relative block">
      <div class="relative overflow-hidden rounded-xl shadow-md shadow-[#7F1D1D]/15 ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#7F1D1D]/25">
        <BookCover :ebook="ebook" class="transition duration-500 group-hover:scale-105" />

        <!-- Tombol Bookmark Cepat di Kartu Ebook -->
        <button
          type="button"
          @click.stop.prevent="toggleBookmark(ebook.id)"
          :title="isBookmarked(ebook.id) ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'"
          class="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition duration-200 hover:scale-110 shadow-md"
          :class="
            isBookmarked(ebook.id)
              ? 'bg-[#7F1D1D] text-amber-300 ring-2 ring-amber-300/60'
              : 'bg-black/40 text-white/90 hover:bg-[#7F1D1D] hover:text-amber-200'
          "
        >
          <i
            class="bi text-sm"
            :class="isBookmarked(ebook.id) ? 'bi-bookmark-fill' : 'bi-bookmark'"
          ></i>
        </button>

        <div class="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#2d0909]/90 to-transparent p-4 pt-10 text-center text-sm font-semibold text-amber-100 transition duration-300 group-hover:translate-y-0">
          Lihat Detail →
        </div>
      </div>
    </a>
  </div>
</template>
