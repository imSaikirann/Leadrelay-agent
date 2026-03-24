import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });
  if (!company) redirect("/onboarding");

  const submissions = await prisma.formSubmission.findMany({
    where: { companyId: company.id },
    include: { form: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <LeadsClient formId="" />;
}