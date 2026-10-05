<script setup>
import { ref } from 'vue'
defineProps({ ebook: { type: Object, required: true } })
const failed = ref(false)
</script>

<template>
  <div class="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950">
    <img
      v-if="ebook.cover && !failed"
      :src="ebook.cover"
      :alt="`Sampul ${ebook.judul}`"
      loading="lazy"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div v-else class="flex h-full flex-col justify-between p-5 text-amber-100">
      <span class="text-2xl">📘</span>
      <div>
        <p class="font-display text-xl font-bold leading-snug">{{ ebook.judul }}</p>
        <p class="mt-2 text-xs opacity-80">{{ ebook.penulis }}</p>
      </div>
    </div>
    <!-- efek punggung buku -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent"></div>
  </div>
</template>
