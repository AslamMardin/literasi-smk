// State pencarian bersama (agar tidak hilang saat pindah halaman)
import { reactive } from 'vue'
export const filter = reactive({ query: '', kategori: '' })
