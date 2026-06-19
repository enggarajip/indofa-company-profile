// ===========================================================================
// types/index.ts
// Satu-satunya sumber tipe untuk seluruh project.
// Semua nama kolom sesuai persis dengan schema.sql di Supabase.
// ===========================================================================


// ---------------------------------------------------------------------------
// ProjectCategory
// Sesuai dengan CREATE TYPE project_category AS ENUM (...) di schema.sql
// ---------------------------------------------------------------------------

export type ProjectCategory =
  | "Gedung Komersial"
  | "Gedung Pemerintahan"
  | "Perumahan"
  | "Infrastruktur Jalan"
  | "Jembatan"
  | "Fasilitas Industri"
  | "Renovasi"
  | "Lainnya";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Gedung Komersial",
  "Gedung Pemerintahan",
  "Perumahan",
  "Infrastruktur Jalan",
  "Jembatan",
  "Fasilitas Industri",
  "Renovasi",
  "Lainnya",
];


// ---------------------------------------------------------------------------
// Project
// Cerminan persis kolom tabel projects di Supabase.
// Kolom yang dihapus dari versi lama:
//   - category_id    (diganti: category langsung sebagai enum)
//   - client_name    (tidak ada di schema.sql)
//   - is_featured    (tidak ada di schema.sql)
//   - sort_order     (tidak ada di schema.sql)
//   - cover_image_url (diganti: cover_image sebagai path Storage)
// ---------------------------------------------------------------------------

export type Project = {
  id:               string;          // uuid, PRIMARY KEY
  title:            string;          // TEXT NOT NULL
  slug:             string;          // TEXT NOT NULL UNIQUE
  category:         ProjectCategory; // project_category ENUM NOT NULL
  description:      string | null;   // TEXT
  location:         string | null;   // TEXT — kota/provinsi
  address:          string | null;   // TEXT — alamat lengkap
  google_maps_url:  string | null;   // TEXT
  year:             number | null;   // SMALLINT
  duration:         string | null;   // TEXT — "8 Bulan", dll
  cover_image:      string | null;   // TEXT — path di Storage
  gallery_images:   string[];        // TEXT[] NOT NULL DEFAULT '{}'
  created_at:       string;          // TIMESTAMPTZ NOT NULL
  updated_at:       string;          // TIMESTAMPTZ NOT NULL
};


// ---------------------------------------------------------------------------
// ProjectFormData
// Dipakai di form admin (create & edit).
// Semua field bertipe string karena berasal dari <input> HTML.
// Konversi ke tipe database dilakukan di formToPayload() dalam projects.ts.
// ---------------------------------------------------------------------------

export type ProjectFormData = {
  title:            string;
  slug:             string;
  category:         ProjectCategory | "";
  description:      string;
  location:         string;
  address:          string;
  google_maps_url:  string;
  year:             string;          // string dari <input type="number">
  duration:         string;
  cover_image:      string;          // path Storage, diisi setelah upload
  gallery_images:   string[];        // array path Storage, diisi setelah upload
};

export const EMPTY_PROJECT_FORM: ProjectFormData = {
  title:            "",
  slug:             "",
  category:         "",
  description:      "",
  location:         "",
  address:          "",
  google_maps_url:  "",
  year:             String(new Date().getFullYear()),
  duration:         "",
  cover_image:      "",
  gallery_images:   [],
};


// ---------------------------------------------------------------------------
// ActionResult<T>
// Return type konsisten untuk semua server actions.
// Penggunaan: if (result.success) { result.data } else { result.error }
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { success: true;  data: T }
  | { success: false; error: string };


// ---------------------------------------------------------------------------
// NavItem
// Untuk navigasi sidebar admin dan navbar publik.
// ---------------------------------------------------------------------------

export type NavItem = {
  label: string;
  href:  string;
};
