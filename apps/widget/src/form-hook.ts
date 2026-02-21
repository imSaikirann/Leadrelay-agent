export interface HookOptions {
  formId: string
  apiUrl: string
}

export function attachFormHook(options: HookOptions) {
  const form = document.getElementById(options.formId) as HTMLFormElement | null
  if (!form) {
    console.warn("[AgentRelay] form not found")
    return
  }

  form.addEventListener("submit", async () => {
    try {
      const formData = new FormData(form)
      const payload = Object.fromEntries(formData.entries())

      // 🔥 IMPORTANT: do NOT block form submission
      fetch(options.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(() => {
        console.warn("[AgentRelay] send failed")
      })
    } catch (err) {
      console.warn("[AgentRelay] error", err)
    }
  })
}