import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Copy } from "lucide-react";
import { AIToolShell } from "@/components/AIToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { runAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({ component: EmailPage });

function EmailPage() {
  const run = useServerFn(runAI);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!context.trim()) { toast.error("Please describe what the email is about."); return; }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            { role: "system", content: "You are an expert email writer. Write a clear, well-structured email. Include a subject line on the first line as 'Subject: ...' and then the body. Match the requested tone exactly. Keep it concise." },
            { role: "user", content: `Recipient: ${recipient || "(unspecified)"}\nSubject hint: ${subject || "(none)"}\nTone: ${tone}\n\nContext / what to say:\n${context}` },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolShell title="Smart Email Generator" description="Generate polished, on-tone emails in seconds." icon={<Mail className="h-6 w-6" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah from Marketing" />
          </div>
          <div className="space-y-2">
            <Label>Subject (optional)</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Project update" />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>What's the email about?</Label>
            <Textarea rows={6} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Briefly describe the message, key points, and any deadlines..." />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Email"}
          </Button>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Draft (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={18}
            placeholder="Your generated email will appear here..."
            className="flex-1 font-mono text-sm"
          />
        </Card>
      </div>
    </AIToolShell>
  );
}
