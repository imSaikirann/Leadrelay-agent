import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `
You are an autonomous lead triage agent for website contact forms.

IMPORTANT CONTEXT:
- The user has already submitted a contact form.
- This is NOT a live chat.
- Your reply will be sent via email.
- The user may not respond immediately.

Your job:
1. Classify the lead.
2. Choose the correct action.
3. Write a professional acknowledgment email.

EMAIL STYLE RULES:
- Be polite and professional.
- Acknowledge the inquiry.
- Do NOT ask too many follow-up questions.
- If more info is needed, ask briefly and politely.
- Set expectation that the team will follow up.
- Keep tone business-like, not chatty.
- Keep reply under 120 words.

ACTION SELECTION RULES:
- Use SEND_AUTO_REPLY for normal inquiries.
- Use NOTIFY_SALES for high-intent sales leads.
- Use CREATE_SUPPORT_TICKET for clear support issues.
- Spam leads should still return SEND_AUTO_REPLY with a neutral message.

SPAM DETECTION GUIDELINES:
Mark as "spam" ONLY if the message clearly shows:
- promotional content
- irrelevant links
- obvious bot patterns
- repeated nonsense text

When unsure, prefer "other" instead of "spam".

Return ONLY valid JSON. No markdown, no code fences, no backticks.

{
  "leadScore": "hot | warm | cold",
  "intent": "sales | support | spam | other",
  "action": "SEND_AUTO_REPLY | NOTIFY_SALES | CREATE_SUPPORT_TICKET",
  "reply": "professional email reply",
  "reasoning": "short explanation"
}`;

const MAX_RETRIES = 2;
const TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("LLM timeout")), ms)
    ),
  ]);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroq(leadData: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: leadData },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}
function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const fallback = {
  leadScore: "cold",
  intent: "other",
  action: "SEND_AUTO_REPLY",
  reply: "Thank you for contacting us. Our team has received your message and will review it shortly.",
  reasoning: "Fallback triggered after validation failures",
};

export const rankLead = inngest.createFunction(
  { id: "rank-lead", name: "Rank Lead" },
  { event: "lead/submitted" },
  async ({ event, step }) => {
    const { submissionId } = event.data;

    // Step 1 — fetch submission
    const submission = await step.run("fetch-submission", async () => {
      return prisma.formSubmission.findUnique({
        where: { id: submissionId },
        include: { form: { select: { name: true } } },
      });
    });

    if (!submission) throw new Error("Submission not found");

    // Step 2 — call Grok with retries
    const result = await step.run("rank-with-grok", async () => {
      let lastError: any = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const text = await withTimeout(
            callGroq(JSON.stringify(submission.data)),
            TIMEOUT_MS
          );

          const parsed = safeJsonParse(text);
          if (!parsed) throw new Error("Invalid JSON");

          // Validate required fields
          if (!parsed.leadScore || !parsed.intent || !parsed.action) {
            throw new Error("Missing required fields");
          }

          return parsed as {
            leadScore: string;
            intent: string;
            action: string;
            reply: string;
            reasoning: string;
          };
        } catch (err) {
          lastError = err;
          console.warn(`[rankLead] attempt ${attempt + 1} failed`, err);
        }
      }

      console.warn("[rankLead] all attempts failed, using fallback");
      return fallback;
    });

    // Step 3 — save to DB
    await step.run("save-rank", async () => {
      return prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          rank: result.leadScore,
          rankReason: result.reasoning,
          rankedAt: new Date(),
        },
      });
    });

    return { submissionId, rank: result.leadScore };
  }
);