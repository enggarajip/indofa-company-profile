import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  // Refresh session Supabase — SELALU jalankan ini
  const supabase = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Deteksi Server Action request ───────────────────────────────────────
  // Next.js mengirim Server Action sebagai POST ke URL halaman pemanggilnya
  // sendiri (bukan ke URL terpisah), dan selalu menyertakan header `Next-Action`.
  // Kalau middleware me-redirect request ini seperti navigasi biasa, client
  // menerima response redirect padahal mengharapkan RSC action payload —
  // promise di client akan resolve menjadi `undefined`, BUKAN error yang jelas.
  // Ini akar penyebab "Cannot read properties of undefined (reading 'success')"
  // yang muncul acak di getProjects/uploadProjectImage/createProject.
  //
  // Proteksi auth untuk Server Action TETAP aman karena setiap fungsi di
  // lib/actions/*.ts sudah mengecek `auth.getUser()` sendiri dan akan
  // mengembalikan { success: false, error: "harus login" } jika sesi tidak ada.
  const isServerAction = request.headers.has("Next-Action");

  if (isServerAction) {
    return response;
  }

  // ── Proteksi halaman admin (hanya untuk navigasi/page request biasa) ────
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/login";

  if (isAdminRoute && !user) {
    // Belum login → arahkan ke halaman login
    const loginUrl = new URL("/login", request.url);
    // Simpan halaman tujuan agar setelah login bisa redirect balik
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && user) {
    // Sudah login tapi buka halaman login → langsung ke dashboard
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

// Jalankan middleware di semua route kecuali asset statis
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
