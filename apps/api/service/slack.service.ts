interface SlackParams {
  text: string
}

export async function sendSlackNotification(
  webhookUrl: string,
  params: SlackParams
) {
  if (!webhookUrl) {
    console.warn("[Slack] webhook missing")
    return { success: false }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: params.text,
      }),
    })

    if (!res.ok) throw new Error("Slack request failed")

    console.log("[Slack] notification sent")

    return { success: true }
  } catch (err) {
    console.error("[Slack] failed:", err)
    return { success: false }
  }
}