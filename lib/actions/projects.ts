"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateSlug, isValidYear } from "@/lib/utils";
import type {
  Project,
  ProjectFormData,
  ProjectCategory,
  ActionResult,
} from "@/types";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const TABLE = "projects" as const;

// Kolom yang di-SELECT — eksplisit agar tidak ada kolom tak terduga
const SELECT_COLUMNS = `
  id,
  title,
  slug,
  category,
  description,
  location,
  address,
  google_maps_url,
  year,
  duration,
  cover_image,
  gallery_images,
  created_at,
  updated_at
`.trim();

// ─── Tipe Internal ────────────────────────────────────────────────────────────

/**
 * Data yang dikirim ke Supabase saat INSERT / UPDATE.
 * Berbeda dari ProjectFormData (semua string) — ini sudah dikonversi
 * ke tipe yang tepat sesuai kolom database.
 */
type ProjectPayload = {
  title:           string;
  slug:            string;
  category:        ProjectCategory;
  description:     string | null;
  location:        string | null;
  address:         string | null;
  google_maps_url: string | null;
  year:            number | null;
  duration:        string | null;
  cover_image:     string | null;
  gallery_images:  string[];
};

// ─── Helper: Validasi Form ────────────────────────────────────────────────────

/**
 * Validasi semua field form sebelum dikirim ke database.
 * Mengembalikan pesan error pertama yang ditemukan, atau null jika valid.
 */
function validateForm(data: ProjectFormData): string | null {
  // Title wajib, minimal 3 karakter
  if (!data.title.trim()) {
    return "Nama proyek tidak boleh kosong.";
  }
  if (data.title.trim().length < 3) {
    return "Nama proyek minimal 3 karakter.";
  }
  if (data.title.trim().length > 255) {
    return "Nama proyek maksimal 255 karakter.";
  }

  // Kategori wajib diisi
  if (!data.category) {
    return "Kategori proyek harus dipilih.";
  }

  // Tahun: opsional, tapi kalau diisi harus valid
  if (data.year !== "") {
    const yearNum = Number(data.year);
    if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
      return "Tahun harus berupa angka.";
    }
    if (!isValidYear(yearNum)) {
      return `Tahun tidak valid. Harus antara 1990 dan ${new Date().getFullYear() + 2}.`;
    }
  }

  // Google Maps URL: opsional, tapi kalau diisi harus diawali domain yang benar
  if (data.google_maps_url.trim()) {
    const validPrefixes = [
      "https://maps.google.com",
      "https://goo.gl",
      "https://maps.app.goo.gl",
    ];
    const isValidUrl = validPrefixes.some((prefix) =>
      data.google_maps_url.trim().startsWith(prefix)
    );
    if (!isValidUrl) {
      return "URL Google Maps tidak valid. Harus diawali dengan maps.google.com, goo.gl, atau maps.app.goo.gl.";
    }
  }

  return null;
}

// ─── Helper: Konversi Form → Payload ─────────────────────────────────────────

/**
 * Mengubah ProjectFormData (semua string, dari <input>)
 * menjadi ProjectPayload (tipe tepat, siap masuk database).
 *
 * - String kosong → null untuk field opsional
 * - year string → number | null
 * - Slug di-generate otomatis dari title jika kosong
 */
function formToPayload(data: ProjectFormData): ProjectPayload {
  const slug = data.slug.trim()
    ? data.slug.trim()
    : generateSlug(data.title.trim());

  return {
    title:           data.title.trim(),
    slug,
    category:        data.category as ProjectCategory,
    description:     data.description.trim()     || null,
    location:        data.location.trim()         || null,
    address:         data.address.trim()           || null,
    google_maps_url: data.google_maps_url.trim()  || null,
    year:            data.year !== ""             ? Number(data.year) : null,
    duration:        data.duration.trim()          || null,
    cover_image:     data.cover_image.trim()       || null,
    gallery_images:  data.gallery_images,
  };
}

// ─── Helper: Parse Error Supabase ─────────────────────────────────────────────

/**
 * Mengubah error mentah dari Supabase menjadi pesan yang bisa
 * ditampilkan ke pengguna, tanpa mengekspos detail teknis.
 */
function parseSupabaseError(error: { code?: string; message?: string }): string {
  // Slug duplikat (unique constraint)
  if (error.code === "23505") {
    if (error.message?.includes("slug")) {
      return "Slug sudah digunakan oleh proyek lain. Ubah nama proyek atau masukkan slug manual.";
    }
    return "Data duplikat. Periksa kembali input Anda.";
  }

  // Constraint violation (enum, check constraint)
  if (error.code === "23514") {
    return "Nilai tidak valid. Pastikan kategori, tahun, dan URL sudah benar.";
  }

  // Enum violation
  if (error.code === "22P02") {
    return "Kategori yang dipilih tidak valid.";
  }

  // RLS: tidak punya izin
  if (error.code === "42501") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini. Pastikan sudah login.";
  }

  // Foreign key / reference error
  if (error.code === "23503") {
    return "Data referensi tidak ditemukan.";
  }

  // Fallback: sembunyikan detail teknis dari pengguna
  return "Terjadi kesalahan pada server. Silakan coba lagi.";
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ACTIONS — bisa dipakai dari Server Component maupun Client Component
// ═══════════════════════════════════════════════════════════════════════════════

// ─── getProjects ──────────────────────────────────────────────────────────────

export type GetProjectsOptions = {
  /** Filter berdasarkan kategori */
  category?: ProjectCategory;
  /** Hanya ambil proyek yang memiliki cover image (untuk public website) */
  withCoverOnly?: boolean;
  /** Urutan hasil: terbaru atau terlama */
  orderBy?: "created_at_desc" | "created_at_asc" | "year_desc" | "year_asc";
  /** Batasi jumlah hasil (default: semua) */
  limit?: number;
};

/**
 * Ambil daftar semua proyek.
 *
 * Digunakan di:
 * - Halaman /portfolio (public) — tampilkan semua
 * - Admin dashboard — tampilkan semua untuk pengelolaan
 *
 * @example
 * // Semua proyek, terbaru dulu
 * const result = await getProjects();
 *
 * @example
 * // Filter kategori, limit 6 (untuk section di beranda)
 * const result = await getProjects({ category: "Jembatan", limit: 6 });
 */
export async function getProjects(
  options: GetProjectsOptions = {}
): Promise<ActionResult<Project[]>> {
  const {
    category,
    withCoverOnly = false,
    orderBy = "created_at_desc",
    limit,
  } = options;

  try {
    const supabase = await createClient();

    let query = supabase
      .from(TABLE)
      .select(SELECT_COLUMNS);

    // Filter kategori
    if (category) {
      query = query.eq("category", category);
    }

    // Hanya proyek yang punya foto cover
    if (withCoverOnly) {
      query = query.not("cover_image", "is", null).neq("cover_image", "");
    }

    // Urutan
    switch (orderBy) {
      case "created_at_asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "year_desc":
        query = query.order("year", { ascending: false, nullsFirst: false });
        break;
      case "year_asc":
        query = query.order("year", { ascending: true, nullsFirst: false });
        break;
      case "created_at_desc":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Limit
    if (limit !== undefined && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getProjects] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    return { success: true, data: (data ?? []) as unknown as Project[] };
  } catch (err) {
    console.error("[getProjects] Unexpected error:", err);
    return { success: false, error: "Gagal memuat daftar proyek." };
  }
}

// ─── getProjectBySlug ─────────────────────────────────────────────────────────

/**
 * Ambil satu proyek berdasarkan slug-nya.
 *
 * Digunakan di:
 * - Halaman /portfolio/[slug] (public)
 * - Halaman /admin/projects/[id]/edit (admin)
 *
 * @example
 * const result = await getProjectBySlug("gedung-kantor-pt-maju-bersama");
 * if (result.success) {
 *   console.log(result.data.title);
 * }
 */
export async function getProjectBySlug(
  slug: string
): Promise<ActionResult<Project>> {
  if (!slug || !slug.trim()) {
    return { success: false, error: "Slug tidak boleh kosong." };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq("slug", slug.trim())
      .single();

    if (error) {
      // PGRST116 = row tidak ditemukan (PostgREST error untuk .single())
      if (error.code === "PGRST116") {
        return { success: false, error: "Proyek tidak ditemukan." };
      }
      console.error("[getProjectBySlug] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    if (!data) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    return { success: true, data: data as unknown as Project };
  } catch (err) {
    console.error("[getProjectBySlug] Unexpected error:", err);
    return { success: false, error: "Gagal memuat proyek." };
  }
}

// ─── getProjectById ───────────────────────────────────────────────────────────

/**
 * Ambil satu proyek berdasarkan ID-nya.
 *
 * Digunakan di:
 * - Admin edit form — lebih andal dari slug karena ID tidak berubah
 *
 * @example
 * const result = await getProjectById("uuid-string-here");
 */
export async function getProjectById(
  id: string
): Promise<ActionResult<Project>> {
  if (!id || !id.trim()) {
    return { success: false, error: "ID proyek tidak boleh kosong." };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq("id", id.trim())
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Proyek tidak ditemukan." };
      }
      console.error("[getProjectById] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    if (!data) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    return { success: true, data: data as unknown as Project };
  } catch (err) {
    console.error("[getProjectById] Unexpected error:", err);
    return { success: false, error: "Gagal memuat proyek." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ACTIONS — memerlukan sesi login (dijaga oleh middleware + RLS)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── createProject ────────────────────────────────────────────────────────────

/**
 * Tambah proyek baru ke database.
 *
 * Flow:
 * 1. Validasi form di server
 * 2. Konversi form data ke payload database
 * 3. Cek slug tidak duplikat (jika slug di-generate otomatis)
 * 4. INSERT ke database
 * 5. Revalidate cache halaman portfolio
 *
 * @example
 * const result = await createProject(formData);
 * if (result.success) {
 *   redirect(`/admin/projects`);
 * }
 */
export async function createProject(
  formData: ProjectFormData
): Promise<ActionResult<Project>> {
  // 1. Validasi
  const validationError = validateForm(formData);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createClient();

    // Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Anda harus login untuk menambah proyek." };
    }

    // 2. Konversi form → payload
    const payload = formToPayload(formData);

    // 3. Cek apakah slug sudah dipakai
    const { data: existing } = await supabase
      .from(TABLE)
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existing) {
      // Slug sudah ada — generate ulang dengan timestamp
      payload.slug = `${payload.slug}-${Date.now()}`;
    }

    // 4. Insert
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      console.error("[createProject] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    if (!data) {
      return { success: false, error: "Proyek berhasil dibuat tapi data tidak bisa dimuat kembali." };
    }

    // 5. Revalidate cache
    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: data as unknown as Project };
  } catch (err) {
    console.error("[createProject] Unexpected error:", err);
    return { success: false, error: "Gagal menyimpan proyek. Silakan coba lagi." };
  }
}

// ─── updateProject ────────────────────────────────────────────────────────────

/**
 * Update proyek yang sudah ada.
 *
 * Flow:
 * 1. Validasi ID dan form
 * 2. Cek proyek benar-benar ada
 * 3. Cek slug baru tidak konflik dengan proyek LAIN
 * 4. UPDATE database
 * 5. Revalidate cache halaman yang terpengaruh
 *
 * @example
 * const result = await updateProject("uuid-here", formData);
 */
export async function updateProject(
  id: string,
  formData: ProjectFormData
): Promise<ActionResult<Project>> {
  // Validasi ID
  if (!id || !id.trim()) {
    return { success: false, error: "ID proyek tidak valid." };
  }

  // Validasi form
  const validationError = validateForm(formData);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createClient();

    // Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Anda harus login untuk mengubah proyek." };
    }

    // Ambil data proyek lama (untuk revalidate slug lama)
    const { data: existingProject, error: fetchError } = await supabase
      .from(TABLE)
      .select("id, slug")
      .eq("id", id)
      .single();

    if (fetchError || !existingProject) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    // Konversi form → payload
    const payload = formToPayload(formData);

    // Cek slug konflik dengan proyek LAIN (bukan diri sendiri)
    if (payload.slug !== existingProject.slug) {
      const { data: slugConflict } = await supabase
        .from(TABLE)
        .select("id")
        .eq("slug", payload.slug)
        .neq("id", id)           // kecualikan diri sendiri
        .maybeSingle();

      if (slugConflict) {
        return {
          success: false,
          error: `Slug "${payload.slug}" sudah digunakan proyek lain.`,
        };
      }
    }

    // Update
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      console.error("[updateProject] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    if (!data) {
      return { success: false, error: "Update berhasil tapi data tidak bisa dimuat kembali." };
    }

    // Revalidate cache — termasuk slug lama dan baru
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${existingProject.slug}`);
    revalidatePath(`/portfolio/${payload.slug}`);
    revalidatePath("/");
    revalidatePath(`/admin/projects`);
    revalidatePath(`/admin/projects/${id}/edit`);

    return { success: true, data: data as unknown as Project };
  } catch (err) {
    console.error("[updateProject] Unexpected error:", err);
    return { success: false, error: "Gagal mengupdate proyek. Silakan coba lagi." };
  }
}

// ─── deleteProject ────────────────────────────────────────────────────────────

/**
 * Hapus proyek dari database.
 *
 * PERHATIAN: File foto di Storage TIDAK otomatis terhapus.
 * Gunakan deleteProjectWithMedia() jika ingin menghapus foto sekaligus.
 *
 * @example
 * const result = await deleteProject("uuid-here");
 */
export async function deleteProject(
  id: string
): Promise<ActionResult<{ deletedId: string }>> {
  if (!id || !id.trim()) {
    return { success: false, error: "ID proyek tidak valid." };
  }

  try {
    const supabase = await createClient();

    // Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Anda harus login untuk menghapus proyek." };
    }

    // Ambil slug dulu untuk revalidate cache setelah delete
    const { data: project, error: fetchError } = await supabase
      .from(TABLE)
      .select("id, slug")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    // Hapus dari database
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteProject] Supabase error:", error);
      return { success: false, error: parseSupabaseError(error) };
    }

    // Revalidate cache
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: { deletedId: id } };
  } catch (err) {
    console.error("[deleteProject] Unexpected error:", err);
    return { success: false, error: "Gagal menghapus proyek. Silakan coba lagi." };
  }
}

// ─── deleteProjectWithMedia ───────────────────────────────────────────────────

/**
 * Hapus proyek beserta seluruh foto di Supabase Storage.
 *
 * Flow:
 * 1. Ambil daftar semua path foto (cover + gallery)
 * 2. Hapus file dari Storage
 * 3. Hapus row dari database
 *
 * Jika penghapusan Storage gagal sebagian, tetap lanjut hapus database
 * (foto yatim bisa dibersihkan manual via Supabase dashboard).
 *
 * @example
 * const result = await deleteProjectWithMedia("uuid-here");
 */
export async function deleteProjectWithMedia(
  id: string
): Promise<ActionResult<{ deletedId: string; deletedFiles: number }>> {
  if (!id || !id.trim()) {
    return { success: false, error: "ID proyek tidak valid." };
  }

  try {
    const supabase = await createClient();

    // Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Anda harus login untuk menghapus proyek." };
    }

    // Ambil data proyek (termasuk path foto)
    const { data: project, error: fetchError } = await supabase
      .from(TABLE)
      .select("id, slug, cover_image, gallery_images")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    // Kumpulkan semua path file yang perlu dihapus
    const filePaths: string[] = [];
    if (project.cover_image) filePaths.push(project.cover_image);
    if (Array.isArray(project.gallery_images)) {
      filePaths.push(...project.gallery_images.filter(Boolean));
    }

    // Hapus file dari Storage (best-effort — lanjut walau ada yang gagal)
    let deletedFiles = 0;
    if (filePaths.length > 0) {
      const { data: removedFiles, error: storageError } = await supabase.storage
        .from("project-media")
        .remove(filePaths);

      if (storageError) {
        console.warn("[deleteProjectWithMedia] Storage error (non-fatal):", storageError);
      } else {
        deletedFiles = removedFiles?.length ?? 0;
      }
    }

    // Hapus dari database
    const { error: deleteError } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[deleteProjectWithMedia] DB delete error:", deleteError);
      return { success: false, error: parseSupabaseError(deleteError) };
    }

    // Revalidate cache
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: { deletedId: id, deletedFiles } };
  } catch (err) {
    console.error("[deleteProjectWithMedia] Unexpected error:", err);
    return { success: false, error: "Gagal menghapus proyek. Silakan coba lagi." };
  }
}

// ─── uploadProjectImage ───────────────────────────────────────────────────────

/**
 * Upload satu file gambar ke Supabase Storage.
 * Mengembalikan path Storage (bukan full URL) untuk disimpan ke database.
 *
 * Struktur path: projects/{projectId}/{timestamp}-{filename}
 *
 * @example
 * const result = await uploadProjectImage(file, projectId);
 * if (result.success) {
 *   // Simpan result.data.path ke cover_image atau gallery_images
 *   console.log(result.data.path);   // "projects/uuid/1234567890-foto.jpg"
 *   console.log(result.data.url);    // full public URL
 * }
 */
export async function uploadProjectImage(
  file: File,
  projectId: string
): Promise<ActionResult<{ path: string; url: string }>> {
  if (!file) {
    return { success: false, error: "File tidak ditemukan." };
  }
  if (!projectId) {
    return { success: false, error: "ID proyek tidak valid." };
  }

  // Validasi tipe file
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." };
  }

  // Validasi ukuran: maksimal 10 MB
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { success: false, error: "Ukuran file terlalu besar. Maksimal 10 MB." };
  }

  try {
    const supabase = await createClient();

    // Pastikan user sudah login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Anda harus login untuk upload foto." };
    }

    // Buat nama file unik dengan timestamp agar tidak collision
    const fileExt  = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")              // hapus ekstensi
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")            // karakter non-alphanumeric → "-"
      .replace(/-+/g, "-")                   // hapus double "-"
      .slice(0, 50);                          // batasi panjang nama

    const timestamp = Date.now();
    const fileName  = `${timestamp}-${safeName}.${fileExt}`;
    const filePath  = `projects/${projectId}/${fileName}`;

    // Upload ke Storage
    const { error: uploadError } = await supabase.storage
      .from("project-media")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,          // jangan overwrite file yang sudah ada
      });

    if (uploadError) {
      console.error("[uploadProjectImage] Upload error:", uploadError);
      return { success: false, error: "Gagal upload foto. Silakan coba lagi." };
    }

    // Ambil public URL
    const { data: urlData } = supabase.storage
      .from("project-media")
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        path: filePath,
        url:  urlData.publicUrl,
      },
    };
  } catch (err) {
    console.error("[uploadProjectImage] Unexpected error:", err);
    return { success: false, error: "Gagal upload foto." };
  }
}
