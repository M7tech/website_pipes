import { llmsTxt } from "@/lib/llms";

/** /llms.txt for AI assistants and answer engines, generated at build time from the site content. */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
