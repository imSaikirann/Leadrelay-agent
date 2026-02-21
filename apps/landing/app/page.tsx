import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Zap, Mail, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* NAV */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold">AgentRelay</div>
        <div className="flex items-center gap-3">
          <Button variant="ghost">Docs</Button>
          <Button>Get Started</Button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Never Miss a High-Intent Lead Again
          </h1>

          <p className="mt-6 text-lg text-neutral-600">
            AgentRelay watches your contact forms, qualifies leads with AI,
            replies instantly, and alerts your team when it matters.
            <span className="font-medium text-neutral-900">
              {" "}From form submit → booked meeting in seconds.
            </span>
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8">
              Start Free
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              View Demo
            </Button>
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            No credit card • 2-minute setup • Works with any website
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI Lead Qualification"
            description="Automatically scores and classifies every inbound lead so your team focuses on the highest-value opportunities."
          />

          <FeatureCard
            icon={<Mail className="h-6 w-6" />}
            title="Instant Smart Replies"
            description="Send professional, on-brand responses the moment a form is submitted — even outside business hours."
          />

          <FeatureCard
            icon={<Calendar className="h-6 w-6" />}
            title="Meeting Acceleration"
            description="Detects high-intent prospects and nudges them to book a call automatically using your scheduling link."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">
            From Contact Form to Qualified Lead
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Install the Snippet"
              description="Drop one small script into your website. AgentRelay starts monitoring your contact forms instantly."
            />

            <Step
              number="02"
              title="AI Does the Triage"
              description="Every submission is analyzed, scored, and routed automatically based on intent and urgency."
            />

            <Step
              number="03"
              title="Close Faster"
              description="Hot leads trigger Slack alerts and meeting suggestions so your team can respond at peak intent."
            />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="rounded-2xl border bg-white p-10 shadow-sm">
          <p className="text-lg font-medium">
            “We started responding to leads in under 30 seconds. Our demo
            bookings jumped almost immediately.”
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            — Early Agency User
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Turn Your Contact Form Into a Revenue Engine
          </h2>

          <p className="mt-4 text-neutral-300">
            Set up AgentRelay in minutes and start capturing high-intent
            opportunities automatically.
          </p>

          <div className="mt-8">
            <Button size="lg" className="px-10" variant="secondary">
              Start Free
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-500">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>© {new Date().getFullYear()} AgentRelay</div>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function Step({ number, title, description }: any) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-sm font-semibold text-neutral-500">
        {number}
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
      <CheckCircle2 className="mt-4 h-5 w-5 text-green-600" />
    </div>
  )
}