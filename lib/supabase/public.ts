import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client khusus untuk READ data publik (getProjects, getProjectBySlug, dll).
 *
 * BERBEDA dari lib/supabase/server.ts:
 * - TIDAK memanggil cookies() dari next/headers
 * - TIDAK butuh autentikasi (sesuai RLS policy "public read" di schema.sql)
 * - Memungkinkan Next.js merender halaman/sitemap secara statis (SSG/ISR)
 *   alih-alih dipaksa dynamic karena terdeteksi memanggil cookies()
 *
 * Gunakan ini HANYA untuk operasi read yang memang public (tidak perlu tahu
 * siapa user yang login). Untuk create/update/delete yang butuh cek auth,
 * tetap gunakan lib/supabase/server.ts seperti biasa.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
