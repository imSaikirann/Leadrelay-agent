import { Company, TeamMember } from "@prisma/client";
import { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export const MEMBER_ROLE = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  SALES_LEAD: "sales_lead",
  LEAD_GEN: "lead_gen",
  SALES_REP: "sales_rep",
} as const;

export const TEAM_KIND = {
  SALES: "sales",
  LEAD_GEN: "lead_gen",
  REPS: "reps",
  SUPPORT: "support",
  OPERATIONS: "operations",
} as const;

type OwnerRecord = {
  id: string;
  email: string | null;
  name: string | null;
};

export type AccessContext = {
  session: Session;
  role: string;
  isSuperAdmin: boolean;
  isOwner: boolean;
  isMember: boolean;
  owner: OwnerRecord | null;
  member: TeamMember | null;
  company: Company | null;
};

function getSuperAdminEmails() {
  return (process.env.SUPERADMIN_EMAILS ?? process.env.SUPERADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperAdminEmail(email?: string | null) {
  if (!email) return false;
  return getSuperAdminEmails().includes(email.toLowerCase());
}

export async function resolveAccess(session: Session | null): Promise<AccessContext | null> {
  if (!session?.user?.email) return null;

  const email = session.user.email.toLowerCase();
  const isSuperAdmin = session.user.role === MEMBER_ROLE.SUPERADMIN || isSuperAdminEmail(email);

  if (isSuperAdmin) {
    return {
      session,
      role: MEMBER_ROLE.SUPERADMIN,
      isSuperAdmin: true,
      isOwner: false,
      isMember: false,
      owner: null,
      member: null,
      company: null,
    };
  }

  const owner = await prisma.user.findUnique({
    where: { email },
    include: { company: true },
  });

  if (owner) {
    return {
      session,
      role: "owner",
      isSuperAdmin: false,
      isOwner: true,
      isMember: false,
      owner: { id: owner.id, email: owner.email, name: owner.name },
      member: null,
      company: owner.company,
    };
  }

  const member = await prisma.teamMember.findFirst({
    where: { email },
    include: { company: true },
  });

  if (!member) return null;

  return {
    session,
    role: member.role,
    isSuperAdmin: false,
    isOwner: false,
    isMember: true,
    owner: null,
    member,
    company: member.company,
  };
}

export function canManageWorkspace(access: AccessContext) {
  return access.isOwner || access.role === MEMBER_ROLE.ADMIN || access.role === MEMBER_ROLE.SALES_LEAD;
}

export function canManageForms(access: AccessContext) {
  return (
    access.isOwner ||
    access.role === MEMBER_ROLE.ADMIN ||
    access.role === MEMBER_ROLE.SALES_LEAD ||
    access.role === MEMBER_ROLE.LEAD_GEN
  );
}

export function canAssignLeads(access: AccessContext) {
  return access.isOwner || access.role === MEMBER_ROLE.ADMIN || access.role === MEMBER_ROLE.SALES_LEAD;
}

export function canViewLeadQueue(access: AccessContext) {
  return canManageWorkspace(access) || access.role === MEMBER_ROLE.LEAD_GEN;
}

export function isRep(access: AccessContext) {
  return access.role === MEMBER_ROLE.SALES_REP;
}
