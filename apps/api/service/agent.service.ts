import { runAgent } from "../agent/agentLoop"
import type { LeadInput } from "../validators/lead.schema"
import { sendEmail } from "./email.service"
import { getCompanySettings } from "./settings.service"
import { sendSlackNotification } from "./slack.service"

export async function processLead(lead: LeadInput) {

  const normalized = {
    ...lead,
    email: lead.email.toLowerCase().trim(),
    message: lead.message.trim(),
    messageLength: lead.message.length,
    source: "contact_form",
  }

  const result = await runAgent(normalized)


    if (result.intent === "spam") {
    return {
      ...result,
      action: "SEND_AUTO_REPLY",
      reply:
        "Thank you for contacting us. Our team has received your message.",
      isSpam: true,
    }
  }

const settings = getCompanySettings()


if (
  result.intent === "sales" &&
  result.leadScore === "hot" &&
  settings.slack.enabled
) {
  await sendSlackNotification(settings.slack.webhookUrl, {
    text: `🔥 Hot Lead Received

Name: ${normalized.name}
Email: ${normalized.email}

Message:
${normalized.message}`,
  })
}

  await sendEmail({
  to: normalized.email,
  subject: "We received your message",
  html: `<p>${result.reply}</p>`,
})


  return result
}