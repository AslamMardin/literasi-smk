// Data ebook dari Google Drive – disinkronkan dari CSV Daftar Ebook Literasi SMKN Campalagian
// Cover thumbnail otomatis diambil dari lh3.googleusercontent.com menggunakan File ID
import { driveThumbnail } from './drive.js'

const t = (id) => driveThumbnail(id, 450)

export const ebooks = [
  { id: '145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9', judul: 'Saat Engkau Ingin Berubah', penulis: 'Rahma', kategori: 'Pengembangan Diri', cover: t('145nlFpE2CbVCXDolLCqz5Km-Tmw8pXg9') },
  { id: '13k_pwFYaopcEv6iWeLfE11gj6rhJkC00', judul: 'Ilmu Bisnis Tionghoa', penulis: 'Anonim', kategori: 'Bisnis', cover: t('13k_pwFYaopcEv6iWeLfE11gj6rhJkC00') },
  { id: '1EUk3qLQakDTC4lGXnrNeH-kiKta5tH40', judul: 'Cara Bersikap Tegas dalam Segala Situasi (Edisi Revisi)', penulis: 'Sue Hadfield & Gill Hasson', kategori: 'Pengembangan Diri', cover: t('1EUk3qLQakDTC4lGXnrNeH-kiKta5tH40') },
  { id: '1TQ0ri1YQAiKTcYEo7ZapePZb_KZ3go0Z', judul: 'Berdamai Dengan Diri Sendiri', penulis: 'Muthia Sayekti', kategori: 'Pengembangan Diri', cover: t('1TQ0ri1YQAiKTcYEo7ZapePZb_KZ3go0Z') },
  { id: '1uHRKbTHK5KBPmcpxDrEJ5kgcvX9vA0RG', judul: 'Tentang Manusia: Dari Pikiran, Pemahaman, dan Tindakan', penulis: 'Anonim', kategori: 'Filsafat', cover: t('1uHRKbTHK5KBPmcpxDrEJ5kgcvX9vA0RG') },
  { id: '1zGYzcThTgcQgPoJ4fOM7c9upAaBX0_bI', judul: 'Thinking, Fast and Slow', penulis: 'Daniel Kahneman', kategori: 'Pengembangan Diri', cover: t('1zGYzcThTgcQgPoJ4fOM7c9upAaBX0_bI') },
  { id: '1xIHgt77oNKOQk616aTaqqrkCG4ExLBzP', judul: 'Berpikir dan Berjiwa Besar', penulis: 'David J. Schwartz', kategori: 'Pengembangan Diri', cover: t('1xIHgt77oNKOQk616aTaqqrkCG4ExLBzP') },
  { id: '1viBQk5zR0FyLNSvC_mQQR5QSyZB5secb', judul: 'Metode Jitu Meningkatkan Daya Ingat', penulis: 'Anonim', kategori: 'Pendidikan', cover: t('1viBQk5zR0FyLNSvC_mQQR5QSyZB5secb') },
  { id: '1wGbopoG-sYeVUkLnMO3MH7cnXy3K_hQf', judul: '10 Steps To A More Fulfilling Life', penulis: 'Dale Carnegie', kategori: 'Pengembangan Diri', cover: t('1wGbopoG-sYeVUkLnMO3MH7cnXy3K_hQf') },
  { id: '1JY03R6DSRFt90uDQTGTywvuJLILGXqJC', judul: 'Sejarah Dunia yang Disembunyikan', penulis: 'Jonathan Black', kategori: 'Sejarah', cover: t('1JY03R6DSRFt90uDQTGTywvuJLILGXqJC') },
  { id: '17F2jf9_Q6NA-q64ATyFnWU7DELVVjgQp', judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', kategori: 'Novel', cover: t('17F2jf9_Q6NA-q64ATyFnWU7DELVVjgQp') },
  { id: '1eu1_0OqQaQ6Ytp0gkrJvGegHKwtK8xgG', judul: 'Reach Your Dreams', penulis: 'Wirda Mansur', kategori: 'Pengembangan Diri', cover: t('1eu1_0OqQaQ6Ytp0gkrJvGegHKwtK8xgG') },
  { id: '1YCggD6EJLAzr2EB5kaKtWWvr15Siv4XS', judul: 'Bicara Itu Ada Seninya', penulis: 'Oh Su Hyang', kategori: 'Pengembangan Diri', cover: t('1YCggD6EJLAzr2EB5kaKtWWvr15Siv4XS') },
  { id: '1H5N-nUSWaOqLkkRMbsMrkCXY2xbVoBYp', judul: '7 Prajurit Bapak', penulis: 'Wulan Nur Amalia', kategori: 'Novel', cover: t('1H5N-nUSWaOqLkkRMbsMrkCXY2xbVoBYp') },
  { id: '1A-4V00ScaYBpX_k4dwOa5UYoakONqOSG', judul: 'Bumi', penulis: 'Tere Liye', kategori: 'Novel', cover: t('1A-4V00ScaYBpX_k4dwOa5UYoakONqOSG') },
  { id: '1Wa2bzQF7__y58I3iH34BFdCEO2LCOI70', judul: 'Berani Tidak Disukai', penulis: 'Ichiro Kishimi & Fumitake Koga', kategori: 'Pengembangan Diri', cover: t('1Wa2bzQF7__y58I3iH34BFdCEO2LCOI70') },
  { id: '1oK7zmWbU8yaARJoDWA4tOENh23C-N8jN', judul: 'The 7 Habits of Highly Effective People', penulis: 'Stephen R. Covey', kategori: 'Pengembangan Diri', cover: t('1oK7zmWbU8yaARJoDWA4tOENh23C-N8jN') },
  { id: '100sn2FH9il9C9FI0TY2EOXsnxHMUeMxT', judul: 'As Long as The Lemon Trees Grow', penulis: 'Zoulfa Katouh', kategori: 'Novel', cover: t('100sn2FH9il9C9FI0TY2EOXsnxHMUeMxT') },
  { id: '12qcDUCJ9jFfKnz_V7LLNGnQMiFvVviqx', judul: 'Cantik Itu Luka', penulis: 'Eka Kurniawan', kategori: 'Novel', cover: t('12qcDUCJ9jFfKnz_V7LLNGnQMiFvVviqx') },
  { id: '1LKvXYNoV2-HA0ZLw2_S6JRsbTzuks6vI', judul: 'Good Vibes Good Life', penulis: 'Vex King', kategori: 'Pengembangan Diri', cover: t('1LKvXYNoV2-HA0ZLw2_S6JRsbTzuks6vI') },
  { id: '1LzeHyGxzYY2_ktGCD-qLYZtGD0Jsx43L', judul: 'Azzamine', penulis: 'Sophie Aulia', kategori: 'Novel', cover: t('1LzeHyGxzYY2_ktGCD-qLYZtGD0Jsx43L') },
  { id: '1NF73lrGUrCMAW5hOh9yIHxa_Ilv778_b', judul: 'Bulan', penulis: 'Tere Liye', kategori: 'Novel', cover: t('1NF73lrGUrCMAW5hOh9yIHxa_Ilv778_b') },
  { id: '1TuJ7VZsqwii5oG5K79GFrKcnN96FzdCL', judul: 'Ikigai: The Japanese Secret to a Long and Happy Life', penulis: 'Héctor García & Francesc Miralles', kategori: 'Pengembangan Diri', cover: t('1TuJ7VZsqwii5oG5K79GFrKcnN96FzdCL') },
  { id: '1a-kq-p2KJ5PeoZipt5ShSCnLhBSZ-QQH', judul: 'Hujan', penulis: 'Tere Liye', kategori: 'Novel', cover: t('1a-kq-p2KJ5PeoZipt5ShSCnLhBSZ-QQH') },
  { id: '1j-L4VEdWfQ1CJXUstqOSPWk6keNl8krH', judul: 'Funiculi Funicula', penulis: 'Toshikazu Kawaguchi', kategori: 'Novel', cover: t('1j-L4VEdWfQ1CJXUstqOSPWk6keNl8krH') },
  { id: '17pGDCVqkF4MNqFV9yjkFYBDA47qJFrnr', judul: 'Sejarah Tuhan', penulis: 'Karen Armstrong', kategori: 'Sejarah', cover: t('17pGDCVqkF4MNqFV9yjkFYBDA47qJFrnr') },
  { id: '1TxFsdjd4Z86BOnFjKXy8UID0NuVO2m_N', judul: 'Laut Bercerita', penulis: 'Leila S. Chudori', kategori: 'Novel', cover: t('1TxFsdjd4Z86BOnFjKXy8UID0NuVO2m_N') },
  { id: '1VjW61V96cnDUI1GIOkHjHfWVFzc-XKnY', judul: 'ILY (I Love You)', penulis: 'Tere Liye', kategori: 'Novel', cover: t('1VjW61V96cnDUI1GIOkHjHfWVFzc-XKnY') },
  { id: '1iLS27-5icK6B7ms6tWHo1n38VyVOeQVr', judul: 'Nunchi: Seni Membaca Pikiran Orang Lain', penulis: 'Euny Hong', kategori: 'Pengembangan Diri', cover: t('1iLS27-5icK6B7ms6tWHo1n38VyVOeQVr') },
  { id: '1nHI9DBH2qIJ6g2W3mEXZ3kMTbJevRpfv', judul: 'Once Upon A Broken Heart', penulis: 'Stephanie Garber', kategori: 'Novel', cover: t('1nHI9DBH2qIJ6g2W3mEXZ3kMTbJevRpfv') },
  { id: '1qRv41cPgR9EPz6eVffG_moUdXKCHPHiX', judul: 'Funiculi Funicula 2', penulis: 'Toshikazu Kawaguchi', kategori: 'Novel', cover: t('1qRv41cPgR9EPz6eVffG_moUdXKCHPHiX') },
  { id: '1qqkihciehVFXOrDr3Ypg-cv9pfl4mGdv', judul: 'Malioboro at Midnight', penulis: 'Skysphire', kategori: 'Novel', cover: t('1qqkihciehVFXOrDr3Ypg-cv9pfl4mGdv') },
  { id: '1xRUQ53GFbTADNA-tkDP1LikGMrdySWR_', judul: 'Filosofi Teras', penulis: 'Henry Manampiring', kategori: 'Pengembangan Diri', cover: t('1xRUQ53GFbTADNA-tkDP1LikGMrdySWR_') },
  { id: '1zdZHOvNdKEYqx8PYmf3WKUuFbtXEX9Z7', judul: 'Mindset Changing', penulis: 'Carol S. Dweck', kategori: 'Pengembangan Diri', cover: t('1zdZHOvNdKEYqx8PYmf3WKUuFbtXEX9Z7') },
  { id: '1GhUYHuPeb9YpX6bH11xqymUvccWzZ60T', judul: 'Jika Kita Tak Pernah Jadi Apa-Apa', penulis: 'Alvi Syahrin', kategori: 'Pengembangan Diri', cover: t('1GhUYHuPeb9YpX6bH11xqymUvccWzZ60T') },
  { id: '1IF9tNxXg7cpfW70_UN4hYksr-ZZ70TGj', judul: 'Sepasang yang Melawan 2', penulis: 'Jaswanto', kategori: 'Novel', cover: t('1IF9tNxXg7cpfW70_UN4hYksr-ZZ70TGj') },
  { id: '1N0f1-jU07kE_yI1uknpS240Mx1gqiUi1', judul: 'Secret Of Divine Love', penulis: 'A. Helwa', kategori: 'Spiritual', cover: t('1N0f1-jU07kE_yI1uknpS240Mx1gqiUi1') },
  { id: '1QRZwol5b1m3j2p0elot4PYA6sma-Prgm', judul: 'Steal Like An Artist', penulis: 'Austin Kleon', kategori: 'Pengembangan Diri', cover: t('1QRZwol5b1m3j2p0elot4PYA6sma-Prgm') },
  { id: '1TscVpI232GTUswXc7kUSr09qL3yh1t6E', judul: 'The Girl Who Fell Beneath the Sea', penulis: 'Axie Oh', kategori: 'Novel', cover: t('1TscVpI232GTUswXc7kUSr09qL3yh1t6E') },
  { id: '1efU_OBnYSphmHZDbRfmyXGgN1lb2CW0A', judul: 'Hello Cello', penulis: 'Nadia Ristivani', kategori: 'Novel', cover: t('1efU_OBnYSphmHZDbRfmyXGgN1lb2CW0A') },
  { id: '1fTl3RFiaQKMl4Lqx18pjLuVByLpUDuA1', judul: 'Hello', penulis: 'Tere Liye', kategori: 'Novel', cover: t('1fTl3RFiaQKMl4Lqx18pjLuVByLpUDuA1') },
  { id: '1iUyvKoclzsHbpSq2bLdX57Vsxwor43Nq', judul: 'Sepasang yang Melawan 1', penulis: 'Jaswanto', kategori: 'Novel', cover: t('1iUyvKoclzsHbpSq2bLdX57Vsxwor43Nq') },
  { id: '1wh5IwGm2gEoM0bIcuUwOXDmZEznWQCUp', judul: 'The Girl Who Drank The Moon', penulis: 'Kelly Barnhill', kategori: 'Novel', cover: t('1wh5IwGm2gEoM0bIcuUwOXDmZEznWQCUp') },
  { id: '1KOmY1RLl6SferBsn14T2JsE42TYCyIH8', judul: 'Atomic Habits', penulis: 'James Clear', kategori: 'Pengembangan Diri', cover: t('1KOmY1RLl6SferBsn14T2JsE42TYCyIH8') },
  { id: '1Q_gJjTjr6BYRoEof4jv3xR0OCoJ0QKs7', judul: 'Surat Cinta Tanpa Nama', penulis: 'Pit Sansi', kategori: 'Novel', cover: t('1Q_gJjTjr6BYRoEof4jv3xR0OCoJ0QKs7') },
  { id: '1VMp86CD0HXcQKHHBM142kv60Bg5euDFK', judul: 'Yellowface', penulis: 'R.F. Kuang', kategori: 'Novel', cover: t('1VMp86CD0HXcQKHHBM142kv60Bg5euDFK') },
  { id: '1hV1yLcVrWTXWcVWeg7jXC2z0GpnlnZoz', judul: 'The Magic of Thinking Big', penulis: 'David J. Schwartz', kategori: 'Pengembangan Diri', cover: t('1hV1yLcVrWTXWcVWeg7jXC2z0GpnlnZoz') },
  { id: '1j7nevbGwvllklb9NMdk90IsifiLUU41I', judul: 'The Psychology of Money', penulis: 'Morgan Housel', kategori: 'Pengembangan Diri', cover: t('1j7nevbGwvllklb9NMdk90IsifiLUU41I') },
  { id: '1jW1cdOkJwkZpHMZa3w8iYia5oCQ1GiiG', judul: 'Saga', penulis: 'Pit Sansi', kategori: 'Novel', cover: t('1jW1cdOkJwkZpHMZa3w8iYia5oCQ1GiiG') },
  { id: '1vGOLU89bt1FXam_f6sHvlVwvarqjSksb', judul: 'Altero', penulis: 'Laju19', kategori: 'Novel', cover: t('1vGOLU89bt1FXam_f6sHvlVwvarqjSksb') },
  { id: '1ygNeLT30xQEytpDSs9gmvfBHwX4-xtnW', judul: "The Alpha Girl's Guide", penulis: 'Henry Manampiring', kategori: 'Pengembangan Diri', cover: t('1ygNeLT30xQEytpDSs9gmvfBHwX4-xtnW') },
  { id: '148R-ulPcgVZ5nCZyXDV2kI3VuN8_sHuh', judul: 'The Principles Of Power', penulis: 'Dion Yulianto', kategori: 'Pengembangan Diri', cover: t('148R-ulPcgVZ5nCZyXDV2kI3VuN8_sHuh') },
  { id: '1Cg-OQZ81a1e03aAyStavnPQWw_ptlDbc', judul: 'Jika Kita Tak Pernah Jatuh Cinta', penulis: 'Alvi Syahrin', kategori: 'Pengembangan Diri', cover: t('1Cg-OQZ81a1e03aAyStavnPQWw_ptlDbc') },
  { id: '1ZIk0aSuKBw5oJsZYROewU8GwTM-J6otV', judul: 'Trik Memikat & Mempengaruhi Lawan Bicara', penulis: 'Yoga Pratama', kategori: 'Pengembangan Diri', cover: t('1ZIk0aSuKBw5oJsZYROewU8GwTM-J6otV') },
  { id: '1d6cEKXNKoqJgf3o0J_xZUOrtNNs5-IOy', judul: 'It Is Bad or Good Habits', penulis: 'Sabrina Ara', kategori: 'Pengembangan Diri', cover: t('1d6cEKXNKoqJgf3o0J_xZUOrtNNs5-IOy') },
  { id: '1kFeZ7oZg9kGKilpk4SmwXL2H2N2enWTH', judul: 'Sebuah Seni untuk Bersikap Bodo Amat', penulis: 'Mark Manson', kategori: 'Pengembangan Diri', cover: t('1kFeZ7oZg9kGKilpk4SmwXL2H2N2enWTH') },
]

// Rekomendasi pilihan – ebook paling populer
export const rekomendasiIds = [
  '17F2jf9_Q6NA-q64ATyFnWU7DELVVjgQp', // Bumi Manusia – Pramoedya
  '1KOmY1RLl6SferBsn14T2JsE42TYCyIH8', // Atomic Habits – James Clear
  '1xRUQ53GFbTADNA-tkDP1LikGMrdySWR_', // Filosofi Teras – Henry Manampiring
  '1kFeZ7oZg9kGKilpk4SmwXL2H2N2enWTH', // Sebuah Seni untuk Bersikap Bodo Amat
]

export const getEbookById = (id) => ebooks.find((e) => e.id === id)
export const getKategori = () => [...new Set(ebooks.map((e) => e.kategori))].sort()
export const getPenulisCount = () => new Set(ebooks.map((e) => e.penulis)).size
export const getTerbaru = (n = 4) => [...ebooks].reverse().slice(0, n)
export const getRekomendasi = () =>
  rekomendasiIds.map((id) => getEbookById(id)).filter(Boolean)

