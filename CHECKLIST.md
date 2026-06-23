# Production Checklist — PT Indofa Gemilang Konstruksi

Centang semua item sebelum website dinyatakan live.

---

## ✅ Verifikasi Fungsional

Bagian ini menguji **alur penggunaan nyata** — coba langsung setiap aksi di production URL, jangan hanya cek konfigurasi.

### Database & Environment Setup
- [ ] `supabase/schema.sql` sudah dijalankan di SQL Editor Supabase
- [ ] Tabel `projects` muncul di Table Editor dengan kolom yang sesuai
- [ ] `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diisi di Vercel
- [ ] `npm run build` berhasil tanpa error sebelum deploy

### Deployment
- [ ] Repo sudah di-push ke GitHub
- [ ] Project sudah ter-import dan ter-deploy di Vercel
- [ ] Status deployment terbaru: **Ready** (bukan Error)
- [ ] URL production bisa diakses dan tidak menampilkan halaman error

### Admin Login
- [ ] Buka `https://domain.com/login` → form login tampil
- [ ] Login dengan email/password admin yang benar → berhasil masuk ke `/admin`
- [ ] Login dengan password salah → muncul pesan error, tidak crash
- [ ] Akses `https://domain.com/admin` tanpa login (mode incognito) → otomatis redirect ke `/login`
- [ ] Setelah login, redirect kembali ke halaman yang awalnya dituju (bukan selalu ke `/admin`)
- [ ] Klik tombol **Keluar** di sidebar → berhasil logout dan kembali ke `/login`

### Create Project
- [ ] Buka `/admin/projects/new` → form tampil lengkap
- [ ] Submit form tanpa isi field wajib → muncul pesan validasi, tidak crash
- [ ] Isi semua field dengan benar lalu submit → muncul notifikasi sukses
- [ ] Proyek baru muncul di `/admin/projects` dan di halaman publik `/portfolio`

### Edit Project
- [ ] Buka `/admin/projects` → klik ikon edit pada salah satu proyek
- [ ] Form ter-isi otomatis dengan data proyek yang sudah ada
- [ ] Ubah salah satu field lalu simpan → perubahan tersimpan dan terlihat di halaman publik

### Delete Project
- [ ] Klik ikon hapus pada salah satu proyek → muncul dialog konfirmasi
- [ ] Klik **Batal** → proyek tidak terhapus
- [ ] Klik **Ya, Hapus** → proyek hilang dari daftar dan dari halaman publik
- [ ] Foto terkait proyek tersebut juga terhapus dari Supabase Storage

### Upload Image
- [ ] Upload foto cover (klik atau drag & drop) → preview tampil, tersimpan ke Supabase Storage
- [ ] Upload beberapa foto sekaligus ke galeri → semua tampil setelah selesai upload
- [ ] Upload file bukan gambar (misal `.pdf`) → ditolak dengan pesan error yang jelas
- [ ] Upload file di atas 10 MB → ditolak dengan pesan error yang jelas
- [ ] Hapus salah satu foto di galeri (klik ikon X) → foto hilang dari preview

### Contact Page
- [ ] Buka `/contact` → info kontak, Google Maps, dan form tampil
- [ ] Isi form pesan dengan benar lalu submit → muncul pesan sukses, form ter-reset
- [ ] Submit form dengan email tidak valid → muncul pesan validasi
- [ ] Submit pesan kurang dari batas minimum karakter → muncul pesan validasi
- [ ] Klik tombol WhatsApp → membuka WhatsApp dengan nomor dan pesan yang benar

### Portfolio Page
- [ ] Buka `/portfolio` → seluruh proyek dari database tampil
- [ ] Coba search berdasarkan judul → hasil terfilter sesuai
- [ ] Coba filter kategori → hasil terfilter sesuai
- [ ] Coba sorting terbaru/terlama → urutan berubah sesuai
- [ ] Klik salah satu proyek → masuk ke halaman detail dengan data yang benar
- [ ] Buka URL proyek dengan slug yang tidak ada → tampil halaman 404, bukan error

### SEO Page
- [ ] View page source homepage → ada tag `<title>`, `<meta description>`, Open Graph
- [ ] View page source halaman detail proyek → metadata sesuai data proyek tersebut
- [ ] Buka `https://domain.com/sitemap.xml` → menampilkan semua halaman + seluruh slug proyek
- [ ] Buka `https://domain.com/robots.txt` → `/admin` dan `/login` ada di Disallow
- [ ] Share link homepage di WhatsApp → preview gambar dan judul muncul

---

## 🗄️ Database (Supabase)

- [ ] Tabel `projects` sudah dibuat dan berisi data
- [ ] Sample data sudah dihapus atau diganti dengan data nyata
- [ ] Row Level Security (RLS) aktif di tabel `projects`
- [ ] Policy `public read` aktif (pengunjung bisa baca proyek)
- [ ] Policy `admin insert/update/delete` aktif (hanya admin login yang bisa ubah data)
- [ ] Index sudah ada untuk kolom `slug`, `category`, `year`

## 🗂️ Storage (Supabase)

- [ ] Bucket `project-media` sudah dibuat
- [ ] Bucket status: **Public**
- [ ] Storage policy `public read` aktif
- [ ] Storage policy `admin upload/update/delete` aktif
- [ ] Batas ukuran file: 10 MB per file
- [ ] Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

## 🔐 Authentication (Supabase)

- [ ] Email authentication aktif
- [ ] Akun admin sudah dibuat di Supabase → Authentication → Users
- [ ] Password admin sudah dicatat di tempat yang aman
- [ ] Test login berhasil di production URL
- [ ] Test redirect ke `/admin` setelah login
- [ ] Test redirect ke `/login` saat akses `/admin` tanpa login

## 🔧 Environment Variables (Vercel)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` sudah diisi
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diisi
- [ ] Kedua variable sudah di-set untuk environment **Production**
- [ ] Build Vercel berhasil setelah env diisi

## 🎨 Branding & Assets

- [ ] `public/favicon.ico` sudah ada
- [ ] `public/favicon-16x16.png` sudah ada (16×16px)
- [ ] `public/favicon-32x32.png` sudah ada (32×32px)
- [ ] `public/apple-touch-icon.png` sudah ada (180×180px)
- [ ] `public/og-image.jpg` sudah ada (1200×630px) dengan branding Indofa
- [ ] `public/site.webmanifest` sudah ada
- [ ] Logo di Navbar sudah sesuai branding
- [ ] Warna brand sudah sesuai (biru #1e3a8a, emas #f59e0b)

## 📝 Konten

- [ ] Nama perusahaan di `lib/config/company.ts` sudah benar
- [ ] Alamat kantor di `company.ts` sudah benar dan nyata
- [ ] Nomor telepon sudah benar dan aktif
- [ ] Email sudah benar dan aktif
- [ ] Nomor WhatsApp sudah benar (format: 62812xxxxx)
- [ ] Link Google Maps embed sudah menunjuk lokasi kantor yang benar
- [ ] Link sosial media (Instagram, LinkedIn) sudah benar
- [ ] Tahun berdiri perusahaan sudah benar
- [ ] Deskripsi perusahaan sudah sesuai
- [ ] Minimal 3 proyek sudah diinput ke database dengan foto

## 🔍 SEO

- [ ] Title dan description di setiap halaman sudah diisi
- [ ] Open Graph image (`og-image.jpg`) sudah ada
- [ ] Test share link di WhatsApp → preview gambar muncul
- [ ] JSON-LD Organization di homepage ada (cek view source)
- [ ] `sitemap.xml` accessible di `https://domain.com/sitemap.xml`
- [ ] `robots.txt` accessible di `https://domain.com/robots.txt`
- [ ] robots.txt memblokir `/admin` dan `/login`
- [ ] Submit sitemap ke Google Search Console setelah domain aktif

## 🖼️ Gambar & Media

- [ ] Foto proyek sudah diupload via admin panel (bukan URL eksternal)
- [ ] Semua foto tersimpan di Supabase Storage bucket `project-media`
- [ ] Foto tampil di halaman portfolio dan detail proyek
- [ ] `next.config.ts` sudah whitelist hostname Supabase
- [ ] Gambar tidak lebih dari 10 MB per file

## 📞 Informasi Kontak

- [ ] Alamat kantor di halaman Contact sudah benar
- [ ] Nomor telepon sudah benar
- [ ] Email sudah benar
- [ ] Tombol WhatsApp berfungsi dan membuka WhatsApp dengan pesan default
- [ ] Google Maps embed menunjukkan lokasi yang benar
- [ ] Link "Lihat di Maps" berfungsi

## 🌐 Domain & SSL

- [ ] Domain sudah terdaftar dan aktif
- [ ] DNS sudah diarahkan ke Vercel
- [ ] SSL certificate aktif (HTTPS berfungsi)
- [ ] Akses `http://` otomatis redirect ke `https://`
- [ ] `www.domain.com` redirect ke `domain.com` (atau sebaliknya)
- [ ] URL di `lib/config/company.ts` sudah diupdate ke domain asli

## ⚡ Performance

- [ ] Lighthouse score ≥ 80 di semua kategori
- [ ] Homepage load time < 3 detik
- [ ] Tidak ada console error di browser
- [ ] Gambar menggunakan `next/image` (bukan tag `<img>` biasa)

## 🛡️ Security

- [ ] Response headers ada `X-Frame-Options`
- [ ] Response headers ada `X-Content-Type-Options`
- [ ] Admin panel tidak bisa diakses tanpa login
- [ ] Secret key Supabase tidak ter-expose di kode (gunakan hanya anon key)
- [ ] `.env.local` tidak ter-commit ke Git
- [ ] Setiap Server Action di `lib/actions/*.ts` punya pengecekan auth sendiri (tidak hanya mengandalkan middleware)

## 🚀 Final Deploy

- [ ] `npm run build` lokal berhasil tanpa error dan warning
- [ ] Vercel deployment berhasil (status: Ready)
- [ ] Semua halaman publik bisa diakses
- [ ] Admin panel bisa diakses dan berfungsi
- [ ] Konfirmasi dengan klien / stakeholder bahwa website siap live

---

**Website dinyatakan LIVE setelah semua item di atas dicentang.** ✅
