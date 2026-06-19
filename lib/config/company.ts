// ===========================================================================
// lib/config/company.ts
// Semua data statis perusahaan ada di sini.
// Edit file ini untuk mengubah konten tanpa menyentuh komponen.
// ===========================================================================

export const COMPANY = {
  name:        "PT Indofa Gemilang Konstruksi",
  shortName:   "Indofa Gemilang",
  tagline:     "Membangun Indonesia dengan Kualitas Terbaik",
  description: "Perusahaan konstruksi terpercaya dengan pengalaman lebih dari 15 tahun. Spesialis gedung komersial, infrastruktur jalan, dan jembatan di seluruh Indonesia.",
  founded:     2009,
  experience:  15,
  url:         "https://indofagemilang.co.id",

  contact: {
    address:   "Jl. Gatot Subroto No. 45, Jakarta Selatan, DKI Jakarta 12950",
    email:     "info@indofagemilang.co.id",
    phone:     "+62 21 5555 1234",
    whatsapp:  "6281234567890",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.82!3d-6.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMDAuMCJTIDEwNsKwNDknMTIuMCJF!5e0!3m2!1sid!2sid!4v1234567890",
    mapsUrl:   "https://maps.google.com/?q=-6.23,106.82",
  },

  social: {
    instagram: "https://instagram.com/indofagemilang",
    linkedin:  "https://linkedin.com/company/indofagemilang",
  },
} as const;

export const VISION =
  "Menjadi perusahaan konstruksi nasional terdepan yang dikenal atas kualitas, integritas, dan inovasi dalam setiap proyek yang kami kerjakan.";

export const MISSION = [
  "Menghadirkan solusi konstruksi berkualitas tinggi yang memenuhi dan melampaui ekspektasi klien.",
  "Mengutamakan keselamatan kerja dan kesejahteraan seluruh tenaga kerja di lapangan.",
  "Menerapkan teknologi konstruksi modern untuk efisiensi dan ketepatan waktu penyelesaian.",
  "Berkontribusi aktif dalam pembangunan infrastruktur Indonesia yang berkelanjutan.",
  "Membangun hubungan jangka panjang berbasis kepercayaan dengan klien, mitra, dan pemangku kepentingan.",
] as const;

export const VALUES = [
  {
    title:       "Integritas",
    description: "Kami menjunjung tinggi kejujuran dan transparansi dalam setiap aspek pekerjaan, dari penawaran hingga serah terima proyek.",
    icon:        "shield",
  },
  {
    title:       "Kualitas",
    description: "Setiap detail dikerjakan dengan standar tertinggi menggunakan material pilihan dan metode konstruksi yang telah teruji.",
    icon:        "star",
  },
  {
    title:       "Keselamatan",
    description: "Zero accident adalah prioritas utama kami. Setiap pekerja berhak pulang ke rumah dengan selamat setiap harinya.",
    icon:        "hard-hat",
  },
  {
    title:       "Inovasi",
    description: "Kami terus beradaptasi dengan teknologi dan metode konstruksi terkini untuk memberikan solusi yang lebih efisien.",
    icon:        "lightbulb",
  },
] as const;

export const SERVICES = [
  {
    title:       "Gedung Komersial & Perkantoran",
    description: "Pembangunan gedung bertingkat, pusat perbelanjaan, hotel, dan fasilitas komersial lainnya dengan standar internasional.",
    icon:        "building",
  },
  {
    title:       "Infrastruktur Jalan & Jembatan",
    description: "Konstruksi jalan raya, jalan tol, jembatan beton, dan infrastruktur transportasi untuk konektivitas yang lebih baik.",
    icon:        "bridge",
  },
  {
    title:       "Perumahan & Hunian",
    description: "Pengembangan kawasan perumahan, apartemen, dan hunian vertikal dengan desain modern dan ramah lingkungan.",
    icon:        "home",
  },
  {
    title:       "Fasilitas Industri",
    description: "Pembangunan pabrik, gudang, kawasan industri, dan infrastruktur pendukung untuk sektor manufaktur dan logistik.",
    icon:        "factory",
  },
  {
    title:       "Fasilitas Pemerintahan",
    description: "Konstruksi gedung pemerintahan, fasilitas publik, sekolah, rumah sakit, dan sarana prasarana sosial masyarakat.",
    icon:        "landmark",
  },
  {
    title:       "Renovasi & Rehabilitasi",
    description: "Renovasi total maupun parsial gedung existing, restorasi bangunan bersejarah, dan peningkatan kapasitas fasilitas.",
    icon:        "wrench",
  },
] as const;

export const WHY_US = [
  { label: "Tahun Pengalaman",  value: "15+" },
  { label: "Proyek Selesai",    value: "200+" },
  { label: "Klien Puas",        value: "150+" },
  { label: "Tenaga Ahli",       value: "500+" },
] as const;
