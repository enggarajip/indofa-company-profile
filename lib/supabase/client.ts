import { createBrowserClient } from "@supabase/ssr";

/**
 * Digunakan di Client Components ("use client").
 * Buat satu kali dan reuse — jangan panggil di setiap render.
 *
 * Env yang harus diisi di .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
