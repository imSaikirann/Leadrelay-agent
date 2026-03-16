import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicForm from "./PublicForm";

type Props = {
  params: Promise<{ companySlug: string; formSlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { companySlug, formSlug } = await params;
  const { company, form } = await getForm(companySlug, formSlug);
  if (!company || !form) return { title: "Form not found" };
  return { title: `${form.name} — ${company.name}` };
}

async function getForm(companySlug: string, formSlug: string) {
  const companies = await prisma.company.findMany({
    include: { leadForm: true },
  });
  const company = companies.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === companySlug
  );
  const form = company?.leadForm?.find((f) => f.slug === formSlug);
  return { company, form };
}

export default async function PublicFormPage({ params }: Props) {
  const { companySlug, formSlug } = await params;
  const { company, form } = await getForm(companySlug, formSlug);

  if (!company || !form) notFound();

  return (
    <PublicForm
      companyName={company.name}
      companySlug={companySlug}
      formName={form.name}
      formSlug={formSlug}
      fields={form.fields as any[]}
    />
  );
}