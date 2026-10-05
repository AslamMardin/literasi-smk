<template>
  <footer class="mt-20 bg-emerald-950 text-emerald-100/80">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm sm:flex-row">
      <p class="font-display text-lg text-amber-200">Literasi Digital SMKN Campalagian</p>
      <div class="flex items-center gap-5">
        <a href="#/" class="transition hover:text-amber-200">Beranda</a>
        <a href="#/koleksi" class="transition hover:text-amber-200">Koleksi</a>
        <a href="#/tentang" class="transition hover:text-amber-200">Tentang</a>
      </div>
      <p class="text-xs text-emerald-100/60">© {{ new Date().getFullYear() }} SMKN Campalagian</p>
    </div>
  </footer>
</template>
