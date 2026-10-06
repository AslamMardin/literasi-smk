import { videos } from './videos-data.js'

export { videos }

/**
 * Helper untuk mem-parsing URL YouTube (Video, Playlist, Shorts, atau YouTu.be)
 */
export function parseYouTubeUrl(url, customThumbnail = '') {
  if (!url) return { type: 'unknown', embedUrl: '', directUrl: '', thumbnail: '' }

  const trimmed = url.trim()
  let videoId = null
  let playlistId = null

  // Cek apakah ada parameter playlist (list=...)
  const playlistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  if (playlistMatch && playlistMatch[1]) {
    playlistId = playlistMatch[1]
  }

  // Cek pola video ID (watch?v=, youtu.be/, shorts/, embed/)
  const videoMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  )
  if (videoMatch && videoMatch[1]) {
    videoId = videoMatch[1]
  }

  // Tentukan tipe & URL embed
  if (playlistId && !videoId) {
    return {
      type: 'playlist',
      playlistId,
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`,
      directUrl: trimmed.startsWith('http') ? trimmed : `https://www.youtube.com/playlist?list=${playlistId}`,
      thumbnail: customThumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80`
    }
  }

  if (videoId) {
    let embed = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    if (playlistId) {
      embed += `&list=${playlistId}`
    }
    return {
      type: playlistId ? 'playlist_video' : 'video',
      videoId,
      playlistId,
      embedUrl: embed,
      directUrl: trimmed.startsWith('http') ? trimmed : `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: customThumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }
  }

  return {
    type: 'custom',
    embedUrl: trimmed,
    directUrl: trimmed,
    thumbnail: customThumbnail || `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80`
  }
}

/**
 * Daftar Kategori Video Unik yang Dihasilkan Otomatis dari Data
 */
export const getVideoCategories = () => {
  const categories = [...new Set(videos.map((v) => v.kategori).filter(Boolean))].sort()
  return ['Semua', ...categories]
}

export const videoCategories = getVideoCategories()

export const getVideoById = (id) => videos.find((v) => v.id === id)
export const getTotalVideos = () => videos.length
