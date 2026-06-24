// ===========================================================================
// lib/config/company.ts
// Semua data statis perusahaan ada di sini.
// Edit file ini untuk mengubah konten tanpa menyentuh komponen.
// ===========================================================================

export const COMPANY = {
  name:        "PT Indofa Gemilang Konstruksi",
  shortName:   "Indofa Gemilang Konstruksi",
  tagline:     "General Contractor, Trading and Consultant Terpercaya",
  description: "PT Indofa Gemilang Konstruksi adalah perusahaan General Contractor, Trading and Consultant yang bergerak di bidang Konstruksi Umum, Gambar dan Perencanaan, serta Pengawasan. Berawal dari CV. Indofa yang menangani proyek rumah tinggal dan gudang, kini berkembang ke bidang interior fit out dan desain perencanaan dengan pelayanan prima yang terintegrasi antara pelaksanaan, perencanaan, dan pengawasan.",
  founded:     2017,
  experience:  9, // 2026 - 2017 (akte pendirian PT)
  url:         "https://indofagemilang.co.id",

  contact: {
    // Alamat kantor tidak tercantum di company profile — isi setelah data tersedia.
    address:   "Tangerang, Indonesia",
    email:     "indofa.gk@gmail.com",
    phone:     "+62 21 5972 9980",
    whatsapp:  "6285780026999",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4079160052393!2d106.6365727!3d-6.2098071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f9006f91a3bf%3A0xb64c1b4304946e32!2sPT%20Indofa%20Gemilang%20Konstruksi!5e0!3m2!1sen!2sid!4v1782288606409!5m2!1sen!2sid",
    mapsUrl:   "https://maps.app.goo.gl/sCHQ482SH2NqQM4p8",
    operatingHours: "Senin – Jumat: 08.00 – 17.00 WIB\nSabtu: 08.00 – 13.00 WIB",
  },

  // Belum ada akun media sosial resmi tercantum di company profile.
  social: {
    instagram: "https://instagram.com/indofagemilang",
    linkedin:  "https://linkedin.com/company/indofagemilang",
  },
} as const;

export const VISION =
  "Menjadi perusahaan yang handal dan terdepan di Indonesia yang mampu menghadapi persaingan global demi kemajuan dan harkat martabat bangsa.";

export const MISSION = [
  "Menghasilkan produk yang berkualitas dengan mengutamakan mutu dan pelayanan demi kepuasan pelanggan sehingga menjadi mitra usaha yang andal dan terpercaya.",
  "Pelatihan dan recruitment sumber daya manusia yang tepat, untuk menghasilkan tenaga kerja yang kompeten dan bersemangat tinggi sesuai budaya perusahaan.",
  "Bangga dan prima dalam industri jasa konstruksi.",
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
    title:       "Kontraktor",
    description: "Konstruksi sipil, arsitektur, mekanikal dan elektrikal, serta landscape (taman) — dikerjakan dengan standar mutu dan ketepatan waktu.",
    icon:        "building",
  },
  {
    title:       "Konsultan",
    description: "Disain struktur, disain arsitektur, dan disain landscape (taman) untuk perencanaan proyek yang matang sejak tahap awal.",
    icon:        "landmark",
  },
  {
    title:       "Pemeliharaan Gedung",
    description: "Pemeliharaan struktur, arsitektur, mekanikal dan elektrikal, serta landscape (taman) untuk menjaga kondisi bangunan tetap optimal.",
    icon:        "wrench",
  },
  {
    title:       "Leveransir",
    description: "Penyediaan alat konstruksi & teknik, mekanikal & elektrikal, mesin & suku cadang, komputer & suku cadang, hingga perlengkapan kantor.",
    icon:        "factory",
  },
] as const;

export const WHY_US = [
  { label: "Tahun Pengalaman",  value: "9" },
  { label: "Proyek Selesai",    value: "50+" },
  { label: "Klien Puas",        value: "50+" },
  { label: "Tenaga Ahli",       value: "100+" },
] as const;

// ─── Testimonial ──────────────────────────────────────────────────────────────
// Data dummy. Ganti dengan testimoni klien asli setelah tersedia.
export const TESTIMONIALS = [
  {
    name:    "Budi Santoso",
    company: "PT Maju Bersama",
    role:    "Direktur Operasional",
    rating:  5,
    comment: "Pengerjaan gedung kantor kami selesai tepat waktu dengan kualitas yang sangat baik. Tim Indofa sangat profesional dan komunikatif sepanjang proyek berjalan.",
  },
  {
    name:    "Sri Wahyuni",
    company: "Yayasan Pendidikan Nusantara",
    role:    "Ketua Yayasan",
    rating:  5,
    comment: "Renovasi gedung sekolah kami dikerjakan dengan rapi dan sesuai anggaran yang disepakati. Tim lapangan sangat menjaga kebersihan dan ketertiban selama proses berlangsung.",
  },
  {
    name:    "Hendra Gunawan",
    company: "Grand Residence Group",
    role:    "Project Owner",
    rating:  5,
    comment: "Kerja sama yang baik dari awal perencanaan hingga serah terima. Detail konstruksi diperhatikan dengan teliti, dan tim selalu responsif terhadap setiap pertanyaan kami.",
  },
  {
    name:    "Enggar Prasetyo",
    company: "PT Pencari Cinta Sejati",
    role:    "CEO",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
  {
    name:    "Aji Darmawan",
    company: "PT Bangun Siang Malam",
    role:    "Manager",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
  {
    name:    "Rizal Maulana",
    company: "PT Pulang Kembali",
    role:    "Supervisor",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
  {
    name:    "Donita Sari",
    company: "PT Panas Dingin",
    role:    "General Manager",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
  {
    name:    "Subianto",
    company: "PT Raja Sawit",
    role:    "Owner",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
  {
    name:    "Lina Marlina",
    company: "PT Indah Jaya",
    role:    "Sales Manager",
    rating:  5,
    comment: "Tulis testimoninya di sini...",
  },
] as const;

// ─── Partner / Client Logos ───────────────────────────────────────────────────
// Belum ada logo resmi — gunakan placeholder berbasis nama hingga aset tersedia.
// Setelah logo asli ada, tambahkan field `logoUrl` dan render <Image> di komponen.
export const PARTNERS = [
  { name: "PT Maju Bersama" },
  { name: "Yayasan Pendidikan Nusantara" },
  { name: "Grand Residence Group" },
  { name: "PT Sinar Abadi" },
  { name: "Kementerian PUPR" },
  { name: "PT Cipta Karya" },
] as const;
