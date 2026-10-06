/**
 * Runs once when the production server starts. With INDEXNOW_SUBMIT=true (set it on the live
 * domain only, never on the preview), every sitemap URL is sent to IndexNow shortly after start,
 * so each deploy reaches Bing and the other IndexNow engines straight away.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.INDEXNOW_SUBMIT !== "true") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const scope = globalThis as { indexNowScheduled?: boolean };
  if (scope.indexNowScheduled) return;
  scope.indexNowScheduled = true;

  // Wait until the server answers, so the engines can fetch the key file when they verify it.
  setTimeout(async () => {
    try {
      const [{ default: sitemap }, { submitToIndexNow }] = await Promise.all([
        import("./app/sitemap"),
        import("./lib/indexnow"),
      ]);
      const urls = sitemap().map((entry) => entry.url);
      const status = await submitToIndexNow(urls);
      console.log(`IndexNow: submitted ${urls.length} URLs, status ${status}`);
    } catch (error) {
      console.error("IndexNow: submission failed", error);
    }
  }, 30_000).unref();
}
