import express from "express"
import cors from "cors"
import { leadRouter } from "./routes/lead.route"

export const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/lead", leadRouter)