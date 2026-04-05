import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const FOUNDER_WORKSPACE_ID = "founder";
export const ALL_WORKSPACES_ID = "all";

export function normalizeWorkspaceId(value: string | null | undefined) {
  if (!value || value === ALL_WORKSPACES_ID || value === FOUNDER_WORKSPACE_ID) {
    return null;
  }

  return value;
}

export async function buildWorkspaceSubmissionWhere(companyId: string, workspaceId?: string | null) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);

  if (!normalizedWorkspaceId) {
    return { companyId } satisfies Prisma.FormSubmissionWhereInput;
  }

  const [formIds, memberIds] = await Promise.all([
    prisma.leadForm.findMany({
      where: { companyId, teamId: normalizedWorkspaceId },
      select: { id: true },
    }),
    prisma.teamMembership.findMany({
      where: { teamId: normalizedWorkspaceId },
      select: { teamMemberId: true },
    }),
  ]);

  const resolvedFormIds = formIds.map((form) => form.id);
  const resolvedMemberIds = memberIds.map((member) => member.teamMemberId);

  if (resolvedFormIds.length === 0 && resolvedMemberIds.length === 0) {
    return {
      companyId,
      OR: [
        { formId: { in: [] } },
        { assignedTo: { in: [] } },
      ],
    } satisfies Prisma.FormSubmissionWhereInput;
  }

  return {
    companyId,
    OR: [
      ...(resolvedFormIds.length > 0 ? [{ formId: { in: resolvedFormIds } }] : []),
      ...(resolvedMemberIds.length > 0 ? [{ assignedTo: { in: resolvedMemberIds } }] : []),
    ],
  } satisfies Prisma.FormSubmissionWhereInput;
}
