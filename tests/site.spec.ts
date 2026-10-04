import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locales = [
  { code: "en", dir: "ltr" },
  { code: "ar", dir: "rtl" },
  { code: "ckb", dir: "rtl" },
] as const;

/** One page per template; add a path here when a new template ships. */
const paths = [
  "",
  "/solutions",
  "/solutions/water-supply",
  "/brands",
  "/brands/polymelt",
  "/brands/fv-plast",
  "/about",
  "/locations",
  "/contact",
  "/projects",
];

const widths = [375, 768, 1440];

/** Collects console errors and failed or 4xx/5xx requests while the page loads. */
function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => problems.push(`failed: ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && problems.push(`${r.status()}: ${r.url()}`));
  return problems;
}

for (const { code, dir } of locales) {
  for (const path of paths) {
    test.describe(`/${code}${path}`, () => {
      for (const width of widths) {
        test(`layout at ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          const problems = watch(page);
          await page.goto(`/${code}${path}`, { waitUntil: "networkidle" });

          await expect(page.locator("html")).toHaveAttribute("lang", code);
          await expect(page.locator("html")).toHaveAttribute("dir", dir);
          await expect(page.locator("h1")).toHaveCount(1);

          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(overflow, "horizontal overflow").toBeLessThanOrEqual(0);

          const broken = await page.evaluate(() =>
            [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
          );
          expect(broken, "broken images").toEqual([]);
          expect(problems).toEqual([]);
        });
      }

      test("accessibility (axe, WCAG 2.1 AA)", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`/${code}${path}`, { waitUntil: "networkidle" });
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    });
  }
}

test("mobile menu keeps focus inside and returns it on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/en");
  const burger = page.locator('button[aria-controls="mobile-menu"]');
  await burger.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await expect(page.locator("#main")).toHaveAttribute("inert", "");

  // Tab well past the number of menu items: focus must stay in the header.
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("header"))).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect(burger).toBeFocused();
  await expect(page.locator("#main")).not.toHaveAttribute("inert", "");
});
