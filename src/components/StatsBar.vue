<script setup>
import { useOnlinePresence } from '../composables/useOnlinePresence'

defineProps({ ebook: Number, kategori: Number, penulis: Number })

const { onlineCount } = useOnlinePresence()
</script>

<template>
  <div class="relative z-10 mx-auto -mt-12 max-w-4xl px-4 sm:px-5">
    <div class="grid grid-cols-3 divide-x divide-[#7F1D1D]/10 rounded-2xl bg-white py-4 sm:py-5 shadow-xl shadow-[#7F1D1D]/10 ring-1 ring-[#7F1D1D]/5">
      <div v-for="s in [
        { n: ebook, l: 'Ebook', isLive: false },
        { n: kategori, l: 'Kategori', isLive: false },
        { n: penulis, l: 'Penulis', isLive: false },
      ]" :key="s.l" class="text-center px-1">
        <div class="flex items-center justify-center gap-1.5">
          <span v-if="s.isLive" class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <p class="font-display text-xl font-bold text-[#7F1D1D] sm:text-3xl">{{ s.n }}</p>
        </div>
        <p class="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-stone-500">{{ s.l }}</p>
      </div>
    </div>
  </div>
</template>
