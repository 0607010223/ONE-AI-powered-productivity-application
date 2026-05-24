import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Copy } from "lucide-react";
import { AIToolShell } from "@/components/AIToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { runAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({ component: ResearchPage });

function ResearchPage() {
  const run = useServerFn(runAI);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("brief");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Enter a research topic."); return; }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            { role: "system", content: `You are a research analyst. Produce a structured ${depth} briefing in markdown with these sections: ## Summary, ## Key Facts (bulleted), ## Background, ## Different Perspectives, ## Risks & Open Questions, ## Suggested Next Steps. Be balanced and label uncertainty explicitly. Do not invent citations — if you reference something, say "according to general knowledge".` },
            { role: "user", content: `Research topic: ${topic}` },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolShell title="AI Research Assistant" description="Get a balanced, structured briefing on any topic." icon={<Search className="h-6 w-6" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Topic or question</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Impact of AI on knowledge work" />
          </div>
          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief (1 page)</SelectItem>
                <SelectItem value="detailed">Detailed (deep dive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching...</> : "Generate Briefing"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Note: This tool does not browse the live web. Always verify facts independently.
          </p>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Briefing (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            )}
          </div>
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={20} className="flex-1 font-mono text-sm" placeholder="Your briefing will appear here..." />
        </Card>
      </div>
    </AIToolShell>
  );
}
