// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  console.log("🌱 deleting database...");

//  await prisma.$runCommandRaw({
//   dropDatabase: 1,
// });
  // ── Plans ──────────────────────────────────────────────────────────────────
  // Upsert so re-running seed never duplicates.
  const pro = await prisma.plan.upsert({
    where: { name: "Pro" },
    update: {
      priceMonthly: 12000,
      trialDays: 7,
      isActive: true,
    },
    create: {
      name: "Pro",
      priceMonthly: 12000,
      trialDays: 7,
      maxLeads: null,     // unlimited
      maxMembers: null,   // unlimited
      features: ["ai_scoring", "excel_export", "team_management", "lead_assignment"],
      isActive: true,
    },
  });

  console.log(`✅ Plan upserted: ${pro.name} — ₹${pro.priceMonthly}/mo, ${pro.trialDays}-day trial`);

  // ── Superadmin TeamMember ──────────────────────────────────────────────────
  // Optional: seed a superadmin so you can manage plans via API right away.
  // Change email/password before running in production.
  // Password is plain here — hash it before inserting if your auth uses bcrypt.

  const { default: bcrypt } = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("superadmin_change_me", 12);
  const seededCompanyId = process.env.SEED_COMPANY_ID ?? "000000000000000000000000";
  const seededSuperAdminEmail = (process.env.SEED_SUPERADMIN_EMAIL ?? "superadmin@inboq.com")
    .trim()
    .toLowerCase();

  const superadmin = await prisma.teamMember.upsert({
    where: {

      companyId_email: {
        companyId: seededCompanyId,
        email: seededSuperAdminEmail,
      },
    },
    update: {
      name: "Super Admin",
      password: hashedPassword,
      role: "superadmin",
      seniority: "senior",
      status: "active",
    },
    create: {
      companyId: seededCompanyId,
      name: "Super Admin",
      email: seededSuperAdminEmail,
      password: hashedPassword,
      role: "superadmin",
      seniority: "senior",
      status: "active",
    },
  });

  console.log(`✅ Superadmin upserted: ${superadmin.email}`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
