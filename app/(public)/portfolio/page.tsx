import type { Metadata } from "next";
import { COMPANY } from "@/lib/config/company";
import { getProjects } from "@/lib/actions/projects";
import { PortfolioClient } from "./PortfolioClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Proyek",
  description: `Lihat seluruh proyek konstruksi yang telah dikerjakan oleh ${COMPANY.name}. Gedung komersial, infrastruktur, jembatan, dan lebih banyak lagi.`,
  openGraph: {
    title: `Portfolio | ${COMPANY.name}`,
    description: `Proyek-proyek unggulan ${COMPANY.name}`,
    url: `${COMPANY.url}/portfolio`,
  },
};

export default async function PortfolioPage() {
  const result   = await getProjects({ orderBy: "created_at_desc" });
  const projects = result.success ? result.data : [];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-800 py-20">
        <div className="container-content text-center">
          <p className="text-accent-400 font-600 text-sm uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-4xl lg:text-5xl font-display font-700 text-white mb-4">
            Proyek Kami
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Lebih dari {projects.length > 0 ? projects.length : "200"} proyek konstruksi yang telah berhasil kami selesaikan di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Projects with client-side filter/search */}
      <section className="section bg-neutral-50">
        <div className="container-content">
          <PortfolioClient initialProjects={projects} />
        </div>
      </section>
    </>
  );
}
