export function getCompanySettings(companyId?: string) {
  return {
    email: { enabled: true },

    meeting: {
      enabled: true,
      bookingUrl: "https://cal.com/demo",
    },

    slack: {
      enabled: true,
      webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
    },
  }
}