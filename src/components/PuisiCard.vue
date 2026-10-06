<script setup>
import { ref } from 'vue'

const props = defineProps({
  puisi: {
    type: Object,
    required: true
  },
  isLiked: Boolean,
  isAdmin: Boolean
})

const emit = defineEmits(['toggle-like', 'delete-puisi'])

const copied = ref(false)

function copyPuisi() {
  const authorInfo = props.puisi.kelas ? `${props.puisi.penulis} (${props.puisi.kelas})` : props.puisi.penulis
  const text = `"${props.puisi.judul}"\nKarya: ${authorInfo}\n\n${props.puisi.isi}\n\n— Dibagikan dari Literasi SMK Campalagian`
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-900/10 bg-[#fffdf9] p-5 sm:p-6 shadow-sm shadow-amber-950/5 ring-1 ring-[#7F1D1D]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7F1D1D]/10">
    <!-- Top Decorative Gradient Line -->
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-[#7F1D1D] to-amber-600 opacity-80"></div>

    <div>
      <!-- Header Kartu: Kategori & Tanggal -->
      <div class="flex items-center justify-between gap-2 border-b border-amber-900/5 pb-3">
        <span
          class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          :class="puisi.kategori === 'Kalindaqdaq Mandar'
            ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
            : 'bg-[#7F1D1D]/10 text-[#7F1D1D]'"
        >
          <i v-if="puisi.kategori === 'Kalindaqdaq Mandar'" class="bi bi-feather"></i>
          <i v-else class="bi bi-tag-fill text-[9px]"></i>
          <span>{{ puisi.kategori }}</span>
        </span>

        <div class="flex items-center gap-2">
          <span class="text-[11px] text-stone-400 font-medium">
            {{ formatDate(puisi.createdAt) }}
          </span>

          <!-- Tombol Hapus Khusus Admin (Aslam Mardin) -->
          <button
            v-if="isAdmin"
            type="button"
            @click="emit('delete-puisi', puisi)"
            class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
            title="Hapus Puisi Ini (Admin)"
          >
            <i class="bi bi-trash3 text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Judul Puisi -->
      <h3 class="mt-4 font-display text-lg sm:text-xl font-bold leading-snug text-[#4a1313] transition group-hover:text-[#7F1D1D]">
        {{ puisi.judul }}
      </h3>

      <!-- Penulis Sastra & Kelas -->
      <div class="mt-3 flex items-center justify-between gap-2 flex-wrap border-t border-amber-900/5 pt-2.5">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#7F1D1D] text-xs font-bold text-amber-100 shadow-sm">
            {{ (puisi.penulis || 'S').charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col text-left">
            <span class="text-xs font-bold text-stone-800">
              {{ puisi.penulis }}
            </span>
            <span v-if="puisi.kelas" class="text-[11px] font-semibold text-[#7F1D1D]">
              {{ puisi.kelas }}
            </span>
          </div>
        </div>

        <!-- Badge Kelas Siswa -->
        <span
          v-if="puisi.kelas"
          class="rounded-lg bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 text-[10px] font-bold text-amber-950"
        >
          <i class="bi bi-mortarboard-fill mr-1 text-amber-800"></i>{{ puisi.kelas }}
        </span>
      </div>

      <!-- Isi Puisi (Bait demi Bait) -->
      <div class="relative my-4 rounded-xl bg-amber-50/50 p-4 border border-amber-200/40">
        <p class="whitespace-pre-line font-serif text-sm leading-relaxed text-stone-800 italic">
          {{ puisi.isi }}
        </p>
      </div>
    </div>

    <!-- Footer Kartu: Tombol Apresiasi (Like) & Bagikan -->
    <div class="mt-2 flex items-center justify-between border-t border-amber-900/5 pt-3">
      <!-- Tombol Apresiasi (Love) -->
      <button
        type="button"
        @click="emit('toggle-like', puisi.id)"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
        :class="isLiked
          ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
          : 'bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600'"
        :title="isLiked ? 'Batal apresiasi' : 'Beri apresiasi (Suka)'"
      >
        <i
          class="bi text-sm transition-transform duration-200"
          :class="isLiked ? 'bi-heart-fill text-red-500 scale-110 animate-pulse' : 'bi-heart'"
        ></i>
        <span>{{ puisi.likes || 0 }}</span>
      </button>

      <!-- Tombol Salin / Bagikan -->
      <button
        type="button"
        @click="copyPuisi"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D] transition"
        :title="'Salin teks puisi'"
      >
        <i class="bi" :class="copied ? 'bi-check-lg text-emerald-600' : 'bi-share-fill text-[11px]'"></i>
        <span :class="copied ? 'font-bold text-emerald-600' : ''">
          {{ copied ? 'Tersalin!' : 'Bagikan' }}
        </span>
      </button>
    </div>
  </div>
</template>
