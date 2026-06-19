# Panduan Deployment PT Indofa Gemilang Konstruksi

## Daftar Isi
1. [Persiapan Sebelum Deploy](#1-persiapan-sebelum-deploy)
2. [Deploy ke Vercel](#2-deploy-ke-vercel)
3. [Environment Variables](#3-environment-variables)
4. [Connect Domain](#4-connect-domain)
5. [Verifikasi Setelah Deploy](#5-verifikasi-setelah-deploy)
6. [Redeploy](#6-redeploy)
7. [Rollback](#7-rollback)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Persiapan Sebelum Deploy

### Pastikan build lokal berhasil
```cmd
rmdir /s /q .next
npm run build
```
Build harus selesai tanpa error TypeScript atau ESLint.

### Pastikan semua file ada
- [ ] `.env.local` terisi dengan nilai Supabase yang benar
- [ ] `public/og-image.jpg` sudah dibuat (1200×630px)
- [ ] `public/favicon.ico` sudah ada
- [ ] `public/apple-touch-icon.png` sudah ada (180×180px)

### Push ke GitHub
```bash
git init                          # jika belum
git add .
git commit -m "feat: initial production build"
git branch -M main
git remote add origin https://github.com/USERNAME/indofa-gemilang.git
git push -u origin main
```

> **Penting:** File `.env.local` sudah ada di `.gitignore` dan tidak akan ter-push ke GitHub. Ini sudah benar.

---

## 2. Deploy ke Vercel

### Langkah-langkah:

1. Buka [vercel.com](https://vercel.com) → login dengan GitHub

2. Klik **Add New Project**

3. Pilih repository `indofa-gemilang` dari daftar

4. Di halaman konfigurasi:
   - **Framework Preset:** Next.js (terdeteksi otomatis)
   - **Root Directory:** `.` (biarkan default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

5. **Jangan klik Deploy dulu** — isi Environment Variables terlebih dahulu (lihat bagian 3)

6. Setelah env terisi, klik **Deploy**

7. Tunggu 2–5 menit. Vercel akan menampilkan URL preview seperti:
   `https://indofa-gemilang-xyz.vercel.app`

---

## 3. Environment Variables

Di halaman konfigurasi Vercel (sebelum deploy pertama) atau di **Settings → Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_xxxxx` | Production, Preview, Development |

### Cara menambahkan:
1. Klik **Add** untuk setiap variable
2. Pilih environment: centang **Production**, **Preview**, dan **Development**
3. Klik **Save**

### Cara mengambil nilai dari Supabase:
1. Buka [supabase.com](https://supabase.com) → masuk ke project
2. Klik **Project Settings** (ikon gear) → **API**
3. Salin **Project URL** → paste sebagai `NEXT_PUBLIC_SUPABASE_URL`
4. Salin **anon / public key** → paste sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Connect Domain

### Setelah memiliki domain (contoh: indofagemilang.co.id):

1. Di Vercel dashboard → pilih project → **Settings** → **Domains**

2. Klik **Add** → masukkan domain: `indofagemilang.co.id`

3. Vercel akan menampilkan dua opsi:
   - **Recommended:** Tambahkan Nameserver Vercel ke registrar domain
   - **Alternative:** Tambahkan DNS record (A record / CNAME) manual

4. **Opsi A — Nameserver (lebih mudah):**
   - Buka panel registrar domain (Niagahoster, IDCloudHost, dll)
   - Ganti nameserver ke yang diberikan Vercel:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

5. **Opsi B — DNS Record manual:**
   - Tambahkan A record: `@` → `76.76.21.21`
   - Tambahkan CNAME: `www` → `cname.vercel-dns.com`

6. Tunggu propagasi DNS: 15 menit – 48 jam

7. SSL/HTTPS otomatis diaktifkan oleh Vercel setelah domain terverifikasi

### Update URL di kode setelah domain aktif:
Edit `lib/config/company.ts`:
```typescript
url: "https://indofagemilang.co.id",  // ganti dari placeholder
```
Kemudian commit dan push — Vercel akan auto-redeploy.

---

## 5. Verifikasi Setelah Deploy

Buka URL production dan cek setiap halaman:

### Public pages
- [ ] `https://domain.com/` — Homepage tampil normal
- [ ] `https://domain.com/portfolio` — Daftar proyek dari Supabase muncul
- [ ] `https://domain.com/portfolio/[slug]` — Detail proyek dan galeri tampil
- [ ] `https://domain.com/about` — Halaman tentang tampil
- [ ] `https://domain.com/contact` — Halaman kontak + peta tampil
- [ ] `https://domain.com/sitemap.xml` — Sitemap valid (cek di browser)
- [ ] `https://domain.com/robots.txt` — robots.txt valid

### Admin pages
- [ ] `https://domain.com/login` — Halaman login tampil
- [ ] Login dengan email/password admin Supabase → redirect ke `/admin`
- [ ] `https://domain.com/admin` — Dashboard tampil dengan data
- [ ] `https://domain.com/admin/projects` — Daftar proyek tampil
- [ ] Tambah proyek baru dengan foto → tersimpan ke Supabase
- [ ] Edit proyek → tersimpan
- [ ] Hapus proyek → terhapus dari database dan storage

### SEO
- [ ] View source homepage → ada JSON-LD Organization
- [ ] View source project detail → ada JSON-LD Project + Breadcrumb
- [ ] Share link di WhatsApp → og-image muncul

### Security
- [ ] Akses `https://domain.com/admin` tanpa login → redirect ke `/login`
- [ ] Response headers ada `X-Frame-Options`, `X-Content-Type-Options`

---

## 6. Redeploy

### Otomatis (recommended):
Setiap kali `git push` ke branch `main`, Vercel otomatis melakukan redeploy.

```bash
git add .
git commit -m "fix: perbaikan halaman kontak"
git push origin main
```

### Manual:
1. Buka Vercel dashboard → project
2. Klik tab **Deployments**
3. Klik **Redeploy** pada deployment terbaru

---

## 7. Rollback

Jika deployment terbaru bermasalah:

1. Buka Vercel dashboard → project → **Deployments**
2. Temukan deployment yang ingin dijadikan active (yang masih berfungsi)
3. Klik titik tiga (⋯) di sebelah deployment tersebut
4. Pilih **Promote to Production**

Rollback selesai dalam hitungan detik — tanpa perlu push kode baru.

---

## 8. Troubleshooting

### Build gagal di Vercel tapi lokal berhasil
- Pastikan semua environment variables sudah diisi di Vercel
- Cek Vercel build log untuk error spesifik
- Pastikan tidak ada file yang ter-gitignore tapi dibutuhkan build

### Foto tidak tampil setelah deploy
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` di Vercel sudah benar
- Cek Supabase Storage bucket `project-media` masih aktif dan public
- Cek `next.config.ts` — hostname Supabase sudah di-whitelist

### Login admin tidak berfungsi di production
- Pastikan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel sudah benar
- Buka Supabase → Authentication → Users → pastikan user admin masih ada
- Cek Supabase → Authentication → Settings → pastikan email auth aktif

### Sitemap tidak update setelah tambah proyek
- Sitemap di-generate saat build, bukan real-time
- Redeploy akan mengupdate sitemap dengan proyek terbaru
- Atau tambahkan `revalidate` di `sitemap.ts` untuk ISR

### Domain belum aktif / SSL error
- Tunggu propagasi DNS sampai 48 jam
- Pastikan nameserver sudah diganti di panel registrar
- Cek status di Vercel dashboard → Settings → Domains
