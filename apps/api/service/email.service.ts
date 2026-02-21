import { Resend } from "resend"
import { SendEmailParams } from "../validators/email.schema"

const resend = new Resend(process.env.RESEND_API_KEY!)



export async function sendEmail(params: SendEmailParams) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    console.log("[Email] sent:", response.data?.id)

    return { success: true }
  } catch (err) {
    console.error("[Email] failed:", err)
    return { success: false }
  }
}