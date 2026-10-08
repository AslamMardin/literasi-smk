<script setup>
import { useReadingStats } from '../composables/useReadingStats'

const { topGlobal, rajinMingguIni, isLoading, error } = useReadingStats()

function formatDuration(seconds) {
  const totalMinutes = Math.floor(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} menit`
  if (hours > 0) return `${hours} jam`
  if (totalMinutes > 0) return `${totalMinutes} menit`
  return `${seconds} detik`
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-10 sm:px-6">
    <div class="mb-6">
      <h2 class="font-display text-2xl font-bold text-[#4a1d1d] sm:text-3xl">Siswa Paling Rajin Membaca</h2>
      <p class="mt-1 text-sm text-stone-500">Peringkat berdasarkan akumulasi waktu membaca aktif.</p>
      <div class="mt-2 h-1 w-12 rounded-full bg-[#d97706]"></div>
    </div>

    <p v-if="error" class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="status">
      {{ error }}
    </p>

    <div class="grid gap-5 md:grid-cols-2">
      <section class="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
        <h3 class="font-display text-lg font-bold text-[#7F1D1D]">Top Global</h3>
        <p class="mb-4 text-xs text-stone-500">Total waktu membaca sejak fitur dimulai.</p>

        <p v-if="isLoading" class="py-5 text-center text-sm text-stone-500">Memuat peringkat...</p>
        <p v-else-if="!topGlobal.length" class="py-5 text-center text-sm text-stone-500">
          Belum ada data waktu membaca.
        </p>
        <ol v-else class="space-y-3">
          <li
            v-for="(student, index) in topGlobal"
            :key="student.nis"
            class="flex items-center gap-3"
          >
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-[#7F1D1D]">
              {{ index + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-stone-800">{{ student.name }}</p>
              <p class="truncate text-xs text-stone-500">{{ student.kelas }}</p>
            </div>
            <span class="shrink-0 text-right text-xs font-bold text-[#7F1D1D]">
              {{ formatDuration(student.seconds) }}
            </span>
          </li>
        </ol>
      </section>

      <section class="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
        <h3 class="font-display text-lg font-bold text-[#7F1D1D]">Rajin Minggu Ini</h3>
        <p class="mb-4 text-xs text-stone-500">Dihitung mulai Senin pukul 00.00 WITA.</p>

        <p v-if="isLoading" class="py-5 text-center text-sm text-stone-500">Memuat peringkat...</p>
        <p v-else-if="!rajinMingguIni.length" class="py-5 text-center text-sm text-stone-500">
          Belum ada data membaca minggu ini.
        </p>
        <ol v-else class="space-y-3">
          <li
            v-for="(student, index) in rajinMingguIni"
            :key="student.nis"
            class="flex items-center gap-3"
          >
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-[#7F1D1D]">
              {{ index + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-stone-800">{{ student.name }}</p>
              <p class="truncate text-xs text-stone-500">{{ student.kelas }}</p>
            </div>
            <span class="shrink-0 text-right text-xs font-bold text-[#7F1D1D]">
              {{ formatDuration(student.seconds) }}
            </span>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>
