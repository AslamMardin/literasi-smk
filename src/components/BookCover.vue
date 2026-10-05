<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ ebook: { type: Object, required: true } })
const failed = ref(false)

const gradients = {
  Novel: 'from-rose-800 via-rose-900 to-stone-900',
  'Pengembangan Diri': 'from-emerald-800 via-emerald-900 to-teal-950',
  Bisnis: 'from-amber-800 via-amber-900 to-stone-900',
  Filsafat: 'from-indigo-800 via-indigo-900 to-slate-950',
  Pendidikan: 'from-sky-800 via-sky-900 to-slate-950',
  Sejarah: 'from-amber-900 via-stone-900 to-neutral-950',
  Spiritual: 'from-teal-800 via-emerald-950 to-stone-950',
  Teknologi: 'from-cyan-800 via-blue-900 to-slate-950',
  Sastra: 'from-purple-800 via-purple-950 to-stone-950',
}

const bgGradient = computed(() => gradients[props.ebook?.kategori] || 'from-emerald-800 to-emerald-950')
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

