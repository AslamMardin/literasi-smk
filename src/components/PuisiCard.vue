<script setup>
import { ref } from 'vue'

const props = defineProps({
  puisi: {
    type: Object,
    required: true
  },
  isLiked: Boolean,
  isOwner: Boolean,
  isAdmin: Boolean
})

const emit = defineEmits(['toggle-like', 'delete-puisi', 'edit-puisi'])

const copied = ref(false)

async function copyPuisi() {
  const authorInfo = props.puisi.kelas ? `${props.puisi.penulis} (${props.puisi.kelas})` : props.puisi.penulis
  const text = `"${props.puisi.judul}"\nKarya: ${authorInfo}\n\n${props.puisi.isi}\n\n— Dibagikan dari Literasi SMK Campalagian`

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error('Gagal menyalin puisi:', error)
  }
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
  <article class="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#e9e1d4] bg-[#fffdf8] p-5 shadow-[0_2px_12px_rgba(64,44,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(64,44,25,0.09)] sm:p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
       
        <time v-if="formatDate(puisi.createdAt)" class="mt-1.5 block text-[11px] font-medium text-stone-400">
          {{ formatDate(puisi.createdAt) }}
        </time>
      </div>
      <div class="flex items-center gap-1">
        <button
          v-if="isOwner"
          type="button"
          @click="emit('edit-puisi', puisi)"
          class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-amber-100 hover:text-amber-900"
          title="Edit puisi"
          aria-label="Edit puisi"
        >
          <i class="bi bi-pencil-square text-sm"></i>
        </button>
        <button
          v-if="isAdmin"
          type="button"
          @click="emit('delete-puisi', puisi)"
          class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600"
          title="Hapus puisi"
          aria-label="Hapus puisi"
        >
          <i class="bi bi-trash3 text-sm"></i>
        </button>
      </div>
    </div>

    <div class="mt-4 border-t border-[#eee6d9] pt-4">
      <h3 class="font-display text-xl font-semibold leading-snug text-[#49372d] transition-colors duration-300 group-hover:text-[#7F1D1D] sm:text-2xl">
        {{ puisi.judul }}
      </h3>
    </div>

    <div class="relative mt-3 flex min-h-[2rem] flex-1 flex-col border-y border-[#eee6d9] py-4">
      <span class="absolute -top-3 left-0 bg-[#fffdf8] pr-2 font-serif text-3xl leading-none text-[#b6a587]/60" aria-hidden="true">“</span>
      <p
        class="mt-1 whitespace-pre-line font-serif text-sm italic leading-7 text-stone-600"
        :class="puisi.kategori === 'Kalindaqdaq Mandar' ? 'text-center' : 'text-left'"
      >
        {{ puisi.isi }}
      </p>
      <span class="mt-auto self-end pt-2 font-serif text-3xl leading-none text-[#b6a587]/60" aria-hidden="true">”</span>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <div class="flex min-w-0 items-center gap-2.5">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee7d9] font-display text-xs font-semibold text-[#66543b]">
          {{ (puisi.penulis || 'S').charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-xs font-semibold text-stone-700" :title="puisi.penulis">{{ puisi.penulis }}</p>
          <p v-if="puisi.kelas" class="truncate text-[10px] text-stone-400" :title="puisi.kelas">
            Kelas: {{ puisi.kelas }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-4 border-t border-[#eee6d9] pt-3">
      <button
        type="button"
        @click="emit('toggle-like', puisi.id)"
        class="inline-flex items-center gap-1.5 text-xs text-stone-500 transition hover:text-[#7F1D1D]"
        :class="isLiked ? 'font-semibold text-[#8f3434]' : ''"
        :title="isLiked ? 'Batal memberi suka' : 'Sukai puisi ini'"
        :aria-label="`${isLiked ? 'Hapus suka' : 'Sukai'}: ${puisi.likes || 0}`"
      >
        <i class="bi text-sm" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'" aria-hidden="true"></i>
        <span>{{ puisi.likes || 0 }} suka</span>
      </button>
      <span class="text-[10px] text-stone-300" aria-hidden="true">•</span>
      <button
        type="button"
        @click="copyPuisi"
        class="inline-flex items-center gap-1.5 text-xs text-stone-500 transition hover:text-[#6d5937]"
        :title="copied ? 'Puisi tersalin' : 'Salin puisi'"
        :aria-label="copied ? 'Puisi tersalin' : 'Salin puisi'"
      >
        <i class="bi text-sm" :class="copied ? 'bi-check2 text-emerald-700' : 'bi-copy'" aria-hidden="true"></i>
        <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
      </button>
    </div>

  </article>
</template>
