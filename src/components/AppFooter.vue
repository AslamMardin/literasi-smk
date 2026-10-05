<template>
  <footer class="mt-16 bg-emerald-950 text-emerald-100">
    <div class="mx-auto max-w-6xl px-5 py-10 sm:px-6">

      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

        <!-- Identitas -->
        <div class="max-w-md">
          <h2 class="font-display text-xl font-semibold text-amber-200">
            Literasi Digital
          </h2>

          <p class="mt-2 text-sm leading-6 text-emerald-100/70">
            Ruang baca digital SMKN Campalagian untuk mendukung
            budaya membaca dan memperluas akses siswa terhadap
            berbagai sumber bacaan.
          </p>
        </div>

        <!-- Navigasi -->
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
            Navigasi
          </p>

          <nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a
              href="#/"
              class="text-emerald-100/75 transition hover:text-amber-200"
            >
              Beranda
            </a>

            <a
              href="#/koleksi"
              class="text-emerald-100/75 transition hover:text-amber-200"
            >
              Koleksi
            </a>

            <a
              href="#/tentang"
              class="text-emerald-100/75 transition hover:text-amber-200"
            >
              Tentang
            </a>
          </nav>
        </div>

      </div>

      <!-- Garis -->
      <div class="my-7 border-t border-emerald-800"></div>

      <!-- Copyright -->
      <div class="flex flex-col gap-2 text-xs text-emerald-100/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 SMKN Campalagian
        </p>

        <p>
          Dikembangkan oleh
          <span class="text-emerald-100/75">
            Aslam Mardin, S.Kom., M.Kom., Gr.
          </span>
        </p>
      </div>

    </div>
  </footer>
</template>