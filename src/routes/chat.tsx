import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Loader2, Send, User, Sparkles } from "lucide-react";
import { AIToolShell } from "@/components/AIToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({ component: ChatPage });

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(runAI);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your workplace AI assistant. Ask me anything — drafting, planning, summarizing, brainstorming." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            { role: "system", content: "You are a helpful, concise workplace productivity assistant. Format clearly with markdown when useful." },
            ...next,
          ],
        },
      });
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to respond");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolShell title="AI Chatbot" description="Your always-on assistant for workplace questions." icon={<MessageCircle className="h-6 w-6" />}>
      <Card className="flex h-[65vh] flex-col p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-secondary" : "text-primary-foreground"
                }`}
                style={m.role === "assistant" ? { background: "var(--gradient-primary)" } : undefined}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything... (Enter to send, Shift+Enter for newline)"
              rows={2}
              className="resize-none"
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </AIToolShell>
  );
}
