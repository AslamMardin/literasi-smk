<script setup>
defineProps({ ebook: Number, kategori: Number, penulis: Number })
</script>

<template>
  <div class="relative z-10 mx-auto -mt-12 max-w-3xl px-5">
    <div class="grid grid-cols-3 divide-x divide-[#7F1D1D]/10 rounded-2xl bg-white py-5 shadow-xl shadow-[#7F1D1D]/10 ring-1 ring-[#7F1D1D]/5">
      <div v-for="s in [
        { n: ebook, l: 'Ebook', i: '' },
        { n: kategori, l: 'Kategori', i: '' },
        { n: penulis, l: 'Penulis', i: '' },
      ]" :key="s.l" class="text-center">
        <p class="text-lg">{{ s.i }}</p>
        <p class="font-display text-2xl font-bold text-[#7F1D1D] sm:text-3xl">{{ s.n }}</p>
        <p class="text-[11px] font-medium uppercase tracking-wider text-stone-500">{{ s.l }}</p>
      </div>
    </div>
  </div>
</template>
