"use client";

import { useState, useTransition } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContactFormData = {
  name:    string;
  company: string;
  email:   string;
  phone:   string;
  message: string;
};

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

const EMPTY_FORM: ContactFormData = {
  name:    "",
  company: "",
  email:   "",
  phone:   "",
  message: "",
};

const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Nama wajib diisi.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  // Telepon opsional, tapi kalau diisi validasi format dasar
  if (form.phone.trim() && !/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
    errors.phone = "Format nomor telepon tidak valid.";
  }

  if (!form.message.trim()) {
    errors.message = "Pesan wajib diisi.";
  } else if (form.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Pesan minimal ${MIN_MESSAGE_LENGTH} karakter (saat ini ${form.message.trim().length}).`;
  } else if (form.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.`;
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
      <label htmlFor={htmlFor} className="block text-sm font-500 text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(wajib)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle size={11} aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>
      ) : null}
    </div>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full px-4 py-2.5 border rounded-lg text-sm text-neutral-800 bg-white transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand-500/20",
    error
      ? "border-red-400 focus:border-red-500"
      : "border-neutral-200 focus:border-brand-400"
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [form, setForm]               = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [touched, setTouched]         = useState<Set<keyof ContactFormData>>(new Set());
  const [isPending, startTransition]  = useTransition();
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const set = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (touched.has(field)) {
        const newErrors = validateForm(next);
        setErrors((e) => ({ ...e, [field]: newErrors[field] }));
      }
      return next;
    });
  };

  const touch = (field: keyof ContactFormData) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validateForm(form);
    setErrors((e) => ({ ...e, [field]: newErrors[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validateForm(form);
    setErrors(allErrors);
    setTouched(new Set(Object.keys(form) as Array<keyof ContactFormData>));

    if (Object.keys(allErrors).length > 0) {
      setSubmitState("idle");
      const firstErrorKey = Object.keys(allErrors)[0];
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    startTransition(async () => {
      try {
        // Belum terhubung ke database/email service — pesan dicatat di console
        // sebagai placeholder. Ganti blok ini dengan Server Action / API call
        // saat fitur penyimpanan lead sungguhan sudah siap dibangun.
        await new Promise((resolve) => setTimeout(resolve, 900));
        console.info("[ContactForm] Pesan diterima (belum tersimpan ke database):", form);

        setSubmitState("success");
        setForm(EMPTY_FORM);
        setTouched(new Set());
        setErrors({});
      } catch {
        setSubmitState("error");
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (submitState === "success") {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-card">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
          <CheckCircle2 size={28} className="text-green-600" />
        </div>
        <h3 className="text-lg font-display font-600 text-neutral-900 mb-2">
          Pesan Terkirim!
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Terima kasih telah menghubungi kami. Tim kami akan merespons pesan Anda
          dalam waktu maksimal 1 hari kerja.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className="btn-secondary text-sm py-2.5 px-5"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-7 shadow-card">
      <h3 className="text-lg font-display font-600 text-neutral-900 mb-1.5">
        Kirim Pesan
      </h3>
      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
        Isi form di bawah dan tim kami akan menghubungi Anda kembali secepatnya.
      </p>

      {submitState === "error" && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2" role="alert">
          <AlertCircle size={15} className="flex-shrink-0" aria-hidden="true" />
          Gagal mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Lengkap" htmlFor="name" required error={errors.name}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => touch("name")}
              placeholder="Nama Anda"
              className={inputCls(errors.name)}
              disabled={isPending}
              maxLength={100}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>

          <Field label="Perusahaan" htmlFor="company" hint="Opsional">
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Nama perusahaan"
              className={inputCls()}
              disabled={isPending}
              maxLength={150}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" htmlFor="email" required error={errors.email}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => touch("email")}
              placeholder="nama@email.com"
              className={inputCls(errors.email)}
              disabled={isPending}
              maxLength={150}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>

          <Field label="Nomor Telepon" htmlFor="phone" hint={!errors.phone ? "Opsional" : undefined} error={errors.phone}>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={() => touch("phone")}
              placeholder="08xx xxxx xxxx"
              className={inputCls(errors.phone)}
              disabled={isPending}
              maxLength={20}
              aria-invalid={!!errors.phone}
            />
          </Field>
        </div>

        <Field
          label="Pesan"
          htmlFor="message"
          required
          error={errors.message}
          hint={!errors.message ? `${form.message.trim().length}/${MAX_MESSAGE_LENGTH} karakter (minimal ${MIN_MESSAGE_LENGTH})` : undefined}
        >
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => touch("message")}
            placeholder="Ceritakan kebutuhan proyek Anda: jenis bangunan, lokasi, perkiraan luas, dan target waktu pengerjaan."
            className={cn(inputCls(errors.message), "resize-none")}
            rows={5}
            disabled={isPending}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
        </Field>

        <p className="text-xs text-neutral-400">
          <span className="text-red-500" aria-hidden="true">*</span> Wajib diisi
        </p>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className={cn(
            "btn-primary w-full justify-center gap-2",
            isPending && "opacity-70 cursor-not-allowed hover:transform-none hover:shadow-none"
          )}
        >
          {isPending ? (
            <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Mengirim...</>
          ) : (
            <><Send size={16} aria-hidden="true" /> Kirim Pesan</>
          )}
        </button>
      </form>
    </div>
  );
}
