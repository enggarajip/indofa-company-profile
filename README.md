# PT Indofa Gemilang Konstruksi — Website

Website company profile dan portfolio resmi **PT Indofa Gemilang Konstruksi**, dibangun dengan Next.js 15 dan Supabase.

---

## Deskripsi Project

Website ini terdiri dari dua bagian utama:

1. **Halaman Publik** — company profile, portfolio proyek, dan formulir kontak yang bisa diakses siapa saja.
2. **Admin Panel** — dashboard internal untuk mengelola data proyek (tambah, edit, hapus, upload foto), hanya bisa diakses setelah login.

Seluruh data proyek tersimpan di Supabase (PostgreSQL + Storage), dan halaman publik mengambil data tersebut secara langsung — tidak ada CMS terpisah.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Analytics | Vercel Web Analytics, Vercel Speed Insights |
| Deploy | Vercel |
| Icons | Lucide React |

---

## Fitur Utama

### Halaman Publik
- **Homepage** — hero, statistik perusahaan, partner/klien, layanan, proyek unggulan, testimoni, CTA
- **Portfolio** — grid proyek dengan filter kategori, search judul, sorting terbaru/terlama, pagination
- **Detail Proyek** (`/portfolio/[slug]`) — galeri foto, info lengkap, Google Maps, proyek terkait
- **Tentang Kami** — profil, visi, misi, nilai, milestone perusahaan
- **Kontak** — info kontak, form pesan (lead capture), tombol WhatsApp, Google Maps embed

### Admin Panel (`/admin`)
- Login dengan email/password (Supabase Auth), redirect ke halaman tujuan setelah login
- Dashboard dengan statistik dan daftar proyek terbaru
- CRUD proyek lengkap: tambah, edit, hapus (dengan konfirmasi)
- Upload foto cover dan galeri (drag & drop, validasi tipe & ukuran file)
- Search, filter kategori, dan pagination di daftar proyek

### SEO & Performance
- Metadata dinamis per halaman (title, description, Open Graph, Twitter Card)
- JSON-LD structured data (Organization, LocalBusiness, ConstructionCompany, Breadcrumb)
- Sitemap XML otomatis dari data Supabase (`app/sitemap.ts`)
- `robots.txt` (`app/robots.ts`) — blokir `/admin` dan `/login` dari index mesin pencari
- Next.js Image optimization (format AVIF/WebP otomatis)
- Loading skeleton di setiap halaman yang fetch data

### Monitoring & Stabilitas
- Vercel Web Analytics & Speed Insights (aktif otomatis saat live di Vercel)
- Global Error Boundary (`app/error.tsx`) — halaman error ramah pengguna dengan tombol "Coba Lagi"
- Logger terstruktur (`lib/logger.ts`) — aman di production, tidak membocorkan stack trace ke log
- Validasi environment variable saat startup (`lib/env.ts`) — fail-fast dengan pesan jelas jika env kurang

---

## Struktur Folder

```
indofa/
├── app/
│   ├── (public)/                  # Route group halaman publik
│   │   ├── layout.tsx             # Navbar + Footer
│   │   ├── page.tsx               # Homepage /
│   │   ├── about/page.tsx         # /about
│   │   ├── contact/page.tsx       # /contact (+ ContactForm)
│   │   ├── services/page.tsx      # /services (redirect ke homepage)
│   │   └── portfolio/
│   │       ├── page.tsx           # /portfolio
│   │       ├── loading.tsx        # Skeleton portfolio
│   │       ├── PortfolioClient.tsx # Search/filter/sort/pagination
│   │       └── [slug]/
│   │           ├── page.tsx       # Detail proyek
│   │           └── loading.tsx    # Skeleton detail
│   │
│   ├── admin/                     # Admin panel (dilindungi middleware)
│   │   ├── layout.tsx             # Sidebar shell
│   │   ├── page.tsx               # Dashboard
│   │   ├── loading.tsx
│   │   └── projects/
│   │       ├── page.tsx           # Daftar proyek
│   │       ├── new/page.tsx       # Tambah proyek
│   │       └── [id]/edit/page.tsx # Edit proyek
│   │
│   ├── login/page.tsx             # Halaman login admin
│   ├── layout.tsx                 # Root layout (font, metadata, JSON-LD, Analytics)
│   ├── error.tsx                  # Global Error Boundary
│   ├── not-found.tsx              # Custom 404
│   ├── sitemap.ts                 # Sitemap XML otomatis
│   └── robots.ts                  # robots.txt
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── ProjectForm.tsx        # Form tambah/edit dengan validasi
│   │   ├── DeleteButton.tsx       # Konfirmasi hapus
│   │   ├── ImageUploader.tsx      # Upload cover & galeri (drag & drop)
│   │   └── Toast.tsx              # Notifikasi sukses/error
│   └── public/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── ProjectCard.tsx
│       ├── ContactForm.tsx        # Form lead capture di /contact
│       ├── StatsSection.tsx       # Statistik perusahaan
│       ├── TestimonialSection.tsx # Testimoni klien
│       └── PartnersSection.tsx    # Logo partner/klien
│
├── lib/
│   ├── actions/
│   │   ├── projects.ts            # Server Actions CRUD proyek
│   │   └── auth.ts                # Server Actions login/logout
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client (dengan cookies, untuk auth)
│   │   ├── public.ts              # Client tanpa cookies, untuk read publik
│   │   └── middleware.ts          # Client untuk middleware
│   ├── config/
│   │   └── company.ts             # Semua data statis perusahaan (edit di sini)
│   ├── seo/
│   │   └── jsonld.ts              # JSON-LD helpers
│   ├── env.ts                     # Validasi environment variables
│   ├── logger.ts                  # Structured logger
│   └── utils.ts                   # Helper functions (cn, slug, dll)
│
├── types/
│   └── index.ts                   # TypeScript types (Project, dll)
│
├── supabase/
│   └── schema.sql                 # SQL schema (tabel, RLS, storage)
│
├── public/                        # Asset statis (favicon, manifest, dll)
│
├── middleware.ts                  # Proteksi /admin/*, skip untuk Server Action
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example             # Template environment variables
├── DEPLOYMENT.md                  # Panduan deployment ke Vercel
└── CHECKLIST.md                   # Checklist sebelum live
```

---

## Instalasi Lokal

### Prasyarat
- Node.js 18+
- npm
- Akun Supabase (gratis)

### Langkah

**1. Clone dan install dependencies**
```bash
git clone https://github.com/USERNAME/indofa-gemilang.git
cd indofa-gemilang
npm install
```

**2. Setup Supabase**
- Buat project baru di [supabase.com](https://supabase.com)
- Buka SQL Editor → paste isi `supabase/schema.sql` → Run
- Buat user admin: Authentication → Users → Add user (centang Auto Confirm User)
- Pastikan bucket Storage `project-media` sudah ada dan berstatus **Public**

**3. Environment Variables**

Salin `.env.local.example` menjadi `.env.local`, lalu isi dua variable wajib:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

Kedua nilai ini didapat dari Supabase Dashboard → **Project Settings → API**. Pakai **anon/publishable key**, jangan pakai secret key. Tanpa kedua variable ini, aplikasi akan langsung gagal start dengan pesan error yang jelas (lihat `lib/env.ts`).

**4. Jalankan development server**
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

> **Catatan development:** setelah mengedit Server Action (fungsi di `lib/actions/*.ts`) dan menyimpan file, lakukan **hard reload** di browser (klik kanan tombol refresh → *Empty Cache and Hard Reload*) sebelum mencoba fitur terkait. Ini mencegah error "Failed to find Server Action" yang muncul akibat Fast Refresh mengganti ID Server Action di tengah sesi — perilaku normal Next.js dev mode, tidak terjadi di production.

---

## Build Production

```bash
npm run build    # Build production
npm run start    # Jalankan hasil build secara lokal
npm run lint     # Cek ESLint
```

---

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase, format `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon/publishable key Supabase (aman dipakai di browser) |

Validasi otomatis dilakukan saat startup oleh `lib/env.ts` — kalau salah satu variable kosong atau formatnya tidak valid, aplikasi tidak akan jalan dan akan menampilkan pesan error yang jelas di console/log, bukan gagal diam-diam di tengah request.

---

## Edit Konten Perusahaan

Semua data statis perusahaan ada di satu file:

```
lib/config/company.ts
```

Edit file tersebut untuk mengubah: nama dan deskripsi perusahaan, informasi kontak (alamat, telepon, email, WhatsApp, jam operasional), link sosial media, daftar layanan, nilai-nilai perusahaan, data testimoni, dan daftar partner/klien. Tidak perlu menyentuh komponen lain.

---

## Deploy ke Vercel

Lihat panduan lengkap di [DEPLOYMENT.md](./DEPLOYMENT.md) — mencakup setup Supabase, setup Vercel, environment variables, dan proses deployment.

Ringkasan singkat:
1. Push kode ke GitHub
2. Import repo di [vercel.com](https://vercel.com)
3. Isi Environment Variables (sama seperti `.env.local`)
4. Deploy — Vercel otomatis build dan kasih URL live

Setelah deploy, **Vercel Web Analytics** dan **Speed Insights** otomatis aktif tanpa konfigurasi tambahan (lihat `app/layout.tsx`).

---

## Menambah Proyek Baru

1. Login ke `/admin` dengan akun admin yang dibuat di Supabase
2. Klik **Tambah Proyek Baru**
3. Isi form (nama, kategori, deskripsi, lokasi, tahun, foto cover, galeri foto)
4. Klik **Tambah Proyek**

Proyek langsung muncul di halaman portfolio publik.

---

## Dokumen Terkait

- [DEPLOYMENT.md](./DEPLOYMENT.md) — panduan deployment lengkap, setup Supabase & Vercel
- [CHECKLIST.md](./CHECKLIST.md) — checklist verifikasi sebelum website dinyatakan live

---

## Lisensi

Hak cipta © 2026 PT Indofa Gemilang Konstruksi. Semua hak dilindungi.
