import { recordReadingSeconds } from './useReadingStats'

const SAVE_INTERVAL_MS = 3 * 60 * 1000
const TIMER_TICK_MS = 1000
const RETRY_DELAY_MS = 30 * 1000

export function startReadingTimer(profile) {
  let pendingMilliseconds = 0
  let lastActiveAt = document.visibilityState === 'visible' ? performance.now() : null
  let inFlight = false
  let stopped = false
  let nextRetryAt = 0
  let flushRequested = false

  function accrueActiveTime(now = performance.now()) {
    if (lastActiveAt === null) return
    pendingMilliseconds += Math.max(0, now - lastActiveAt)
    lastActiveAt = now
  }

  async function flush(force = false) {
    if (inFlight) {
      flushRequested = flushRequested || force
      return
    }
    if (stopped && !force) return

    const seconds = Math.floor(pendingMilliseconds / 1000)
    if (seconds <= 0 || (!force && (pendingMilliseconds < SAVE_INTERVAL_MS || Date.now() < nextRetryAt))) {
      return
    }

    inFlight = true
    try {
      await recordReadingSeconds(profile, seconds)
      pendingMilliseconds -= seconds * 1000
      nextRetryAt = 0
    } catch (error) {
      nextRetryAt = Date.now() + RETRY_DELAY_MS
      console.error('Gagal menyimpan durasi membaca. Waktu akan dicoba kembali:', error)
    } finally {
      inFlight = false
      if (flushRequested) {
        flushRequested = false
        void flush(true)
      }
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      accrueActiveTime()
      lastActiveAt = null
      void flush()
    } else if (!stopped) {
      lastActiveAt = performance.now()
    }
  }

  function onPageHide() {
    accrueActiveTime()
    lastActiveAt = null
    void flush(true)
  }

  function onPageShow() {
    if (!stopped && document.visibilityState === 'visible') {
      lastActiveAt = performance.now()
    }
  }

  const timer = window.setInterval(() => {
    accrueActiveTime()
    void flush()
  }, TIMER_TICK_MS)

  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', onPageHide)
  window.addEventListener('pageshow', onPageShow)

  return function stopReadingTimer() {
    if (stopped) return
    accrueActiveTime()
    lastActiveAt = null
    stopped = true
    window.clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pagehide', onPageHide)
    window.removeEventListener('pageshow', onPageShow)
    void flush(true)
  }
}
