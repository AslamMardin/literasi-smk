<script setup>
defineProps({ active: String })
const links = [
  { to: '#/', key: 'home', label: 'Beranda' },
  { to: '#/koleksi', key: 'koleksi', label: 'Koleksi' },
  { to: '#/tentang', key: 'tentang', label: 'Tentang' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#fbf7ef]/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <a href="#/" class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-lg shadow-md shadow-emerald-900/20">📖</span>
        <span class="leading-tight">
          <span class="font-display block text-[15px] font-bold text-emerald-900">Literasi Digital</span>
          <span class="hidden text-[11px] tracking-wide text-emerald-800/70 sm:block">SMKN Campalagian</span>
        </span>
      </a>
      <nav class="flex items-center gap-1 text-sm font-medium">
        <a
          v-for="l in links" :key="l.key" :href="l.to"
          class="rounded-full px-4 py-2 transition"
          :class="active === l.key
            ? 'bg-emerald-800 text-amber-50 shadow'
            : 'text-emerald-900 hover:bg-emerald-800/10'"
        >{{ l.label }}</a>
      </nav>
    </div>
  </header>
</template>
