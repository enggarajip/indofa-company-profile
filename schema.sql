-- ============================================================
--  PT INDOFA GEMILANG KONSTRUKSI — Supabase Schema
--  Jalankan file ini secara berurutan di SQL Editor Supabase
-- ============================================================


-- ─── EXTENSION ───────────────────────────────────────────────────────────────
-- pgcrypto diperlukan untuk gen_random_uuid()
-- (sudah aktif by default di Supabase, tapi di-enable eksplisit untuk keamanan)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── ENUM: KATEGORI PROYEK ────────────────────────────────────────────────────
-- Menggunakan ENUM agar nilai kategori konsisten dan tidak bisa typo
CREATE TYPE project_category AS ENUM (
  'Gedung Komersial',
  'Gedung Pemerintahan',
  'Perumahan',
  'Infrastruktur Jalan',
  'Jembatan',
  'Fasilitas Industri',
  'Renovasi',
  'Lainnya'
);


-- ─── ENUM: SERVICE TYPE (PERAN PERUSAHAAN DI PROYEK) ──────────────────────────
-- Berbeda dari category (jenis bangunan) — ini menjelaskan peran PT Indofa
-- Gemilang Konstruksi pada proyek tersebut: sebagai Kontraktor saja, sebagai
-- Kontraktor & Konsultan, atau sebagai penyedia jasa Maintenance Gedung.
CREATE TYPE service_type AS ENUM (
  'Kontraktor',
  'Kontraktor & Konsultan',
  'Maintenance Gedung'
);


-- ─── TABLE: PROJECTS ─────────────────────────────────────────────────────────
CREATE TABLE projects (
  -- Primary key
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Konten utama
  title           TEXT          NOT NULL CHECK (char_length(title) BETWEEN 3 AND 255),
  slug            TEXT          NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category        project_category NOT NULL,
  service_type    service_type,                  -- Nullable: proyek lama belum punya nilai ini
  description     TEXT,

  -- Lokasi
  location        TEXT,                          -- Kota / Provinsi (contoh: "Jakarta Selatan")
  address         TEXT,                          -- Alamat lengkap
  google_maps_url TEXT          CHECK (
                    google_maps_url IS NULL
                    OR google_maps_url ~ '^https://(maps\.google\.com|goo\.gl|maps\.app\.goo\.gl)'
                  ),

  -- Detail proyek
  year            SMALLINT      CHECK (year BETWEEN 1990 AND 2100),
  duration        TEXT,                          -- Bebas: "8 Bulan", "1 Tahun 3 Bulan", dll

  -- Media
  cover_image     TEXT,                          -- Path di Storage: "projects/{id}/cover.jpg"
  gallery_images  TEXT[]        NOT NULL DEFAULT '{}',
                                                 -- Array path: ["projects/{id}/1.jpg", ...]

  -- Timestamps
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Komentar tabel dan kolom (muncul di Supabase Table Editor)
COMMENT ON TABLE  projects                IS 'Daftar proyek PT Indofa Gemilang Konstruksi';
COMMENT ON COLUMN projects.slug           IS 'URL-friendly identifier, auto-generate dari title';
COMMENT ON COLUMN projects.service_type   IS 'Peran perusahaan di proyek: Kontraktor, Kontraktor & Konsultan, atau Maintenance Gedung';
COMMENT ON COLUMN projects.cover_image    IS 'Path relatif di Supabase Storage bucket project-media';
COMMENT ON COLUMN projects.gallery_images IS 'Array path foto galeri di Supabase Storage';
COMMENT ON COLUMN projects.duration       IS 'Durasi proyek dalam format bebas, contoh: 8 Bulan';
COMMENT ON COLUMN projects.google_maps_url IS 'Link Google Maps lokasi proyek';


-- ─── INDEX ────────────────────────────────────────────────────────────────────
-- Index untuk query yang sering dipakai di public website
CREATE INDEX idx_projects_slug         ON projects (slug);
CREATE INDEX idx_projects_category     ON projects (category);
CREATE INDEX idx_projects_service_type ON projects (service_type);
CREATE INDEX idx_projects_year         ON projects (year DESC);
CREATE INDEX idx_projects_created_at   ON projects (created_at DESC);


-- ─── TRIGGER: AUTO-UPDATE updated_at ─────────────────────────────────────────
-- Setiap kali row di-UPDATE, kolom updated_at otomatis diisi NOW()
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────
-- Buat bucket untuk menyimpan semua media proyek
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  true,                                          -- Public: URL foto bisa diakses tanpa login
  10485760,                                      -- Max 10 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp'] -- Hanya gambar
)
ON CONFLICT (id) DO NOTHING;


-- ─── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────────
-- RLS adalah lapisan keamanan di level database.
-- Bahkan kalau ada bug di kode Next.js, data tetap aman.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Siapa saja (termasuk pengunjung) bisa READ semua proyek
CREATE POLICY "projects: public read"
  ON projects
  FOR SELECT
  USING (true);

-- POLICY 2: Hanya user yang sudah login (admin) yang bisa INSERT
CREATE POLICY "projects: admin insert"
  ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- POLICY 3: Hanya user yang sudah login yang bisa UPDATE
CREATE POLICY "projects: admin update"
  ON projects
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- POLICY 4: Hanya user yang sudah login yang bisa DELETE
CREATE POLICY "projects: admin delete"
  ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- ─── STORAGE POLICIES ─────────────────────────────────────────────────────────
-- Atur siapa yang boleh baca/tulis file di Storage bucket

-- Semua orang bisa melihat/mengakses foto (public read)
CREATE POLICY "storage: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-media');

-- Hanya admin (authenticated) yang bisa upload file baru
CREATE POLICY "storage: admin upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

-- Hanya admin yang bisa update/replace file
CREATE POLICY "storage: admin update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

-- Hanya admin yang bisa hapus file
CREATE POLICY "storage: admin delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );


-- ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
-- Data contoh untuk testing. Hapus sebelum production jika tidak diperlukan.

INSERT INTO projects (
  title, slug, category, service_type, description,
  location, address, google_maps_url,
  year, duration,
  cover_image, gallery_images
) VALUES
(
  'Gedung Kantor PT Maju Bersama',
  'gedung-kantor-pt-maju-bersama',
  'Gedung Komersial',
  'Kontraktor & Konsultan',
  'Pembangunan gedung kantor 8 lantai dengan standar bangunan hijau (green building). Dilengkapi dengan sistem HVAC modern, panel surya, dan sistem pengolahan air hujan.',
  'Jakarta Selatan',
  'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190',
  'https://maps.google.com/?q=-6.2088,106.8456',
  2023,
  '14 Bulan',
  '',
  '{}'
),
(
  'Jembatan Sungai Ciliwung Segmen 4',
  'jembatan-sungai-ciliwung-segmen-4',
  'Jembatan',
  'Kontraktor',
  'Pembangunan jembatan beton bertulang sepanjang 120 meter dengan kapasitas beban 40 ton. Proyek ini merupakan bagian dari program normalisasi Sungai Ciliwung.',
  'Depok, Jawa Barat',
  'Jl. Margonda Raya, Depok, Jawa Barat 16424',
  'https://maps.google.com/?q=-6.4025,106.7942',
  2022,
  '10 Bulan',
  '',
  '{}'
),
(
  'Perumahan Grand Residence Bogor',
  'perumahan-grand-residence-bogor',
  'Perumahan',
  'Kontraktor',
  'Pengembangan kawasan perumahan seluas 12 hektar dengan 240 unit hunian. Fasilitas lengkap termasuk clubhouse, kolam renang, dan area komersial.',
  'Bogor, Jawa Barat',
  'Jl. Pajajaran No. 88, Bogor, Jawa Barat 16144',
  'https://maps.google.com/?q=-6.5971,106.7960',
  2024,
  '24 Bulan',
  '',
  '{}'
);


-- ─── VERIFIKASI ───────────────────────────────────────────────────────────────
-- Jalankan query ini setelah setup untuk memastikan semuanya berhasil

-- Cek tabel dan data
SELECT
  id,
  title,
  category,
  year,
  created_at
FROM projects
ORDER BY created_at DESC;

-- Cek RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'projects';


-- ============================================================
--  MIGRATION — STEP 11-3: Service Type Upgrade
--  HANYA jalankan blok ini jika tabel projects SUDAH ADA
--  sebelumnya (database production yang sudah berjalan).
--  Jika baru setup dari nol, blok di atas sudah mencakup ini,
--  jadi blok migration ini boleh dilewati / aman dijalankan dua kali.
-- ============================================================

-- 1. Buat ENUM service_type jika belum ada (aman dijalankan ulang)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
    CREATE TYPE service_type AS ENUM (
      'Kontraktor',
      'Kontraktor & Konsultan',
      'Maintenance Gedung'
    );
  END IF;
END $$;

-- 2. Tambah kolom service_type ke tabel yang sudah ada (nullable —
--    proyek lama otomatis bernilai NULL, TIDAK menyebabkan error)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS service_type service_type;

COMMENT ON COLUMN projects.service_type
  IS 'Peran perusahaan di proyek: Kontraktor, Kontraktor & Konsultan, atau Maintenance Gedung';

-- 3. Tambah index untuk filter di halaman /portfolio
CREATE INDEX IF NOT EXISTS idx_projects_service_type ON projects (service_type);

-- 4. Verifikasi: proyek lama harus tetap muncul dengan service_type = NULL,
--    bukan error atau row hilang.
SELECT id, title, category, service_type, created_at
FROM projects
ORDER BY created_at DESC;
