<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ ebook: { type: Object, required: true } })
const failed = ref(false)

const gradients = {
  Novel: 'from-[#7F1D1D] via-[#5b1717] to-stone-900',
  'Pengembangan Diri': 'from-[#8f2d2d] via-[#7F1D1D] to-[#2a0f0f]',
  Bisnis: 'from-[#9f4a3f] via-[#7F1D1D] to-stone-900',
  Filsafat: 'from-[#5f2d2d] via-[#4a1d1d] to-slate-950',
  Pendidikan: 'from-[#8a3d3d] via-[#6d1f1f] to-slate-950',
  Sejarah: 'from-[#7a2b2b] via-stone-900 to-neutral-950',
  Spiritual: 'from-[#8d4a4a] via-[#4a1d1d] to-stone-950',
  Teknologi: 'from-[#8b3a3a] via-[#4a1d1d] to-slate-950',
  Sastra: 'from-[#7a3f3f] via-[#4b1c1c] to-stone-950',
}

const bgGradient = computed(() => gradients[props.ebook?.kategori] || 'from-[#7F1D1D] to-[#2d0909]')
</script>

<template>
  <div :class="['relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br', bgGradient]">
    <img
      v-if="ebook.cover && !failed"
      :src="ebook.cover"
      :alt="`Sampul ${ebook.judul}`"
      loading="lazy"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div v-else class="flex h-full flex-col justify-between p-5 text-amber-100">
      <span class="text-2xl"><i class="bi bi-book"></i></span>
      <div>
        <p class="font-display text-lg font-bold leading-snug line-clamp-3">{{ ebook.judul }}</p>
        <p class="mt-2 text-xs opacity-80 truncate">{{ ebook.penulis }}</p>
      </div>
    </div>
    <!-- efek punggung buku -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent"></div>
  </div>
</template>

