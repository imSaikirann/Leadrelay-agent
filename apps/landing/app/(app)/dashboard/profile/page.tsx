import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CompanyProfileForm from "./CompanyProfileForm";

export default async function CompanyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });

  if (!company) redirect("/onboarding");

  return <CompanyProfileForm company={company} />;
}