"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(
  formData: FormData
): Promise<{ error: string } | never> {
  const email      = ((formData.get("email")       as string) ?? "").trim();
  const password   = ((formData.get("password")    as string) ?? "").trim();
  const redirectTo = ((formData.get("redirectTo")  as string) ?? "").trim();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Email atau password salah." };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Akun belum dikonfirmasi. Hubungi administrator." };
    }
    return { error: "Login gagal. Silakan coba lagi." };
  }

  // Redirect ke halaman tujuan asli (jika ada dari middleware), fallback ke /admin.
  // Hanya izinkan path internal yang dimulai "/" tunggal — tolak "//host" (protocol-relative)
  // dan URL absolut untuk mencegah open redirect ke domain eksternal.
  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/admin";
  redirect(safeRedirect);
}

export async function logoutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
