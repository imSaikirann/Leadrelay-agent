import { Request, Response } from "express"
import { LeadSchema } from "../validators/lead.schema"
import { processLead } from "../service/agent.service"


export async function handleLead(req: Request, res: Response) {
  try {
    const parsed = LeadSchema.parse(req.body)

    const result = await processLead(parsed)

    res.json({
      success: true,
      result,
    })
  } catch (err: any) {
    console.error(err)

    res.status(400).json({
      success: false,
      error: err.message,
    })
  }
}