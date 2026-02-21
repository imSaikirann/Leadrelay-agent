import { z } from "zod"

export const AgentOutputSchema = z.object({
  leadScore: z.enum(["hot", "warm", "cold"]),
  intent: z.enum(["sales", "support", "other", "spam"]),
  action: z.enum([
    "SEND_AUTO_REPLY",
    "NOTIFY_SALES",
    "CREATE_SUPPORT_TICKET",
  ]),
  reply: z.string().min(5).max(2000),
  reasoning: z.string().min(3).max(500),
})

export type AgentOutput = z.infer<typeof AgentOutputSchema>