<script setup>
import { computed, ref, watch } from 'vue'
import { useLiterasi } from '../composables/useLiterasi'
import { usePuisi } from '../composables/usePuisi'

const props = defineProps({
  isOpen: Boolean,
  puisi: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const { studentName, studentClass } = useLiterasi()
const { tambahKomentar } = usePuisi()
const commentText = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const comments = computed(() =>
  [...(props.puisi?.comments || [])].sort((a, b) => b.createdAt - a.createdAt)
)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    commentText.value = ''
    errorMessage.value = ''
  }
})

async function submitComment() {
  errorMessage.value = ''
  if (!studentName.value.trim()) {
    errorMessage.value = 'Lengkapi nama profil siswa sebelum mengirim komentar.'
    return
  }
  if (!commentText.value.trim()) {
    errorMessage.value = 'Komentar tidak boleh kosong.'
    return
  }

  isSubmitting.value = true
  try {
    await tambahKomentar(props.puisi.id, commentText.value, {
      nama: studentName.value,
      kelas: studentClass.value
    })
    commentText.value = ''
  } catch (error) {
    errorMessage.value = error.message || 'Komentar gagal dikirim. Coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

function formatCommentDate(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && puisi"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <section class="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#fffdf8] shadow-2xl">
        <header class="flex items-start justify-between gap-4 bg-gradient-to-r from-[#3d1010] to-[#7F1D1D] px-5 py-4 text-amber-50">
          <div class="min-w-0">
            <h2 class="font-display text-lg font-bold">Komentar ({{ comments.length }})</h2>
            <p class="mt-1 truncate text-xs text-amber-100/80">{{ puisi.judul }}</p>
          </div>
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20"
            aria-label="Tutup komentar"
            @click="emit('close')"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <div class="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          <p v-if="comments.length === 0" class="py-6 text-center text-sm text-stone-500">
            Belum ada komentar. Jadilah yang pertama berkomentar.
          </p>
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="rounded-2xl border border-stone-200/80 bg-white p-3.5"
          >
            <div class="flex items-baseline justify-between gap-3">
              <div class="min-w-0">
                <span class="text-xs font-bold text-stone-800">{{ comment.nama }}</span>
                <span v-if="comment.kelas" class="ml-1.5 text-[10px] text-stone-400">{{ comment.kelas }}</span>
              </div>
              <time class="shrink-0 text-[10px] text-stone-400">{{ formatCommentDate(comment.createdAt) }}</time>
            </div>
            <p class="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-stone-600">{{ comment.isi }}</p>
          </article>
        </div>

        <form class="border-t border-stone-200 p-5" @submit.prevent="submitComment">
          <label for="puisi-comment" class="mb-2 block text-xs font-semibold text-stone-700">
            Tulis komentar sebagai {{ studentName || 'siswa' }}
          </label>
          <textarea
            id="puisi-comment"
            v-model="commentText"
            rows="3"
            maxlength="500"
            placeholder="Tulis komentar..."
            class="w-full resize-none rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/10"
          ></textarea>
          <p v-if="errorMessage" role="alert" class="mt-2 text-xs font-medium text-red-600">{{ errorMessage }}</p>
          <div class="mt-3 flex items-center justify-between gap-3">
            <span class="text-[10px] text-stone-400">{{ commentText.length }}/500</span>
            <button
              type="submit"
              :disabled="isSubmitting || !commentText.trim()"
              class="inline-flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#661616] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <i v-if="isSubmitting" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-send-fill"></i>
              <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim komentar' }}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>
