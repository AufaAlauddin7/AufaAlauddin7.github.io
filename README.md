# Portfolio — Mukhammad Aufa Alauddin

Web portfolio statis (HTML + CSS + JS), tanpa build tool.

## Melihat di komputer
Buka `index.html` di browser, atau di Antigravity jalankan di terminal:

```
cd portfolio
python -m http.server 8000
```
lalu buka http://localhost:8000

## Online gratis lewat GitHub Pages
Link di CV sudah diarahkan ke **https://aufaalauddin7.github.io**. Supaya link itu aktif:

1. Di GitHub, buat repository baru bernama persis **`AufaAlauddin7.github.io`** (Public).
2. Upload semua isi folder `portfolio` (index.html, style.css, script.js, folder assets) ke root repository.
3. Buka Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)` → Save.
4. Tunggu 1–2 menit, lalu buka https://aufaalauddin7.github.io

Lewat terminal (kalau Git sudah terpasang):
```
cd portfolio
git init
git add .
git commit -m "Portfolio pertama"
git branch -M main
git remote add origin https://github.com/AufaAlauddin7/AufaAlauddin7.github.io.git
git push -u origin main
```

## Struktur
- `index.html` — isi halaman
- `style.css` — tampilan
- `script.js` — menu mobile, animasi, galeri
- `assets/img/` — foto sertifikat & dokumentasi
- `assets/cv/CV_Mukhammad_Aufa_Alauddin.pdf` — CV terbaru (tombol "Unduh CV")

## Mengedit isi
Semua teks ada di `index.html`. Untuk menambah proyek, salin satu blok `<article class="card">…</article>` di bagian Proyek dan ganti isinya.
