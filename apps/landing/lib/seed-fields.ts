
import { prisma } from "./prisma";
import { FIELD_TEMPLATES, FieldCategory } from "./field-templates";

export async function seedFieldsForCompany(
  companyId: string,
  category: FieldCategory
) {
  const templates = FIELD_TEMPLATES[category];

  await prisma.businessField.createMany({
    data: templates.map((t) => ({
      companyId,
      key: t.key,
      label: t.label,
      type: t.type,
      options: "options" in t ? t.options : null,
      isRequired: "isRequired" in t ? t.isRequired : false,
      order: t.order,
    })),

  });
}

