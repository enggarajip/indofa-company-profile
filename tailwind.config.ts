import type { Config } from "tailwindcss";

/**
 * Tailwind v4 — peran tailwind.config.ts sangat terbatas.
 *
 * Token (warna, font, shadow, animasi) TIDAK lagi didefinisikan di sini.
 * Semuanya sudah ada di @theme dalam globals.css — itu satu-satunya
 * sumber kebenaran di v4.
 *
 * File ini hanya dibutuhkan untuk:
 * 1. content  — memberitahu Tailwind file mana yang di-scan untuk class
 * 2. plugins  — typography plugin tidak bisa dipakai via @plugin dengan
 *               import TypeScript, jadi tetap di sini
 */
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typography],
};

export default config;
