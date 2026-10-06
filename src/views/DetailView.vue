<script setup>
import { computed } from 'vue'
import BookCover from '../components/BookCover.vue'
import EbookSection from '../components/EbookSection.vue'
import { ebooks, getEbookById } from '../data/ebooks'
import { useLiterasi } from '../composables/useLiterasi'

const props = defineProps({ id: String })
const ebook = computed(() => getEbookById(props.id))
const serupa = computed(() =>
  ebooks.filter((e) => e.kategori === ebook.value?.kategori && e.id !== props.id).slice(0, 4)
)

const { isBookmarked, toggleBookmark } = useLiterasi()
</script>

<template>
  <div v-if="ebook">
    <div class="mx-auto max-w-5xl px-5 pt-8 sm:px-6">
      <a href="#/koleksi" class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#7F1D1D] transition hover:bg-[#7F1D1D]/10">
        ← Koleksi
      </a>

      <div class="mt-4 grid items-center gap-8 rounded-3xl bg-white p-6 shadow-xl shadow-[#7F1D1D]/10 ring-1 ring-[#7F1D1D]/5 sm:p-8 md:grid-cols-[260px_1fr] md:gap-12">
        <div class="relative mx-auto w-48 overflow-hidden rounded-xl shadow-2xl shadow-[#7F1D1D]/30 ring-1 ring-black/10 md:w-full">
          <BookCover :ebook="ebook" />
        </div>

        <div class="animate-fade-up text-center md:text-left">
          <span class="inline-block rounded-full bg-[#f8eaea] px-4 py-1 text-xs font-semibold text-[#7F1D1D]">
            {{ ebook.kategori }}
          </span>
          <h1 class="font-display mt-4 text-3xl font-bold leading-tight text-[#4a1d1d] sm:text-4xl">
            {{ ebook.judul }}
          </h1>
          <p class="mt-2 text-lg text-stone-500"><i class="bi bi-person-fill"></i> {{ ebook.penulis }}</p>

          <div class="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium text-[#4a1d1d] md:justify-start">
            <span class="rounded-full bg-[#7F1D1D] text-white px-3 py-1.5 ring-1 ring-[#7F1D1D]/10">PDF</span>
          </div>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              :href="`#/baca/${encodeURIComponent(ebook.id)}`"
              class="animate-read-cta inline-flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-9 py-4 font-semibold text-amber-50 shadow-lg shadow-[#7F1D1D]/30 transition hover:-translate-y-0.5 hover:bg-[#5b1717]"
            >
              <i class="bi bi-book-half"></i>
              <span>Baca Ebook</span>
            </a>

            <!-- Tombol Bookmark -->
            <button
              type="button"
              @click="toggleBookmark(ebook.id)"
              class="inline-flex items-center gap-2 rounded-xl border px-6 py-4 font-semibold transition hover:-translate-y-0.5"
              :class="
                isBookmarked(ebook.id)
                  ? 'border-amber-400 bg-amber-50 text-[#7F1D1D] shadow-sm'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#7F1D1D] hover:text-[#7F1D1D]'
              "
            >
              <i
                class="bi text-base"
                :class="isBookmarked(ebook.id) ? 'bi-bookmark-fill text-amber-600' : 'bi-bookmark'"
              ></i>
              <span>{{ isBookmarked(ebook.id) ? 'Tersimpan di Bookmark' : 'Simpan Bookmark' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <EbookSection v-if="serupa.length" title="Ebook Serupa" :ebooks="serupa" />
  </div>

  <div v-else class="mx-auto max-w-xl px-5 py-24 text-center">
    <p class="text-5xl">📚</p>
    <h1 class="font-display mt-4 text-2xl font-bold text-[#4a1d1d]">Ebook tidak ditemukan</h1>
    <a href="#/koleksi" class="mt-6 inline-block rounded-xl bg-[#7F1D1D] px-6 py-3 font-semibold text-amber-50">Kembali ke Koleksi</a>
  </div>
</template>

<style scoped>
@keyframes read-cta-wiggle {
  0%, 84%, 100% { translate: 0 0; }
  86%, 90%, 94%, 98% { translate: -3px 0; }
  88%, 92%, 96% { translate: 3px 0; }
}

.animate-read-cta {
  animation: read-cta-wiggle 1s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-read-cta {
    animation: none;
  }
}
</style>
