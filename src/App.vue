<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1>📚 Literasi Digital</h1>
        <p>SMKN Campalagian</p>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <h2>Selamat Datang 👋</h2>
        <p>
          Temukan dan baca berbagai koleksi ebook
          untuk menambah wawasan dan pengetahuan.
        </p>

        <button>Mulai Membaca</button>
      </section>

      <section class="info">
        <div class="card">
          <span>📖</span>
          <h3>Koleksi Ebook</h3>
          <p>Berbagai bahan bacaan tersedia untuk siswa.</p>
        </div>

        <div class="card">
          <span>🔍</span>
          <h3>Mudah Dicari</h3>
          <p>Temukan ebook berdasarkan judul dan kategori.</p>
        </div>

        <div class="card">
          <span>💻</span>
          <h3>Baca Online</h3>
          <p>Akses ebook kapan saja melalui perangkatmu.</p>
        </div>
      </section>
    </main>

    <footer>
      <p>© 2026 SMKN Campalagian</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  color: #1f2937;
}

.app {
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1100px;
  margin: auto;
}

.header {
  background: #ff2802;
  color: white;
  padding: 20px 0;
}

.header h1 {
  font-size: 24px;
}

.header p {
  margin-top: 5px;
  opacity: 0.9;
}

.hero {
  text-align: center;
  padding: 80px 20px;
}

.hero h2 {
  font-size: 42px;
  margin-bottom: 15px;
}

.hero p {
  max-width: 600px;
  margin: auto;
  line-height: 1.7;
  color: #6b7280;
}

.hero button {
  margin-top: 30px;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background: #166534;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.hero button:hover {
  background: #14532d;
}

.info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-bottom: 60px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}

.card span {
  font-size: 35px;
}

.card h3 {
  margin: 15px 0 10px;
}

.card p {
  color: #6b7280;
  line-height: 1.6;
}

footer {
  text-align: center;
  padding: 25px;
  background: #111827;
  color: white;
}

@media (max-width: 700px) {
  .hero {
    padding: 60px 15px;
  }

  .hero h2 {
    font-size: 32px;
  }

  .info {
    grid-template-columns: 1fr;
  }
}
</style>