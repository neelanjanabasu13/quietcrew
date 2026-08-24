import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listEnquiriesTool from "./tools/list-enquiries";
import enquiryStatsTool from "./tools/enquiry-stats";
import whoamiTool from "./tools/whoami";

// The OAuth issuer must be the direct Supabase host, so it is built from the
// project ref, which is the one value that survives publish unchanged.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "quietcrew",
  title: "Quietcrew",
  version: "0.1.0",
  instructions:
    "Tools for the Quietcrew website. Use whoami to confirm the signed-in account and its role, list_enquiries to read Workflow Review enquiries, and enquiry_stats to summarise recent enquiries. Reading enquiries requires an administrator account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoamiTool, listEnquiriesTool, enquiryStatsTool],
});
