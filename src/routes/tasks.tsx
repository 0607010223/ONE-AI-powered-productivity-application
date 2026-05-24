import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Loader2, Copy } from "lucide-react";
import { AIToolShell } from "@/components/AIToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

function TasksPage() {
  const run = useServerFn(runAI);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) { toast.error("Describe the goal you want to plan."); return; }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          messages: [
            { role: "system", content: "You are a project planner. Break a goal into clear, ordered tasks. Output markdown with: ## Plan Overview (1-2 sentences), ## Tasks — a numbered list, each task with: title, priority (High/Medium/Low), estimated time, suggested deadline (relative to the user's deadline if given), and 1-line description. End with ## Next Step (the single first action)." },
            { role: "user", content: `Goal: ${goal}\nDeadline: ${deadline || "not specified"}\nContext: ${context || "none"}` },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIToolShell title="AI Task Planner" description="Turn fuzzy goals into a prioritized, time-boxed plan." icon={<ListTodo className="h-6 w-6" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Goal</Label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Launch Q3 marketing campaign" />
          </div>
          <div className="space-y-2">
            <Label>Deadline (optional)</Label>
            <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="e.g. in 2 weeks, by Friday" />
          </div>
          <div className="space-y-2">
            <Label>Context (optional)</Label>
            <Textarea rows={6} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Team size, constraints, dependencies..." />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning...</> : "Generate Plan"}
          </Button>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Plan (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            )}
          </div>
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={20} className="flex-1 font-mono text-sm" placeholder="Your task plan will appear here..." />
        </Card>
      </div>
    </AIToolShell>
  );
}
