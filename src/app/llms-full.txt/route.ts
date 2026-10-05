import { llmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: llms.txt plus product specifications and every FAQ answer in en, ar and ckb. */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
