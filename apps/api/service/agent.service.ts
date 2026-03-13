import { runAgent } from "../agent/agentLoop"
import type { LeadInput } from "../validators/lead.schema"
import { sendEmail } from "./email.service"
import { getCompanySettings } from "./settings.service"
import { sendSlackNotification } from "./slack.service"

export async function processLead(lead: LeadInput) {
  // Normalize lead data
  const normalized = {
    ...lead,
    email: lead.email.toLowerCase().trim(),
    message: lead.message.trim(),
    messageLength: lead.message.length,
    source: "contact_form",
  }

  // Run AI agent
  const result = await runAgent(normalized)

  // Create pitch from AI reply (max 200 chars)
  const pitch = result.reply ? result.reply.slice(0, 200) : ""

  // Handle spam
  if (result.intent === "spam") {
    return {
      ...result,
      pitch: "",
      action: "SEND_AUTO_REPLY",
      reply: "Thank you for contacting us. Our team has received your message.",
      isSpam: true,
    }
  }

  const settings = getCompanySettings()

  // Notify Slack if hot sales lead
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
${normalized.message}`
    })
  }

  // Send auto reply email
  await sendEmail({
    to: normalized.email,
    subject: "We received your message",
    html: `
      <p>${pitch}</p>
    `,
  })

  // Return result with pitch
  return {
    ...result,
    pitch
  }
}