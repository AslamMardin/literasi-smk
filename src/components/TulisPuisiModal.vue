<script setup>
import { ref, watch } from 'vue'
import { useLiterasi } from '../composables/useLiterasi'
import { usePuisi } from '../composables/usePuisi'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'published'])

const { studentName, setStudentName } = useLiterasi()
const { tambahPuisi } = usePuisi()

const judul = ref('')
const penulis = ref(studentName.value || '')
const kelas = ref('')
const kategori = ref('Kalindaqdaq Mandar')
const isi = ref('')

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const kategoriOptions = [
  'Kalindaqdaq Mandar',
  'Alam & Budaya Mandar',
  'Sekolah & Cita-Cita',
  'Persahabatan & Guru',
  'Bebas & Inspirasi'
]

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      if (!penulis.value && studentName.value) {
        penulis.value = studentName.value
      }
      errorMessage.value = ''
      successMessage.value = ''
    }
  }
)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!judul.value.trim()) {
    errorMessage.value = 'Silakan masukkan judul puisi.'
    return
  }

  if (!penulis.value.trim()) {
    errorMessage.value = 'Nama penulis tidak boleh kosong.'
    return
  }

  if (!isi.value.trim()) {
    errorMessage.value = 'Isi puisi tidak boleh kosong.'
    return
  }

  isSubmitting.value = true

  try {
    // Simpan juga nama penulis ke setting nama siswa jika belum ada
    if (!studentName.value) {
      setStudentName(penulis.value.trim())
    }

    await tambahPuisi({
      judul: judul.value,
      penulis: penulis.value,
      kelas: kelas.value,
      kategori: kategori.value,
      isi: isi.value
    })

    successMessage.value = 'Puisi berhasil diterbitkan!'
    emit('published')

    // Reset form setelah 1 detik lalu tutup
    setTimeout(() => {
      judul.value = ''
      kelas.value = ''
      isi.value = ''
      isSubmitting.value = false
      emit('close')
    }, 1200)
  } catch (err) {
    errorMessage.value = err.message || 'Gagal menerbitkan puisi. Coba lagi.'
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-fade-up">
        <!-- Header Modal -->
        <div class="flex items-center justify-between border-b border-amber-900/10 bg-gradient-to-r from-[#3d1010] to-[#7F1D1D] px-6 py-4 text-amber-50">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-bold">
              <i class="bi bi-pen-fill text-sm"></i>
            </span>
            <div>
              <h3 class="font-display text-base font-bold sm:text-lg">
                Tulis Karya Puisi
              </h3>
              <p class="text-[11px] text-amber-200/80">
                Bagikan karya literasi atau Kalindaqdaq Anda untuk dibaca siswa lain
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="emit('close')"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition"
          >
            <i class="bi bi-x-lg text-sm"></i>
          </button>
        </div>

        <!-- Body Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <!-- Alert Success -->
          <div
            v-if="successMessage"
            class="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-pulse"
          >
            <i class="bi bi-check-circle-fill text-emerald-600 text-base"></i>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Alert Error -->
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800"
          >
            <i class="bi bi-exclamation-triangle-fill text-red-600 text-base"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Input Judul -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1.5">
              Judul Puisi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="judul"
              type="text"
              placeholder="Contoh: Senja di Tanah Mandar"
              class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10"
              required
            />
          </div>

          <!-- Input Penulis, Kelas, & Kategori -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1.5">
                Nama Siswa / Penulis <span class="text-red-500">*</span>
              </label>
              <input
                v-model="penulis"
                type="text"
                placeholder="Contoh: Ahmad Fauzi"
                class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1.5">
                Kelas & Jurusan <span class="text-stone-400 font-normal">(Opsional)</span>
              </label>
              <input
                v-model="kelas"
                type="text"
                placeholder="Contoh: X TKJ 1 / XII RPL"
                class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1.5">
              Kategori Karya Puisi
            </label>
            <select
              v-model="kategori"
              class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10"
            >
              <option v-for="cat in kategoriOptions" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Input Isi Puisi -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-stone-700">
                Isi Puisi / Bait <span class="text-red-500">*</span>
              </label>
              <span v-if="kategori === 'Kalindaqdaq Mandar'" class="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">
                Format Kalindaqdaq: 4 Baris (8-7-8-7)
              </span>
            </div>
            <textarea
              v-model="isi"
              rows="6"
              placeholder="Tuliskan bait puisi di sini...&#10;Baris 1&#10;Baris 2&#10;Baris 3..."
              class="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 font-serif text-sm italic leading-relaxed text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10"
              required
            ></textarea>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              @click="emit('close')"
              class="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-6 py-2.5 text-xs font-bold text-amber-50 shadow-md shadow-[#7F1D1D]/20 transition hover:bg-[#631414] disabled:opacity-50"
            >
              <i v-if="isSubmitting" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-send-fill"></i>
              <span>{{ isSubmitting ? 'Menerbitkan...' : 'Terbitkan Puisi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
