import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageCircle, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const tools = [
  { title: "Smart Email Generator", desc: "Draft professional emails in seconds with the right tone.", icon: Mail, to: "/email", color: "from-blue-500/20 to-indigo-500/20" },
  { title: "Meeting Notes Summarizer", desc: "Turn long transcripts into action items and decisions.", icon: FileText, to: "/meetings", color: "from-violet-500/20 to-fuchsia-500/20" },
  { title: "AI Task Planner", desc: "Break down goals into prioritized, scheduled tasks.", icon: ListTodo, to: "/tasks", color: "from-emerald-500/20 to-teal-500/20" },
  { title: "AI Research Assistant", desc: "Get structured briefings on any topic, fast.", icon: Search, to: "/research", color: "from-amber-500/20 to-orange-500/20" },
  { title: "AI Chatbot", desc: "An always-on assistant for any workplace question.", icon: MessageCircle, to: "/chat", color: "from-pink-500/20 to-rose-500/20" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <section
        className="relative overflow-hidden rounded-2xl border border-border p-8 md:p-12"
        style={{ background: "var(--gradient-subtle)" }}
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Powered by AI
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Your AI-powered <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>workplace assistant</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Automate the busywork. Draft emails, summarize meetings, plan your day, research topics, and chat —
            all from one clean, modern workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
            >
              Start chatting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/email" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">
              Try Email Generator
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">AI Tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to}>
              <Card className="group relative h-full overflow-hidden border-border p-5 transition hover:border-primary/40 hover:shadow-lg">
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${t.color} opacity-60 blur-2xl transition group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Open tool <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Fast", desc: "Get high-quality outputs in seconds." },
          { icon: Shield, title: "Responsible", desc: "Clear disclaimers and editable outputs." },
          { icon: Sparkles, title: "Modern", desc: "Built with the latest AI models." },
        ].map((f) => (
          <Card key={f.title} className="border-border p-5">
            <f.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
