import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "whoami",
  title: "Who am I",
  description:
    "Report the signed-in Quietcrew account and whether it holds the administrator role needed to read enquiries.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", ctx.getUserId());

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const roles = (data ?? []).map((row) => (row as { role: string }).role);
    const identity = {
      email: ctx.getUserEmail() ?? null,
      roles,
      isAdmin: roles.includes("admin"),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(identity, null, 2) }],
      structuredContent: identity,
    };
  },
});
