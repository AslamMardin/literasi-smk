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
        <span class="flex h-10 w-10 items-center justify-center rounded-xl ">
          <img src="/logo.png" alt="">
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
