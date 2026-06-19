import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getProjectById(id);
  return {
    title: result.success ? `Edit: ${result.data.title}` : "Edit Proyek",
  };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const result = await getProjectById(id);

  if (!result.success) notFound();

  return <ProjectForm project={result.data} />;
}
