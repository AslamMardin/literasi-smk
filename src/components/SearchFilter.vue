<script setup>
defineProps({
  query: String,
  kategori: String,
  daftarKategori: { type: Array, default: () => [] },
})
defineEmits(['update:query', 'update:kategori'])
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<template>
  <div class="space-y-4">
    <div class="relative">
      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><i class="bi bi-search"></i></span>
      <input
        :value="query"
        type="search"
        placeholder="Cari judul atau penulis…"
        class="w-full rounded-2xl border border-[#7F1D1D]/10 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-[#7F1D1D] focus:ring-4 focus:ring-[#7F1D1D]/10"
        @input="$emit('update:query', $event.target.value)"
      />
    </div>
    <div class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide sm:mx-0 sm:flex-wrap sm:px-0">
      <button
        v-for="k in ['Semua', ...daftarKategori]"
        :key="k"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition"
        :class="(kategori || 'Semua') === k
          ? 'border-[#7F1D1D] bg-[#7F1D1D] text-amber-50 shadow'
          : 'border-[#7F1D1D]/15 bg-white text-[#4a1d1d] hover:border-[#7F1D1D] hover:bg-[#f8f1f1]'"
        @click="$emit('update:kategori', k === 'Semua' ? '' : k)"
      >
        {{ k }}
      </button>
    </div>
  </div>
</template>
