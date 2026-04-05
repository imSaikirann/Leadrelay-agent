export const LEAD_RANK = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
} as const;

export const ROLES = {
  SUPERADMIN: "superadmin",
  OWNER: "owner",
  ADMIN: "admin",
  SALES_LEAD: "sales_lead",
  LEAD_GEN: "lead_gen",
  SALES_REP: "sales_rep",
} as const;

export const REQUIRED_FIELDS = {
  MESSAGE: "message",
};

export const LEAD_PAGE_SIZE = 20;

export const SPAM_KEYWORDS = [
  "buy now",
  "free money",
  "click here",
  "http://",
  "https://",
];
