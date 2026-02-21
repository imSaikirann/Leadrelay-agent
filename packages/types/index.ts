export interface LeadInput {
  name: string
  email: string
  message: string
}

export type LeadScore = "hot" | "warm" | "cold"

export type AgentAction =
  | "SEND_AUTO_REPLY"
  | "NOTIFY_SALES"
  | "CREATE_SUPPORT_TICKET"