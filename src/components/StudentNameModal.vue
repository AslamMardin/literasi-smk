<script setup>
import { ref, watch } from 'vue'
import { useLiterasi } from '../composables/useLiterasi'

const { studentName, showNameModal, setStudentName, closeNameModal, hasStudentName } = useLiterasi()

const inputName = ref(studentName.value || '')

// Sinkronkan input dengan studentName saat modal dibuka
watch(showNameModal, (open) => {
  if (open) {
    inputName.value = studentName.value || ''
  }
})

function handleSubmit() {
  const val = inputName.value.trim()
  if (!val) return
  setStudentName(val)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="showNameModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      @click.self="hasStudentName ? closeNameModal() : null"
    >
      <div
        class="w-full max-w-md overflow-hidden rounded-3xl border border-amber-900/20 bg-[#fffafa] shadow-2xl transition-all"
      >
        <!-- Header Modal -->
        <div class="relative bg-gradient-to-br from-[#7F1D1D] to-[#991b1b] p-6 sm:p-7 text-amber-50">
          <!-- Tombol Close jika sudah punya nama sebelumnya -->
          <button
            v-if="hasStudentName"
            type="button"
            @click="closeNameModal"
            class="absolute right-4 top-4 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="flex items-center gap-3.5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-3xl text-amber-950 shadow-md">
              <i class="bi bi-person-lines-fill"></i>
            </div>
            <div>
              <h3 class="font-display text-xl sm:text-2xl font-bold leading-tight">
                {{ hasStudentName ? 'Ubah Nama Siswa' : 'Selamat Datang!' }}
              </h3>
              <p class="text-xs text-amber-200/90 mt-1">
                {{ hasStudentName ? 'Perbarui nama panggilanmu' : 'Siapa nama lengkap atau panggilanmu?' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Body Form -->
        <div class="p-6 sm:p-7">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7F1D1D]/80 mb-2">
                Nama Siswa
              </label>
              <div class="relative">
                <input
                  v-model="inputName"
                  type="text"
                  placeholder="Contoh: Aslam Mardin"
                  autofocus
                  required
                  class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 pl-11 text-stone-800 placeholder-stone-400 shadow-sm focus:border-[#7F1D1D] focus:outline-none focus:ring-2 focus:ring-[#7F1D1D]/20 transition text-sm sm:text-base font-medium"
                />
                <span class="absolute left-4 top-3.5 text-stone-400">
                  <i class="bi bi-person-fill text-lg"></i>
                </span>
              </div>
             
            </div>

            <div class="pt-2 flex items-center gap-2">
              <button
                type="submit"
                :disabled="!inputName.trim()"
                class="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#7F1D1D] py-3.5 px-5 font-bold text-amber-50 shadow-lg shadow-[#7F1D1D]/25 transition hover:bg-[#681818] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>{{ hasStudentName ? 'Simpan Perubahan' : 'Mulai Membaca 🚀' }}</span>
              </button>

              <button
                v-if="hasStudentName"
                type="button"
                @click="closeNameModal"
                class="rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>
