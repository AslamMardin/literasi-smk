# Prompt: Implementasi Depth Card Carousel untuk Tampilan Puisi

Saya memiliki project **Vue.js** dan ingin mengubah tampilan daftar puisi menjadi **card carousel dengan efek depth/stacked card**.

## Konsep Utama

Buat carousel seperti **Depth Carousel / Stacked Card Carousel**.

Card ditampilkan seperti tumpukan kartu:

- 1 card berada paling depan sebagai card aktif.
- Beberapa card berikutnya berada di belakang card aktif.
- Card belakang sedikit bergeser ke samping sehingga tetap terlihat.
- Card yang lebih jauh terlihat semakin kecil/gelap/blur.
- Ketika pengguna **swipe atau drag card aktif ke kiri**, card tersebut keluar dari tampilan dan card berikutnya otomatis menjadi card aktif.
- Card berikutnya kemudian mengambil posisi paling depan.
- Setelah card berpindah, antrian card berikutnya tetap muncul di belakang.
- Carousel harus terasa seperti **menggeser kartu fisik**, bukan seperti slider gambar biasa.

Contoh urutan:

```text
Awal:

        ┌──────────┐
        │  Card 4  │
      ┌──────────┐ │
      │  Card 3  │ │
    ┌──────────┐ │ │
    │  Card 2  │ │ │
  ┌───────────────┐
  │    CARD 1     │ ← aktif
  │    PUISI      │
  └───────────────┘


Swipe ke kiri →

  Card 1 keluar ←


Hasil:

        ┌──────────┐
        │  Card 5  │
      ┌──────────┐ │
      │  Card 4  │ │
    ┌──────────┐ │ │
    │  Card 3  │ │ │
  ┌───────────────┐
  │    CARD 2     │ ← aktif
  │    PUISI      │
  └───────────────┘
```

## Teknologi

Gunakan:

- Vue 3
- `<script setup>`
- JavaScript
- CSS
- GSAP jika diperlukan untuk animasi
- Tidak menggunakan React
- Tidak mengubah framework project menjadi React

Jika GSAP belum terpasang, berikan perintah:

```bash
npm install gsap
```

## Data Carousel

Carousel harus menerima data puisi secara dinamis, misalnya:

```js
const puisi = [
  {
    id: 1,
    judul: 'Judul Puisi 1',
    penulis: 'Nama Penulis',
    isi: 'Isi puisi...',
    kategori: 'Puisi',
    gambar: '/images/puisi-1.jpg'
  },
  {
    id: 2,
    judul: 'Judul Puisi 2',
    penulis: 'Nama Penulis',
    isi: 'Isi puisi...',
    kategori: 'Puisi',
    gambar: '/images/puisi-2.jpg'
  }
]
```

Jangan hardcode isi puisi di dalam komponen carousel.

Carousel harus bekerja berdasarkan array `puisi` yang diberikan dari parent component.

## Interaksi Swipe

Implementasikan gesture:

### Swipe ke kiri

Jika pengguna melakukan:

```text
← drag
```

maka:

```text
Card aktif → keluar ke kiri
Card berikutnya → menjadi card aktif
```

### Swipe ke kanan

Jika pengguna melakukan:

```text
drag →
```

maka:

```text
Card aktif → keluar ke kanan
Card sebelumnya → menjadi card aktif
```

Gunakan `Pointer Events` agar mendukung:

- Mouse
- Touchscreen
- Mobile
- Tablet

Gunakan:

```js
pointerdown
pointermove
pointerup
pointercancel
```

Card harus mengikuti gerakan pointer ketika sedang di-drag.

## Threshold Swipe

Jangan langsung berpindah hanya karena card sedikit digeser.

Gunakan threshold sekitar:

```js
const swipeThreshold = 80
```

Jika jarak drag melebihi threshold:

```text
> 80px ke kiri  → next
> 80px ke kanan  → previous
```

Jika tidak mencapai threshold:

```text
Card kembali ke posisi semula
```

Gunakan animasi yang halus ketika card kembali.

## Efek Depth

Gunakan beberapa level card.

Contoh:

```text
Card aktif
scale: 1
opacity: 1
blur: 0
translateZ: 0

Card berikutnya
scale: 0.96
opacity: 0.9
translateX: 25px
translateZ: -80px

Card berikutnya lagi
scale: 0.92
opacity: 0.75
translateX: 50px
translateZ: -160px

Card berikutnya lagi
scale: 0.88
opacity: 0.55
translateX: 75px
translateZ: -240px
```

Gunakan:

```css
perspective
transform-style: preserve-3d
translateZ()
translateX()
scale()
rotateY()
```

untuk menciptakan efek kedalaman.

## Animasi

Gunakan GSAP untuk membuat animasi smooth.

Durasi sekitar:

```js
duration: 0.6
```

Gunakan easing yang terasa natural, misalnya:

```js
power3.out
```

Ketika card keluar:

```text
translateX
rotate
opacity
scale
```

dapat dianimasikan secara bersamaan.

Contoh:

```text
Card aktif
      ↓
drag ke kiri
      ↓
translateX(-120%)
rotate(-8deg)
opacity(0)
      ↓
card berikutnya naik menjadi aktif
```

Jangan membuat animasi terlalu lambat.

## Tampilan Card

Card harus terlihat seperti kartu modern.

Gunakan:

```css
border-radius
box-shadow
overflow: hidden
```

Card dapat memiliki:

- Cover/gambar puisi
- Judul
- Nama penulis
- Kategori
- Cuplikan isi
- Tombol/detail jika diperlukan

Namun **struktur isi card harus tetap mudah disesuaikan**.

Jangan membuat carousel bergantung pada gambar saja.

## Posisi Card

Card berada di tengah container.

Gunakan:

```css
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
```

Semua card ditumpuk pada area yang sama kemudian dibedakan berdasarkan:

```text
translateX
translateZ
scale
opacity
z-index
blur
```

## Z-Index

Card aktif harus selalu berada paling depan.

Contoh:

```text
Card aktif       z-index: 100
Card berikutnya  z-index: 99
Card berikutnya  z-index: 98
Card berikutnya  z-index: 97
```

Saat active index berubah, z-index harus dihitung ulang secara dinamis.

## Infinite Loop

Tambahkan opsi:

```js
loop = true
```

Jika sudah sampai card terakhir:

```text
Card 1
Card 2
Card 3
Card 4
```

kemudian:

```text
Card 4 → Card 1
```

Carousel harus terasa terus berputar.

Jika:

```js
loop = false
```

maka carousel berhenti pada card pertama/terakhir.

## Responsive

Carousel harus responsif.

### Desktop

Card dapat berukuran sekitar:

```text
width: 320px
height: 430px
```

### Tablet

```text
width: 280px
height: 380px
```

### Mobile

```text
width: 85vw
max-width: 320px
height: 430px
```

Jangan sampai card keluar dari layar mobile.

Kurangi jumlah card yang terlihat pada mobile agar tidak terlalu penuh.

## Kontrol

Sediakan:

- Swipe / drag
- Tombol Previous
- Tombol Next
- Indicator/dots

Contoh:

```text
        ←                  →
     
          [ CARD AKTIF ]

             ● ○ ○ ○ ○
```

Tombol boleh disembunyikan pada mobile jika gesture swipe sudah cukup.

## Props Component

Buat component reusable:

```vue
<DepthCarousel
  :items="puisi"
  :visible-cards="4"
  :loop="true"
  :autoplay="false"
/>
```

Props minimal:

```js
items
cardWidth
cardHeight
visibleCards
depth
spread
tilt
duration
loop
autoplay
autoplayDelay
showControls
showIndicators
```

## Event

Berikan event:

```vue
@change="handleChange"
```

yang mengembalikan:

```js
(index, item)
```

Contoh:

```js
const handleChange = (index, item) => {
  console.log('Puisi aktif:', item)
}
```

## Accessibility

Tambahkan:

```html
aria-roledescription="carousel"
aria-label="Carousel puisi"
```

Support keyboard:

```text
ArrowLeft  → previous
ArrowRight → next
```

Tambahkan `tabindex="0"` pada container.

## Reduced Motion

Hormati:

```css
prefers-reduced-motion: reduce
```

Jika pengguna mengaktifkan reduced motion, kurangi atau hilangkan animasi yang tidak diperlukan.

## Struktur File

Buat struktur:

```text
src/
├── components/
│   ├── DepthCarousel.vue
│   └── DepthCarousel.css
```

Jika GSAP digunakan:

```text
npm install gsap
```

## Hal Penting

Saya **tidak ingin carousel biasa** seperti:

```text
[ Card 1 ] [ Card 2 ] [ Card 3 ]
       ← slider →
```

Yang saya inginkan adalah:

```text
       Card 3
     Card 2
   Card 1
  ┌─────────────┐
  │ CARD AKTIF  │
  └─────────────┘
```

Kemudian ketika Card 1 di-swipe:

```text
Card 1  → keluar
Card 2  → maju
Card 3  → maju
Card 4  → masuk dari antrian
```

Jadi fokus utama adalah **efek kartu bertumpuk/depth + gesture swipe + animasi card keluar + card berikutnya mengambil posisi aktif**.

Gunakan pendekatan yang mirip dengan **DepthCarousel React Bits** yang memiliki konfigurasi `depth`, `spread`, `tilt`, `perspective`, `visibleCards`, `falloff`, `blur`, serta navigasi drag/swipe.

Buat implementasi yang **native untuk Vue 3**, bersih, reusable, responsive, dan tidak merusak komponen atau data puisi yang sudah ada.