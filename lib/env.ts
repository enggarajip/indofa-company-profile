/**
 * lib/env.ts
 * Validasi environment variables saat startup.
 * Jika ada yang kurang, app langsung crash dengan pesan yang jelas
 * daripada gagal diam-diam di tengah request.
 *
 * Cara pakai: import "@/lib/env" di app/layout.tsx (server-side only).
 */

type EnvVar = {
  key:         string;
  description: string;
  required:    boolean;
};

const ENV_VARS: EnvVar[] = [
  {
    key:         "NEXT_PUBLIC_SUPABASE_URL",
    description: "URL project Supabase (dari Project Settings → API)",
    required:    true,
  },
  {
    key:         "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Anon/publishable key Supabase (dari Project Settings → API)",
    required:    true,
  },
];

function validateEnv(): void {
  // Hanya jalankan di server — skip di browser
  if (typeof window !== "undefined") return;

  const missing: string[] = [];
  const invalid: string[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.key];

    if (!value || value.trim() === "") {
      if (envVar.required) missing.push(envVar.key);
      continue;
    }

    // Validasi format SUPABASE_URL
    if (
      envVar.key === "NEXT_PUBLIC_SUPABASE_URL" &&
      !value.startsWith("https://") &&
      !value.includes(".supabase.co")
    ) {
      invalid.push(`${envVar.key}: harus berformat https://xxxxx.supabase.co`);
    }

    // Validasi panjang minimum anon key (JWT, minimal 100 karakter)
    if (
      envVar.key === "NEXT_PUBLIC_SUPABASE_ANON_KEY" &&
      !(
        value.startsWith("sb_publishable_") ||
        value.startsWith("eyJ")
      )
    ) {
      invalid.push(`${envVar.key}: format key tidak valid`);
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const lines = [
      "",
      "╔══════════════════════════════════════════════════════╗",
      "║         ENVIRONMENT VARIABLES ERROR                   ║",
      "╚══════════════════════════════════════════════════════╝",
      "",
    ];

    if (missing.length > 0) {
      lines.push("  MISSING (wajib diisi di .env.local):");
      missing.forEach((key) => {
        const meta = ENV_VARS.find((e) => e.key === key);
        lines.push(`  ✗ ${key}`);
        if (meta) lines.push(`    → ${meta.description}`);
      });
      lines.push("");
    }

    if (invalid.length > 0) {
      lines.push("  INVALID:");
      invalid.forEach((msg) => lines.push(`  ✗ ${msg}`));
      lines.push("");
    }

    lines.push("  Buat file .env.local di root project:");
    lines.push("  ┌────────────────────────────────────────────────────┐");
    lines.push("  │ NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co   │");
    lines.push("  │ NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx   │");
    lines.push("  └────────────────────────────────────────────────────┘");
    lines.push("");

    throw new Error(lines.join("\n"));
  }
}

// Jalankan validasi satu kali
validateEnv();

// Export nilai yang sudah tervalidasi — gunakan ini di seluruh project
// agar tidak perlu `!` assertion berulang kali
export const env = {
  supabaseUrl:     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;
