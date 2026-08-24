import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_enquiries",
  title: "List Workflow Review enquiries",
  description:
    "List enquiries submitted through the Quietcrew Workflow Review form, newest first. Requires an administrator account.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("How many enquiries to return."),
    search: z
      .string()
      .trim()
      .min(2)
      .optional()
      .describe("Optional text to match against the company name or the manual work described."),
  },
  outputSchema: {
    enquiries: z.array(z.record(z.string(), z.unknown())),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }

    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("enquiries")
      .select("id, name, company, email, company_size, systems, manual_work, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);

    if (search) {
      query = query.or(`company.ilike.%${search}%,manual_work.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    if (!data || data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No enquiries were returned. Either none have been submitted yet, or this account does not hold the administrator role.",
          },
        ],
        structuredContent: { enquiries: [] },
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { enquiries: data },
    };
  },
});
