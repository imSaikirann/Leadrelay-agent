import { Router } from "express"
import { handleLead } from "../controllers/lead.controller"

export const leadRouter = Router()

leadRouter.post("/", handleLead)