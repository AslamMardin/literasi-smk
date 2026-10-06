<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HomeView from './views/HomeView.vue'
import KoleksiView from './views/KoleksiView.vue'
import TentangView from './views/TentangView.vue'
import DetailView from './views/DetailView.vue'
import ReaderView from './views/ReaderView.vue'
import BookmarkView from './views/BookmarkView.vue'
import StudentNameModal from './components/StudentNameModal.vue'

const hash = ref(window.location.hash)
const onHash = () => (hash.value = window.location.hash)
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

// Halaman: beranda (#/), koleksi, bookmark, tentang, buku/ID (detail), baca/ID (reader)
const route = computed(() => {
  const [name, ...rest] = hash.value.replace(/^#\/?/, '').split('/')
  const id = decodeURIComponent(rest.join('/'))
  if (name === 'buku' && id) return { name: 'detail', id }
  if (name === 'baca' && id) return { name: 'reader', id }
  if (name === 'koleksi') return { name: 'koleksi' }
  if (name === 'bookmark') return { name: 'bookmark' }
  if (name === 'tentang') return { name: 'tentang' }
  return { name: 'home' }
})

const active = computed(() =>
  ['detail', 'reader'].includes(route.value.name) ? 'koleksi' : route.value.name
)

watch(route, () => window.scrollTo(0, 0))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#f8f1f1]">
    <AppHeader :active="active" />
    <main class="flex-1">
      <HomeView v-if="route.name === 'home'" />
      <KoleksiView v-else-if="route.name === 'koleksi'" />
      <BookmarkView v-else-if="route.name === 'bookmark'" />
      <TentangView v-else-if="route.name === 'tentang'" />
      <DetailView v-else-if="route.name === 'detail'" :key="route.id" :id="route.id" />
      <ReaderView v-else-if="route.name === 'reader'" :key="route.id" :id="route.id" />
    </main>
    <AppFooter v-if="route.name !== 'reader'" />

    <!-- Popup Meminta Nama Siswa Otomatis saat Pertama Buka -->
    <StudentNameModal />
  </div>
</template>
