import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Copy } from "lucide-react";
import { AIToolShell } from "@/components/AIToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { runAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({ component: MeetingsPage });

function MeetingsPage() {
  const run = useServerFn(runAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) { toast.error("Paste your meeting notes or transcript first."); return; }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            { role: "system", content: "You are a meeting summarizer. Produce a clean markdown summary with these sections: ## Overview (2-3 sentences), ## Key Decisions (bulleted), ## Action Items (bulleted, each with owner if mentioned and due date if mentioned), ## Open Questions (bulleted). Be specific and faithful to the source." },
            { role: "user", content: `Summarize the following meeting notes / transcript:\n\n${notes}` },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolShell title="Meeting Notes Summarizer" description="Turn raw notes or transcripts into clean summaries with action items." icon={<FileText className="h-6 w-6" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Meeting notes or transcript</Label>
            <Textarea rows={18} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste the full notes or transcript here..." />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</> : "Summarize"}
          </Button>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Summary (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            )}
          </div>
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={20} className="flex-1 font-mono text-sm" placeholder="Your summary will appear here..." />
        </Card>
      </div>
    </AIToolShell>
  );
}
