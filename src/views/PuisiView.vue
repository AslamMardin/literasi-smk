<script setup>
import { ref, computed } from 'vue'
import { usePuisi } from '../composables/usePuisi'
import { useLiterasi } from '../composables/useLiterasi'
import PuisiCard from '../components/PuisiCard.vue'
import TulisPuisiModal from '../components/TulisPuisiModal.vue'
import EditPuisiModal from '../components/EditPuisiModal.vue'
import HeroBackground from '../components/HeroBackground.vue'
import PuisiCommentsModal from '../components/PuisiCommentsModal.vue'

const { puisiList, isLoading, toggleLike, hasLiked, hapusPuisi } = usePuisi()
const { studentName, studentNis, studentClass } = useLiterasi()

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const selectedPuisiForCommentsId = ref(null)
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const targetPuisiToEdit = ref(null)

// Status Admin: Khusus jika nama siswa adalah 'Aslam Mardin' (tidak sensitif huruf besar/kecil)
const isAdmin = computed(() => (studentName.value || '').trim().toLowerCase() === 'aslam mardin')

function isPuisiOwner(puisi) {
  const currentName = (studentName.value || '').trim().toLocaleLowerCase()
  const currentNis = (studentNis.value || '').trim()
  return Boolean(
    currentName &&
    currentName === (puisi.penulis || '').trim().toLocaleLowerCase() &&
    currentNis &&
    currentNis === String(puisi.pemilikNis || '').trim() &&
    (studentClass.value || '').trim()
  )
}

function openEditModal(puisi) {
  if (!isPuisiOwner(puisi) || puisi.id.startsWith('sample-')) return
  targetPuisiToEdit.value = puisi
  isEditModalOpen.value = true
}

// State Konfirmasi Hapus Puisi
const isDeleteModalOpen = ref(false)
const targetPuisiToDelete = ref(null)
const confirmPassword = ref('')
const deleteError = ref('')
const isDeleting = ref(false)

function openDeleteModal(puisi) {
  targetPuisiToDelete.value = puisi
  confirmPassword.value = ''
  deleteError.value = ''
  isDeleteModalOpen.value = true
}

async function handleConfirmDelete() {
  deleteError.value = ''

  if (confirmPassword.value.trim() !== '211099') {
    deleteError.value = 'Password konfirmasi salah! Anda tidak diizinkan menghapus.'
    return
  }

  isDeleting.value = true
  try {
    if (targetPuisiToDelete.value?.id) {
      await hapusPuisi(targetPuisiToDelete.value.id)
    }
    isDeleteModalOpen.value = false
    targetPuisiToDelete.value = null
  } catch (err) {
    deleteError.value = 'Gagal menghapus puisi dari database.'
  } finally {
    isDeleting.value = false
  }
}

const categories = [
  'Semua',
  '🔥 Terpopuler',
  'Kalindaqdaq Mandar',
  'Alam & Budaya Mandar',
  'Sekolah & Cita-Cita',
  'Persahabatan & Guru',
  'Bebas & Inspirasi'
]

const filteredPuisi = computed(() => {
  let list = [...puisiList.value]

  // Filter Terpopuler vs Kategori
  if (selectedCategory.value === '🔥 Terpopuler') {
    list = list.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  } else if (selectedCategory.value !== 'Semua') {
    list = list.filter((p) => p.kategori === selectedCategory.value)
  }

  // Filter Pencarian
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (p) =>
        p.judul?.toLowerCase().includes(q) ||
        p.penulis?.toLowerCase().includes(q) ||
        p.isi?.toLowerCase().includes(q) ||
        p.kategori?.toLowerCase().includes(q)
    )
  }

  return list
})

const selectedPuisiForComments = computed(() =>
  puisiList.value.find((puisi) => puisi.id === selectedPuisiForCommentsId.value) || null
)

function openComments(puisi) {
  selectedPuisiForCommentsId.value = puisi.id
}
</script>

<template>
  <div class="pb-24">
    <!-- Hero Header Banner -->
    <section class="relative overflow-hidden bg-[#1b0909] px-5 py-12 text-amber-50 sm:py-16 sm:px-6">
      <HeroBackground />
      <!-- Glow Blur Decor -->
      <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-red-400/10 blur-3xl"></div>

      <div class="relative z-10 mx-auto max-w-5xl text-center">
        

        <h1 class="font-display text-2xl font-bold tracking-tight sm:text-4xl">
          Karya Puisi & Kalindaqdaq Siswa
        </h1>
        <p class="mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm text-stone-300 leading-relaxed">
          Ruang berekspresi, menulis puisi, melestarikan sastra lisan Mandar, dan mengapresiasi karya sesama siswa SMKN Campalagian.
        </p>

        <!-- CTA Tulis Puisi & Search Bar -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          <button
            type="button"
            @click="isModalOpen = true"
            class="hidden sm:flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold text-amber-950 shadow-xl shadow-amber-950/20 transition-all hover:bg-amber-300 hover:scale-105 active:scale-95"
          >
            <i class="bi bi-pencil-square text-base"></i>
            <span>Tulis Puisi Sekarang</span>
          </button>

          <!-- Input Search -->
          <div class="relative flex flex-1 w-full items-center overflow-hidden rounded-2xl bg-white p-1 shadow-2xl">
            <span class="pl-3 text-stone-400">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari judul, penulis, bait puisi..."
              class="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#3d1010] outline-none placeholder:text-stone-400"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-400 hover:text-stone-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <main class="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
      <!-- Filter Tabs Kategori -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedCategory = cat"
          class="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-sm"
          :class="selectedCategory === cat
            ? 'bg-[#7F1D1D] text-amber-50 shadow-md ring-2 ring-[#7F1D1D]/30'
            : 'bg-white text-stone-600 hover:bg-[#7F1D1D]/10 hover:text-[#7F1D1D]'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Info Hitungan & Status -->
      <div class="mt-4 flex items-center justify-between text-xs text-stone-500 bg-red">
  <div>
    <span>
      Total
      <strong class="text-[#7F1D1D]">{{ filteredPuisi.length }}</strong>
      karya puisi
    </span>
  </div>

  <a
    type="button"
    @click="isModalOpen = true"
    class="text-[#7F1D1D] text-xs font-bold lg:hidden"
  >
    <i class="bi bi-pencil-square pr-1"></i>
    <span>Tulis Puisi</span>
  </a>
</div>

     

      <!-- Loading State -->
      <div v-if="isLoading" class="py-16 text-center text-stone-500">
        <i class="bi bi-arrow-repeat inline-block animate-spin text-3xl text-[#7F1D1D] mb-2"></i>
        <p class="text-xs">Memuat karya sastra siswa...</p>
      </div>

      <!-- Grid Kartu Puisi -->
      <template v-else-if="filteredPuisi.length > 0">
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PuisiCard
            v-for="p in filteredPuisi"
            :key="p.id"
            :puisi="p"
            :is-liked="hasLiked(p.id)"
            :is-owner="isPuisiOwner(p) && !p.id.startsWith('sample-')"
            :is-admin="isAdmin"
            @toggle-like="toggleLike"
            @edit-puisi="openEditModal"
            @delete-puisi="openDeleteModal"
            @open-comments="openComments"
          />
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="mt-12 flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200/60">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-3">
          <i class="bi bi-journal-richtext text-3xl"></i>
        </div>
        <h3 class="font-display text-base font-bold text-stone-800">
          Belum Ada Puisi yang Cocok
        </h3>
        <p class="mt-1 text-xs text-stone-500 max-w-sm">
          {{ searchQuery ? `Tidak ditemukan puisi dengan kata kunci "${searchQuery}".` : 'Jadilah siswa pertama yang menerbitkan puisi di kategori ini!' }}
        </p>
        <button
          type="button"
          @click="isModalOpen = true"
          class="mt-4 hidden sm:flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-5 py-2.5 text-xs font-bold text-amber-50 shadow transition hover:bg-[#661616]"
        >
          <i class="bi bi-pencil-fill"></i>
          <span>Tulis Puisi Sekarang</span>
        </button>
      </div>
    </main>

    <!-- Modal Tulis Puisi -->
    <TulisPuisiModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />

    <EditPuisiModal
      :is-open="isEditModalOpen"
      :puisi="targetPuisiToEdit"
      @close="isEditModalOpen = false"
    />

    <PuisiCommentsModal
      :is-open="!!selectedPuisiForComments"
      :puisi="selectedPuisiForComments"
      @close="selectedPuisiForCommentsId = null"
    />

    <!-- Modal Konfirmasi Hapus Puisi (Khusus Aslam Mardin) -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen && targetPuisiToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-fade-up">
          <div class="flex items-center gap-3 text-red-600 mb-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100">
              <i class="bi bi-shield-lock-fill text-xl"></i>
            </div>
            <div>
              <h3 class="font-display text-base font-bold text-stone-900">
                Konfirmasi Hapus Puisi
              </h3>
              <p class="text-[11px] text-stone-500">
                Otoritas Pengelola (Aslam Mardin)
              </p>
            </div>
          </div>

          <div class="my-3 rounded-2xl bg-stone-50 p-3.5 border border-stone-200/80 text-xs">
            <p class="text-stone-500">Anda akan menghapus karya:</p>
            <p class="font-bold text-[#7F1D1D] mt-0.5 text-sm">"{{ targetPuisiToDelete.judul }}"</p>
            <p class="text-stone-600 mt-1">Penulis: <span class="font-semibold">{{ targetPuisiToDelete.penulis }}</span></p>
          </div>

          <form @submit.prevent="handleConfirmDelete" class="space-y-3 mt-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Masukkan Password Konfirmasi
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Masukkan PIN Admin..."
                class="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                required
                autofocus
              />
            </div>

            <!-- Pesan Error -->
            <p v-if="deleteError" class="text-xs font-semibold text-red-600 flex items-center gap-1">
              <i class="bi bi-exclamation-circle-fill"></i>
              <span>{{ deleteError }}</span>
            </p>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                @click="isDeleteModalOpen = false"
                class="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                :disabled="isDeleting"
                class="flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
              >
                <i v-if="isDeleting" class="bi bi-arrow-repeat animate-spin"></i>
                <i v-else class="bi bi-trash3-fill"></i>
                <span>{{ isDeleting ? 'Menghapus...' : 'Hapus Sekarang' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-fade-up {
  animation: modalFade 0.2s ease-out forwards;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
