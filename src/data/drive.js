// Ambil File ID dari URL Google Drive (atau kembalikan apa adanya jika sudah berupa ID)
export function getFileId(input = '') {
  const s = String(input).trim()
  const m = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  return m ? m[1] : s
}

// Daftar URL yang dicoba PDF.js secara berurutan
export function downloadUrls(input) {
  const id = getFileId(input)
  return [
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
  ]
}

// Fallback: pratinjau bawaan Google Drive
export const previewUrl = (input) =>
  `https://drive.google.com/file/d/${getFileId(input)}/preview`

export const viewUrl = (input) =>
  `https://drive.google.com/file/d/${getFileId(input)}/view`
