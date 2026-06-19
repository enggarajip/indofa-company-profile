import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Proyek Baru",
};

export default function NewProjectPage() {
  return <ProjectForm />;
}
