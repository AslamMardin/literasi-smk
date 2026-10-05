<script setup>
defineProps({
  query: String,
  kategori: String,
  daftarKategori: { type: Array, default: () => [] },
})
defineEmits(['update:query', 'update:kategori'])
</script>

<template>
  <div class="space-y-4">
    <div class="relative">
      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
      <input
        :value="query"
        type="search"
        placeholder="Cari judul atau penulis…"
        class="w-full rounded-2xl border border-emerald-900/10 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        @input="$emit('update:query', $event.target.value)"
      />
    </div>
    <div class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <button
        v-for="k in ['Semua', ...daftarKategori]"
        :key="k"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition"
        :class="(kategori || 'Semua') === k
          ? 'border-emerald-800 bg-emerald-800 text-amber-50 shadow'
          : 'border-emerald-900/15 bg-white text-emerald-900 hover:border-emerald-700 hover:bg-emerald-50'"
        @click="$emit('update:kategori', k === 'Semua' ? '' : k)"
      >
        {{ k }}
      </button>
    </div>
  </div>
</template>
