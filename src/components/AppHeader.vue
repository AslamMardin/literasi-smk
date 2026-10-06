<script setup>
import { useLiterasi } from '../composables/useLiterasi'

defineProps({ active: String })

const { studentName, hasStudentName, openEditNameModal, bookmarks } = useLiterasi()

const links = [
  { to: '#/', key: 'home', label: 'Beranda' },
  { to: '#/koleksi', key: 'koleksi', label: 'Koleksi' },
  { to: '#/bookmark', key: 'bookmark', label: 'Bookmark', isBookmark: true },
  { to: '#/tentang', key: 'tentang', label: 'Tentang' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[#7F1D1D]/10 bg-[#f8f1f1]/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4 md:px-6">
      <div class="flex items-center gap-3 md:gap-6">
        <a href="#/" class="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
            <img src="/logo.png" alt="Logo Literasi" class="h-full w-full object-contain">
          </span>
          <span class="font-display hidden whitespace-nowrap text-base font-bold text-[#7F1D1D] sm:inline md:text-lg">
            Literasi SMK
          </span>
        </a>

        <!-- Navigasi Utama -->
        <nav class="hidden sm:flex items-center gap-0 text-xs font-medium md:gap-1 md:text-sm">
          <a
            v-for="l in links"
            :key="l.key"
            :href="l.to"
            class="relative flex items-center gap-1.5 rounded-full px-2.5 py-2 transition md:px-4"
            :class="active === l.key
              ? 'bg-[#7F1D1D] text-amber-50 shadow'
              : 'text-[#4a1d1d] hover:bg-[#7F1D1D]/10'"
          >
            <span>{{ l.label }}</span>
            <!-- Badge jumlah bookmark -->
            <span
              v-if="l.isBookmark && bookmarks.length > 0"
              class="ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold"
              :class="active === l.key ? 'bg-amber-300 text-amber-950' : 'bg-[#7F1D1D] text-white'"
            >
              {{ bookmarks.length }}
            </span>
          </a>
        </nav>
      </div>

      <!-- Sapaan Nama Siswa di Header -->
      <div class="flex items-center gap-2">
        <div
          v-if="hasStudentName"
          class="flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white/80 py-1 pl-1.5 pr-2 sm:gap-2 md:pr-2.5 shadow-sm backdrop-blur"
        >
          <!-- Avatar Inisial -->
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-[#7F1D1D] text-xs font-bold text-amber-100 shadow"
          >
            {{ studentName.charAt(0).toUpperCase() }}
          </div>

          <!-- Sapaan Nama -->
          <div class="flex flex-col text-left text-xs leading-tight">
            <span class="text-[10px] text-stone-500 font-medium">Hai</span>
            <span class="max-w-[90px] truncate font-bold text-[#7F1D1D] sm:max-w-[110px] md:max-w-[160px]">
              {{ studentName }} 
            </span>
          </div>

          <!-- Tombol Ubah Nama -->
          <button
            type="button"
            @click="openEditNameModal"
            title="Ubah nama siswa"
            class="ml-1 rounded-full p-1 text-stone-400 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D] transition"
          >
            <i class="bi bi-pencil-square text-xs"></i>
          </button>
        </div>

        <!-- Jika belum ada nama -->
        <button
          v-else
          type="button"
          @click="openEditNameModal"
          class="flex items-center gap-1.5 rounded-full bg-[#7F1D1D] px-3 py-2 text-xs font-bold text-amber-50 shadow transition hover:bg-[#681818] md:px-4"
        >
          <i class="bi bi-person-fill"></i>
          <span>Masukkan Nama</span>
        </button>
      </div>
    </div>

    <!-- Navigasi Mobile Bar Bawah -->
    <div class="flex sm:hidden border-t border-[#7F1D1D]/10 px-3 py-1.5 justify-around bg-white/60 text-xs font-medium">
      <a
        v-for="l in links"
        :key="l.key"
        :href="l.to"
        class="relative px-2.5 py-1 rounded-lg transition"
        :class="active === l.key ? 'text-[#7F1D1D] font-bold' : 'text-stone-600'"
      >
        <span>{{ l.label }}</span>
        <span
          v-if="l.isBookmark && bookmarks.length > 0"
          class="ml-1 rounded-full bg-[#7F1D1D] px-1.5 py-0.2 text-[9px] font-bold text-white"
        >
          {{ bookmarks.length }}
        </span>
      </a>
    </div>
  </header>
</template>
