"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createProject, updateProject } from "@/lib/actions/projects";
import { SingleImageUploader, MultiImageUploader } from "./ImageUploader";
import { Toast, useToast } from "./Toast";
import { generateSlug, cn } from "@/lib/utils";
import { PROJECT_CATEGORIES, EMPTY_PROJECT_FORM } from "@/types";
import type { Project, ProjectFormData } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof ProjectFormData, string>>;

// ─── Validation ───────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const MAPS_PREFIXES = [
  "https://maps.google.com",
  "https://goo.gl",
  "https://maps.app.goo.gl",
  "https://www.google.com/maps",
];

function validateForm(form: ProjectFormData): FormErrors {
  const errors: FormErrors = {};

  // Title
  if (!form.title.trim()) {
    errors.title = "Nama proyek wajib diisi.";
  } else if (form.title.trim().length < 3) {
    errors.title = "Nama proyek minimal 3 karakter.";
  } else if (form.title.trim().length > 255) {
    errors.title = "Nama proyek maksimal 255 karakter.";
  }

  // Category
  if (!form.category) {
    errors.category = "Kategori wajib dipilih.";
  }

  // Slug
  if (form.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) {
    errors.slug = "Slug hanya boleh huruf kecil, angka, dan tanda hubung.";
  }

  // Year
  if (form.year !== "") {
    const y = Number(form.year);
    if (isNaN(y) || !Number.isInteger(y)) {
      errors.year = "Tahun harus berupa angka.";
    } else if (y < 1990 || y > CURRENT_YEAR + 2) {
      errors.year = `Tahun harus antara 1990 dan ${CURRENT_YEAR + 2}.`;
    }
  }

  // Google Maps URL
  if (form.google_maps_url.trim()) {
    const valid = MAPS_PREFIXES.some((p) => form.google_maps_url.trim().startsWith(p));
    if (!valid) {
      errors.google_maps_url = "URL harus dari maps.google.com, goo.gl, atau maps.app.goo.gl.";
    }
  }

  // Description max length
  if (form.description.length > 5000) {
    errors.description = "Deskripsi maksimal 5000 karakter.";
  }

  return errors;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label, htmlFor, required, hint, error, children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="admin-label">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(wajib)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle size={11} aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-400">{hint}</p>
      ) : null}
    </div>
  );
}

// ─── Input className helper ───────────────────────────────────────────────────

function inputCls(error?: string, extra?: string) {
  return cn(
    "admin-input",
    error && "border-red-400 focus:border-red-500 focus:shadow-red-100",
    extra,
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectForm({ project }: { project?: Project }) {
  const router                       = useRouter();
  const isEdit                       = !!project;
  const [isPending, startTransition] = useTransition();
  const { toast, showToast, closeToast } = useToast();
  const [errors, setErrors]          = useState<FormErrors>({});
  const [touched, setTouched]        = useState<Set<keyof ProjectFormData>>(new Set());

  const [form, setForm] = useState<ProjectFormData>(
    project
      ? {
          title:           project.title,
          slug:            project.slug,
          category:        project.category,
          description:     project.description    ?? "",
          location:        project.location        ?? "",
          address:         project.address         ?? "",
          google_maps_url: project.google_maps_url ?? "",
          year:            project.year != null    ? String(project.year) : "",
          duration:        project.duration        ?? "",
          cover_image:     project.cover_image     ?? "",
          gallery_images:  project.gallery_images  ?? [],
        }
      : EMPTY_PROJECT_FORM
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const set = useCallback(
    (field: keyof ProjectFormData, value: ProjectFormData[keyof ProjectFormData]) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        // Re-validate jika field sudah pernah disentuh
        if (touched.has(field)) {
          const newErrors = validateForm(next);
          setErrors((e) => ({ ...e, [field]: newErrors[field] }));
        }
        return next;
      });
    },
    [touched],
  );

  const touch = (field: keyof ProjectFormData) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validateForm(form);
    setErrors((e) => ({ ...e, [field]: newErrors[field] }));
  };

  // Slug: auto-generate dari title saat CREATE
  const [slugManual, setSlugManual] = useState(isEdit);
  const handleTitleChange = (value: string) => {
    set("title", value);
    if (!slugManual) set("slug", generateSlug(value));
  };

  const handleSubmit = () => {
    // Validasi semua field sebelum submit
    const allErrors = validateForm(form);
    setErrors(allErrors);
    // Tandai semua field sebagai touched
    setTouched(new Set(Object.keys(form) as Array<keyof ProjectFormData>));

    if (Object.keys(allErrors).length > 0) {
      showToast("Periksa kembali isian form.", "error");
      // Scroll ke error pertama
      const firstErrorKey = Object.keys(allErrors)[0];
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateProject(project.id, form)
        : await createProject(form);

      if (!result.success) {
        showToast(result.error, "error");
        return;
      }

      showToast(
        isEdit ? "Proyek berhasil diperbarui." : "Proyek berhasil ditambahkan.",
        "success",
      );
      setTimeout(() => router.push("/admin/projects"), 1200);
    });
  };

  const isFormInvalid = !form.title.trim() || !form.category;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/projects"
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Kembali ke daftar proyek"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-700 text-neutral-900">
              {isEdit ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isEdit
                ? `Mengedit: ${project.title}`
                : "Isi form di bawah untuk menambah proyek ke portfolio."}
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {/* ── Informasi Utama ─────────────────────────────────────────────── */}
          <section className="admin-card p-6 space-y-5" aria-labelledby="section-utama">
            <h2 id="section-utama" className="text-sm font-display font-600 text-neutral-700 uppercase tracking-wide">
              Informasi Utama
            </h2>

            <Field label="Nama Proyek" htmlFor="title" required error={errors.title}>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => touch("title")}
                placeholder="Contoh: Gedung Kantor PT Sinar Mas"
                className={inputCls(errors.title)}
                disabled={isPending}
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
                maxLength={255}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Slug (URL)"
                htmlFor="slug"
                hint={!errors.slug ? "Otomatis dari nama proyek. Bisa diubah manual." : undefined}
                error={errors.slug}
              >
                <input
                  id="slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  onBlur={() => touch("slug")}
                  placeholder="gedung-kantor-pt-sinar-mas"
                  className={inputCls(errors.slug, "font-mono text-sm")}
                  disabled={isPending}
                  aria-invalid={!!errors.slug}
                  aria-describedby={errors.slug ? "slug-error" : undefined}
                />
              </Field>

              <Field label="Kategori" htmlFor="category" required error={errors.category}>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as ProjectFormData["category"])}
                  onBlur={() => touch("category")}
                  className={inputCls(errors.category, !form.category ? "text-neutral-400" : "")}
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <option value="" disabled>Pilih kategori</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              label="Deskripsi Proyek"
              htmlFor="description"
              hint={!errors.description ? `${form.description.length}/5000 karakter` : undefined}
              error={errors.description}
            >
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onBlur={() => touch("description")}
                placeholder="Ceritakan detail proyek ini: lingkup pekerjaan, teknologi yang digunakan, dll."
                className={inputCls(errors.description, "resize-none")}
                rows={4}
                disabled={isPending}
                maxLength={5000}
                aria-describedby={errors.description ? "description-error" : undefined}
              />
            </Field>
          </section>

          {/* ── Lokasi ──────────────────────────────────────────────────────── */}
          <section className="admin-card p-6 space-y-5" aria-labelledby="section-lokasi">
            <h2 id="section-lokasi" className="text-sm font-display font-600 text-neutral-700 uppercase tracking-wide">
              Lokasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Kota / Provinsi" htmlFor="location">
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Contoh: Jakarta Selatan"
                  className="admin-input"
                  disabled={isPending}
                  maxLength={100}
                />
              </Field>

              <Field
                label="Link Google Maps"
                htmlFor="google_maps_url"
                hint={!errors.google_maps_url ? "Salin dari maps.google.com atau goo.gl" : undefined}
                error={errors.google_maps_url}
              >
                <input
                  id="google_maps_url"
                  type="url"
                  value={form.google_maps_url}
                  onChange={(e) => set("google_maps_url", e.target.value)}
                  onBlur={() => touch("google_maps_url")}
                  placeholder="https://maps.google.com/..."
                  className={inputCls(errors.google_maps_url)}
                  disabled={isPending}
                  aria-invalid={!!errors.google_maps_url}
                />
              </Field>
            </div>

            <Field label="Alamat Lengkap" htmlFor="address">
              <textarea
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190"
                className="admin-input resize-none"
                rows={2}
                disabled={isPending}
                maxLength={500}
              />
            </Field>
          </section>

          {/* ── Detail Proyek ────────────────────────────────────────────────── */}
          <section className="admin-card p-6 space-y-5" aria-labelledby="section-detail">
            <h2 id="section-detail" className="text-sm font-display font-600 text-neutral-700 uppercase tracking-wide">
              Detail Proyek
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Tahun Selesai"
                htmlFor="year"
                hint={!errors.year ? `Antara 1990 – ${CURRENT_YEAR + 2}` : undefined}
                error={errors.year}
              >
                <input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  onBlur={() => touch("year")}
                  placeholder={String(CURRENT_YEAR)}
                  min={1990}
                  max={CURRENT_YEAR + 2}
                  className={inputCls(errors.year)}
                  disabled={isPending}
                  aria-invalid={!!errors.year}
                />
              </Field>

              <Field
                label="Durasi Pengerjaan"
                htmlFor="duration"
                hint="Format bebas, contoh: 8 Bulan, 1 Tahun 3 Bulan"
              >
                <input
                  id="duration"
                  type="text"
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="Contoh: 14 Bulan"
                  className="admin-input"
                  disabled={isPending}
                  maxLength={50}
                />
              </Field>
            </div>
          </section>

          {/* ── Foto ─────────────────────────────────────────────────────────── */}
          <section className="admin-card p-6 space-y-6" aria-labelledby="section-foto">
            <h2 id="section-foto" className="text-sm font-display font-600 text-neutral-700 uppercase tracking-wide">
              Foto Proyek
            </h2>

            <SingleImageUploader
              projectId={project?.id ?? "new"}
              currentPath={form.cover_image}
              onChange={(path) => set("cover_image", path)}
              onError={(msg) => showToast(msg, "error")}
              label="Foto Cover (Utama)"
            />

            <div className="border-t border-neutral-100 pt-5">
              <MultiImageUploader
                projectId={project?.id ?? "new"}
                currentPaths={form.gallery_images}
                onChange={(paths) => set("gallery_images", paths)}
                onError={(msg) => showToast(msg, "error")}
              />
            </div>
          </section>

          {/* ── Required field notice ─────────────────────────────────────── */}
          <p className="text-xs text-neutral-400 px-1">
            <span className="text-red-500" aria-hidden="true">*</span> Wajib diisi
          </p>

          {/* ── Submit ──────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pb-8">
            <Link
              href="/admin/projects"
              className="px-4 py-2.5 text-sm font-500 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Batal
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || isFormInvalid}
              aria-disabled={isPending || isFormInvalid}
              aria-busy={isPending}
              className={cn(
                "btn-primary gap-2",
                (isPending || isFormInvalid) && "opacity-60 cursor-not-allowed hover:transform-none hover:shadow-none",
              )}
            >
              {isPending ? (
                <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Menyimpan...</>
              ) : (
                <><Save size={16} aria-hidden="true" /> {isEdit ? "Simpan Perubahan" : "Tambah Proyek"}</>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
