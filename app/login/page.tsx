"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirectTo") ?? "";

  const [isPending, startTransition] = useTransition();
  const [error, setError]   = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="w-full max-w-sm">

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-500 mb-4 shadow-lg">
          <Building2 size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-display font-700 text-white">Indofa Admin</h1>
        <p className="text-brand-300 text-sm mt-1">PT Indofa Gemilang Konstruksi</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-lg font-display font-600 text-neutral-900 mb-6">Masuk ke Dashboard</h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden field: bawa redirectTo dari middleware ke server action */}
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Email */}
          <div>
            <label htmlFor="email" className="admin-label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@perusahaan.com"
                className="admin-input pl-9"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="admin-label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="admin-input pl-9 pr-10"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full btn-primary justify-center mt-2",
              isPending && "opacity-70 cursor-not-allowed hover:transform-none hover:shadow-none"
            )}
          >
            {isPending
              ? <><Loader2 size={16} className="animate-spin" /> Memproses...</>
              : "Masuk"
            }
          </button>
        </form>
      </div>

      <p className="text-center text-brand-400 text-xs mt-6">
        Akses terbatas untuk administrator
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white/50 text-sm">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
