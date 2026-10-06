<script setup>
import { useLiterasi } from '../composables/useLiterasi'
import { useOnlinePresence } from '../composables/useOnlinePresence'

defineProps({ active: String })

const { studentName, studentClass, hasStudentName, openEditNameModal, bookmarks } = useLiterasi()
const { onlineCount } = useOnlinePresence()

const links = [
  { to: '#/', key: 'home', label: 'Beranda', icon: 'bi-house-door-fill' },
  { to: '#/koleksi', key: 'koleksi', label: 'Koleksi', icon: 'bi-book-half' },
  { to: '#/sejarah', key: 'sejarah', label: 'Sejarah', icon: 'bi-globe-americas'},
  { to: '#/video', key: 'video', label: 'Video', icon: 'bi-play-btn-fill' },
  { to: '#/puisi', key: 'puisi', label: 'Puisi', icon: 'bi-feather' },
  { to: '#/bookmark', key: 'bookmark', label: 'Bookmark', icon: 'bi-bookmark-heart-fill', isBookmark: true },
  { to: '#/tentang', key: 'tentang', label: 'Tentang', icon: 'bi-info-circle-fill' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[#7F1D1D]/10 bg-[#f8f1f1]/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4 md:px-6">
      <div class="flex items-center gap-3 md:gap-5">
        <a href="#/" class="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm">
            <img src="/logo.png" alt="Logo Literasi" class="h-full w-full object-contain">
          </span>
          <span class="font-display hidden whitespace-nowrap text-base font-bold text-[#7F1D1D] sm:inline md:text-lg">
            Literasi
          </span>
        </a>

        <!-- Navigasi Utama (Icon pada Tablet, Icon + Teks pada Desktop) -->
        <nav class="hidden sm:flex items-center gap-1 md:gap-1.5 text-xs font-medium">
          <a
            v-for="l in links"
            :key="l.key"
            :href="l.to"
            :title="l.label"
            class="relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition lg:px-3.5 lg:py-2"
            :class="active === l.key
              ? 'bg-[#7F1D1D] text-amber-50 shadow'
              : 'text-[#4a1d1d] hover:bg-[#7F1D1D]/10'"
          >
            <!-- Icon Navigasi -->
            <i class="bi text-sm md:text-base lg:text-sm" :class="l.icon"></i>

            <!-- Teks Label (Disembunyikan di Tablet, Muncul di Desktop Layar Lebar) -->
            <span class="hidden lg:inline">{{ l.label }}</span>

            <!-- Badge jumlah bookmark -->
            <span
              v-if="l.isBookmark && bookmarks.length > 0"
              class="ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold shadow-sm"
              :class="active === l.key ? 'bg-amber-300 text-amber-950' : 'bg-[#7F1D1D] text-white'"
            >
              {{ bookmarks.length }}
            </span>
          </a>
        </nav>
      </div>

      <!-- Sapaan Nama Siswa & Live Online di Header -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- Live Online Badge -->
        <div
          class="flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50/90 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur transition-all"
          title="Pengguna yang sedang online"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span class="text-[11px] sm:text-xs">
            {{ onlineCount }} <span class="hidden sm:inline"><i class="bi bi-person-fill"></i></span>
          </span>
        </div>

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

          <!-- Sapaan Nama & Kelas -->
          <div class="flex flex-col text-left text-xs leading-tight">
             <span class="max-w-[85px] truncate font-bold text-[#7F1D1D] sm:max-w-[110px] md:max-w-[150px]">
              {{ studentName }} 
            </span>
            <span class="text-[10px] text-stone-500 font-medium">
          {{ studentClass ? `${studentClass}` : '' }}
            </span>
           
          </div>

          <!-- Tombol Ubah Profil -->
          <button
            type="button"
            @click="openEditNameModal"
            title="Ubah profil siswa (nama & kelas)"
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

    <!-- Navigasi Mobile Bar Bawah (Hanya Icon Bersih, Lega & Modern di HP) -->
    <div class="flex sm:hidden border-t border-[#7F1D1D]/10 px-1.5 py-1.5 justify-around items-center bg-white/95 backdrop-blur shadow-md">
      <a
        v-for="l in links"
        :key="l.key"
        :href="l.to"
        :title="l.label"
        class="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95"
        :class="active === l.key
          ? 'bg-[#7F1D1D] text-amber-50 shadow-md shadow-[#7F1D1D]/25 scale-105'
          : 'text-stone-500 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D]'"
      >
        <i class="bi text-lg leading-none" :class="l.icon"></i>

        <!-- Badge jumlah bookmark di mobile icon -->
        <span
          v-if="l.isBookmark && bookmarks.length > 0"
          class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold shadow"
          :class="active === l.key ? 'bg-amber-300 text-amber-950' : 'bg-[#7F1D1D] text-white'"
        >
          {{ bookmarks.length }}
        </span>
      </a>
    </div>
  </header>
</template>
