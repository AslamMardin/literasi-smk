import { computed, ref } from 'vue'
import { onValue, ref as databaseRef, runTransaction } from 'firebase/database'
import { rtdb } from '../services/firebase'

const READING_STATS_PATH = 'statistik_waktu_baca'
const SCHOOL_TIME_ZONE = 'Asia/Makassar'
const readingStats = ref({})
const isLoading = ref(true)
const error = ref('')
const currentWeekKey = ref(getWeekKey())
let listenerStarted = false
let weekClockStarted = false

function getWeekKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHOOL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const localDate = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day))
  const daysFromMonday = (new Date(localDate).getUTCDay() + 6) % 7

  return new Date(localDate - daysFromMonday * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function getStudentKey(nis) {
  return encodeURIComponent(nis).replace(/\./g, '%2E')
}

function sortStudents(entries, secondsField) {
  return Object.entries(entries)
    .map(([nis, stats]) => ({ ...stats, nis, seconds: Number(stats?.[secondsField]) }))
    .filter(({ name, seconds }) => typeof name === 'string' && name.trim() && Number.isSafeInteger(seconds) && seconds > 0)
    .sort((a, b) => b.seconds - a.seconds || a.name.localeCompare(b.name, 'id'))
    .slice(0, 5)
}

export async function recordReadingSeconds({ nis, name, kelas }, seconds) {
  const cleanNis = String(nis || '').trim()
  const cleanName = String(name || '').trim()
  const cleanClass = String(kelas || '').trim()
  if (!cleanNis || !cleanName || !cleanClass) {
    throw new Error('Identitas siswa belum lengkap; waktu baca tidak dapat disimpan.')
  }
  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new Error(`Durasi waktu baca tidak valid: ${seconds}`)
  }

  const studentRef = databaseRef(rtdb, `${READING_STATS_PATH}/${getStudentKey(cleanNis)}`)
  const weekKey = getWeekKey()
  const result = await runTransaction(studentRef, (current) => {
    const previous = current && typeof current === 'object' ? current : {}
    const totalSeconds = Number(previous.totalSeconds)
    const weekSeconds = Number(previous.weekSeconds)

    return {
      name: cleanName,
      kelas: cleanClass,
      totalSeconds: (Number.isSafeInteger(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0) + seconds,
      weekKey,
      weekSeconds:
        previous.weekKey === weekKey && Number.isSafeInteger(weekSeconds) && weekSeconds > 0
          ? weekSeconds + seconds
          : seconds,
    }
  })

  if (!result.committed) {
    throw new Error(`Firebase tidak menyimpan waktu baca siswa dengan NIS ${cleanNis}.`)
  }
}

export function useReadingStats() {
  if (!weekClockStarted && typeof window !== 'undefined') {
    weekClockStarted = true
    window.setInterval(() => {
      currentWeekKey.value = getWeekKey()
    }, 60 * 1000)
  }

  if (!listenerStarted && typeof window !== 'undefined') {
    listenerStarted = true
    onValue(
      databaseRef(rtdb, READING_STATS_PATH),
      (snapshot) => {
        const value = snapshot.val()
        readingStats.value = value && typeof value === 'object' ? value : {}
        error.value = ''
        isLoading.value = false
      },
      (listenerError) => {
        console.error('Gagal membaca peringkat waktu baca:', listenerError)
        error.value = 'Peringkat waktu baca tidak dapat dimuat.'
        isLoading.value = false
      }
    )
  }

  const topGlobal = computed(() => sortStudents(readingStats.value, 'totalSeconds'))
  const rajinMingguIni = computed(() => {
    const thisWeek = Object.fromEntries(
      Object.entries(readingStats.value).filter(([, stats]) => stats?.weekKey === currentWeekKey.value)
    )
    return sortStudents(thisWeek, 'weekSeconds')
  })

  return {
    topGlobal,
    rajinMingguIni,
    isLoading,
    error,
  }
}
