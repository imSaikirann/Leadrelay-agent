import { z } from "zod"

export const LeadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
})

export type LeadInput = z.infer<typeof LeadSchema>