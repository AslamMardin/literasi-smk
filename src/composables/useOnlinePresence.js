import { ref } from 'vue'
import { rtdb } from '../services/firebase'
import {
  ref as dbRef,
  onValue,
  set,
  onDisconnect,
  serverTimestamp
} from 'firebase/database'

const onlineCount = ref(1)
const isOnlineActive = ref(false)
let isInitialized = false

// Dapatkan atau buat session ID unik per tab / session browser
function getSessionId() {
  let id = sessionStorage.getItem('literasi_session_id')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36)
    sessionStorage.setItem('literasi_session_id', id)
  }
  return id
}

export function useOnlinePresence() {
  if (!isInitialized && typeof window !== 'undefined') {
    isInitialized = true

    try {
      const sessionId = getSessionId()
      const userStatusRef = dbRef(rtdb, `online_users/${sessionId}`)
      const connectedRef = dbRef(rtdb, '.info/connected')
      const allOnlineRef = dbRef(rtdb, 'online_users')

      // Pantau status koneksi dengan Firebase Realtime Database
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          isOnlineActive.value = true

          // Ketika koneksi terputus/tab ditutup, otomatis hapus dari database
          onDisconnect(userStatusRef)
            .remove()
            .then(() => {
              // Tandai user sedang online
              set(userStatusRef, {
                status: 'online',
                timestamp: serverTimestamp()
              })
            })
            .catch((err) => {
              console.warn('Firebase onDisconnect setup warning:', err)
            })
        } else {
          isOnlineActive.value = false
        }
      })

      // Dengarkan perubahan total pengunjung yang online secara real-time
      onValue(allOnlineRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          onlineCount.value = Object.keys(data).length
        } else {
          onlineCount.value = 1
        }
      }, (error) => {
        console.warn('Gagal membaca data online_users:', error)
      })
    } catch (err) {
      console.warn('Firebase presence initialization failed:', err)
    }
  }

  return {
    onlineCount,
    isOnlineActive
  }
}
