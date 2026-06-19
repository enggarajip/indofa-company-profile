import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

/**
 * Gabungkan Tailwind classes dengan aman.
 * Menghindari konflik class seperti `p-4` vs `p-6`.
 *
 * Contoh: cn("p-4 text-blue-500", isActive && "text-red-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate slug dari judul proyek.
 * "Gedung Kantor PT Sinar Mas" → "gedung-kantor-pt-sinar-mas"
 */
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: "id",
    trim: true,
  });
}

/**
 * Format angka tahun — validasi sederhana
 */
export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1990 && year <= currentYear + 2;
}

/**
 * Truncate teks panjang dengan elipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Format URL gambar Supabase Storage menjadi public URL
 */
export function getStorageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/project-media/${path}`;
}
