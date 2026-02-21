import { attachFormHook } from "./form-hook"

interface InitOptions {
  formId: string
  apiUrl: string
}

declare global {
  interface Window {
    AgentRelay?: any
  }
}

window.AgentRelay = {
  init(options: InitOptions) {
    if (!options?.formId || !options?.apiUrl) {
      console.error("[AgentRelay] invalid config")
      return
    }

    attachFormHook(options)
    console.log("[AgentRelay] initialized")
  }
}