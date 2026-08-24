import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "enquiry_stats",
  title: "Summarise enquiries",
  description:
    "Count Workflow Review enquiries over a recent window and break them down by company size. Requires an administrator account.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("How many days back to include."),
  },
  outputSchema: {
    windowDays: z.number(),
    total: z.number(),
    byCompanySize: z.record(z.string(), z.number()),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }

    const window = days ?? 30;
    const since = new Date(Date.now() - window * 24 * 60 * 60 * 1000).toISOString();
    const supabase = supabaseForUser(ctx);

    const { data, error } = await supabase
      .from("enquiries")
      .select("company_size, created_at")
      .gte("created_at", since);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const rows = data ?? [];
    const bySize: Record<string, number> = {};
    for (const row of rows) {
      const size = (row as { company_size: string | null }).company_size ?? "unknown";
      bySize[size] = (bySize[size] ?? 0) + 1;
    }

    const summary = { windowDays: window, total: rows.length, byCompanySize: bySize };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
