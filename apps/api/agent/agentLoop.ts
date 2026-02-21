import { llm } from "../lib/llm"
import { SYSTEM_PROMPT } from "./prompt"
import { safeJsonParse } from "./safeParse"
import { AgentOutputSchema } from "../validators/agent-output.schema"
import { LeadInput } from "../validators/lead.schema"

const MAX_RETRIES = 2
const TIMEOUT_MS = 15000

async function callModel(lead: any) {
  const res = await llm.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(lead) },
    ],
  })

  return res.choices[0]?.message?.content || ""
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("LLM timeout")), ms)
    ),
  ])
}

export async function runAgent(lead: LeadInput) {
  let lastError: any = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const text = await withTimeout(callModel(lead), TIMEOUT_MS)

      const parsed = safeJsonParse(text)
      if (!parsed) throw new Error("Invalid JSON")

      const validated = AgentOutputSchema.parse(parsed)

      return validated
    } catch (err) {
      lastError = err
      console.warn(`[Agent] attempt ${attempt + 1} failed`, err)
    }
  }

  // FINAL FALLBACK 
  return {
    leadScore: "cold",
    intent: "other",
    action: "SEND_AUTO_REPLY",
    reply:
      "Thank you for contacting us. Our team has received your message and will review it shortly.",
    reasoning: "Fallback triggered after validation failures",
  }
}