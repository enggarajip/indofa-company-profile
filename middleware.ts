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

  // ── Proteksi halaman admin ────────────────────────────────────────────────
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
