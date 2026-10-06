<script setup>
import { ref, watch } from 'vue'
import { usePuisi } from '../composables/usePuisi'
import { useLiterasi } from '../composables/useLiterasi'

const props = defineProps({
  isOpen: Boolean,
  puisi: { type: Object, default: null }
})
const emit = defineEmits(['close', 'saved'])
const { editPuisi } = usePuisi()
const { studentName, studentNis } = useLiterasi()

const judul = ref('')
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

watch(() => [props.isOpen, props.puisi], ([isOpen, p]) => {
  if (isOpen && p) {
    judul.value = p.judul || ''
    kelas.value = p.kelas || ''
    kategori.value = p.kategori || 'Kalindaqdaq Mandar'
    isi.value = p.isi || ''
    errorMessage.value = ''
    successMessage.value = ''
  }
}, { immediate: true })

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!judul.value.trim()) { errorMessage.value = 'Silakan masukkan judul puisi.'; return }
  if (!isi.value.trim()) { errorMessage.value = 'Isi puisi tidak boleh kosong.'; return }
  isSubmitting.value = true
  try {
    await editPuisi(
      props.puisi.id,
      { judul: judul.value, kelas: kelas.value, kategori: kategori.value, isi: isi.value },
      { nis: studentNis.value, name: studentName.value }
    )
    successMessage.value = 'Puisi berhasil diperbarui!'
    emit('saved')
    setTimeout(() => { isSubmitting.value = false; emit('close') }, 1000)
  } catch (err) {
    errorMessage.value = err.message || 'Gagal memperbarui puisi. Coba lagi.'
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && puisi" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm" @click.self="emit('close')">
      <div class="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-fade-up">
        <div class="flex items-center justify-between border-b border-amber-900/10 bg-gradient-to-r from-[#3d1010] to-[#7F1D1D] px-6 py-4 text-amber-50">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-bold"><i class="bi bi-pencil-square text-sm"></i></span>
            <div>
              <h3 class="font-display text-base font-bold sm:text-lg">Edit Karya Puisi</h3>
              <p class="text-[11px] text-amber-200/80 truncate max-w-[220px]">"{{ puisi.judul }}"</p>
            </div>
          </div>
          <button type="button" @click="emit('close')" class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition"><i class="bi bi-x-lg text-sm"></i></button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div v-if="successMessage" class="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
            <i class="bi bi-check-circle-fill text-emerald-600 text-base"></i><span>{{ successMessage }}</span>
          </div>
          <div v-if="errorMessage" class="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800">
            <i class="bi bi-exclamation-triangle-fill text-red-600 text-base"></i><span>{{ errorMessage }}</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1.5">Judul Puisi <span class="text-red-500">*</span></label>
            <input v-model="judul" type="text" placeholder="Judul puisi..." class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10" required />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1.5">Kelas & Jurusan <span class="text-stone-400 font-normal">(Opsional)</span></label>
              <input v-model="kelas" type="text" placeholder="Contoh: X RPL 1 / XII TKJ" class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10" />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1.5">Kategori Karya Puisi</label>
              <select v-model="kategori" class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10">
                <option v-for="cat in kategoriOptions" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-stone-700">Isi Puisi / Bait <span class="text-red-500">*</span></label>
            </div>
            <textarea v-model="isi" rows="7" placeholder="Tuliskan bait puisi di sini..." class="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3.5 font-serif text-sm italic leading-relaxed text-stone-800 outline-none transition focus:border-[#7F1D1D] focus:bg-white focus:ring-2 focus:ring-[#7F1D1D]/10" required></textarea>
          </div>

          <div class="rounded-xl bg-stone-50 border border-stone-200/80 px-4 py-2.5 flex items-center gap-2 text-xs text-stone-500">
            <i class="bi bi-lock-fill text-stone-400"></i>
            <span>Nama penulis tidak dapat diubah: <strong class="text-stone-700">{{ puisi.penulis }}</strong></span>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button type="button" @click="emit('close')" class="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 rounded-xl bg-[#7F1D1D] px-6 py-2.5 text-xs font-bold text-amber-50 shadow-md shadow-[#7F1D1D]/20 transition hover:bg-[#631414] disabled:opacity-50">
              <i v-if="isSubmitting" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-floppy-fill"></i>
              <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-up { animation: modalFade 0.2s ease-out forwards; }
@keyframes modalFade {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
