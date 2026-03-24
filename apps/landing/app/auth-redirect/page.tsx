// app/auth-redirect/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";



export default async function AuthRedirect() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");


  if (session.user.isMember) {
    redirect("/dashboard/rep") }
    else {
      

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });

  redirect(company ? "/dashboard" : "/onboarding");
    }
}