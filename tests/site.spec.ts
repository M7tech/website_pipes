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
  "/about/board",
  "/locations",
  "/contact",
  "/projects",
  "/media",
  "/links",
];

const widths = [375, 768, 1440];

/** YouTube thumbnails load from YouTube itself, which the test sandbox may not reach. */
const thirdParty = (url: string) => /^https:\/\/(i\.ytimg\.com|[\w.-]*youtube(-nocookie)?\.com)\//.test(url);

/** Collects console errors and failed or 4xx/5xx requests while the page loads. */
function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error" || thirdParty(m.location().url)) return;
    // A blocked third-party resource reports as a console error with no source location.
    if (/Failed to load resource/.test(m.text()) && !m.location().url) return;
    problems.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => thirdParty(r.url()) || problems.push(`failed: ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && !thirdParty(r.url()) && problems.push(`${r.status()}: ${r.url()}`));
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
            [...document.images]
              .filter((i) => i.src.startsWith(location.origin) && i.complete && i.naturalWidth === 0)
              .map((i) => i.src),
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

test("every office opens in Google Maps", async ({ page }) => {
  await page.goto("/en/locations");
  const links = page.locator('main a[href^="https://maps.google.com/?cid="]');
  // Six offices in the branch list, six in the presence list and one per office city on the map.
  expect(await links.count()).toBeGreaterThanOrEqual(12);
  await expect(links.first()).toHaveAttribute("target", "_blank");
  await expect(page.locator('main a[href^="https://www.google.com/maps/search/"]')).toHaveCount(0);
});

test("Contact: 6475 is Al-Shaab's WhatsApp, 6604 is Camp Sara's, Duhok has its own pin", async ({ page }) => {
  for (const code of ["en", "ar", "ckb"]) {
    await page.goto(`/${code}/contact`);
    const branches = page.locator('section[aria-labelledby="branches-title"] li');
    await expect(branches.nth(0), code).toContainText("+964 787 116 6604");
    await expect(branches.nth(1), code).toContainText("+964 783 305 6475");
    await expect(branches.nth(5).locator('a[href^="https://maps.google.com/"]')).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=12732420289314848059",
    );
  }
  await expect(page.locator('main a[href="tel:6779"]')).toHaveCount(1);
  await expect(page.locator('main a[href="https://wa.me/9647833056475"]').first()).toBeVisible();
});

test("maps show at once with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/en/locations", "/ar/contact"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    const map = page.locator("main svg[aria-label]").first();
    await map.scrollIntoViewIfNeeded();
    expect(await map.evaluate((el) => getComputedStyle(el.parentElement!).clipPath), path).toBe("none");
  }
});

test("Arabic copy uses the owner's trade terms", async ({ page }) => {
  for (const path of ["/ar", "/ar/solutions/sanitaryware", "/ar/brands/wisa"]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text, path).not.toMatch(/سيفون|الفنيين|فنيين/);
  }
});

test("owner corrections: nine months of stock, KAS PPR only, solution photos", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("main")).toContainText("Nine months");
  await page.goto("/en/brands/kas");
  expect(await page.locator("main").innerText()).not.toContain("PPR-C");
  await page.goto("/en/solutions/water-supply");
  // Product photos cross-fade behind the header text, with one dot per photo.
  await expect(page.locator("main header img").first()).toBeVisible();
  await expect(page.locator('main header [aria-roledescription="carousel"] button')).not.toHaveCount(0);
});

test("galvanized fittings are a Georg Fischer solution made in Austria", async ({ page }) => {
  await page.goto("/en/solutions/galvanized-fittings");
  await expect(page.locator("h1")).toHaveText("Galvanized fittings");
  const main = page.locator("main");
  await expect(main).toContainText("Georg Fischer");
  await expect(main.locator("dl", { hasText: "Made in" })).toContainText("Austria");
  await page.goto("/en/solutions/water-supply");
  // The line moved out of water supply (the "other solutions" list below still links to it).
  expect(await page.locator('section[aria-labelledby="lines-title"]').innerText()).not.toContain("malleable");
  await page.goto("/ar/brands/georg-fischer");
  await expect(page.locator("main")).toContainText("النمسا");
});

test("ceramic and porcelain tiles are the tenth solution, on Home and in Solutions", async ({ page }) => {
  await page.goto("/en");
  const home = page.locator('section[aria-labelledby="solutions-title"]');
  await expect(home.locator("h2")).toHaveText("Ten solutions, one supplier.");
  await expect(home.locator('a[href^="/en/solutions/"]:not([href="/en/solutions"])')).toHaveCount(10);
  await home.locator('a[href="/en/solutions/tiles"]').click();
  await expect(page).toHaveURL(/\/en\/solutions\/tiles$/);
  await expect(page.locator("h1")).toHaveText("Ceramic and porcelain tiles");
  const lines = page.locator('section[aria-labelledby="lines-title"]');
  await expect(lines).toContainText("Porcelain tiles");
  await expect(lines).toContainText("Ceramic tiles");
  await expect(lines).toContainText("R9 · R10 · R11");
  // The tiles moved out of sanitaryware.
  await page.goto("/en/solutions/sanitaryware");
  expect(await page.locator('section[aria-labelledby="lines-title"]').innerText()).not.toContain("tiles");
  await page.goto("/ar/solutions/tiles");
  await expect(page.locator("h1")).toHaveText("السيراميك والبورسلين");
});

test("About carries vision, mission and the full history", async ({ page }) => {
  await page.goto("/en/about");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "Our vision" })).toBeVisible();
  await expect(main.getByRole("heading", { name: "Our mission" })).toBeVisible();
  for (const text of ["1990–2003", "Sulaymaniyah", "ARBAK", "FABCO", "Management returns to Baghdad"]) {
    await expect(main, text).toContainText(text);
  }
  // Home keeps the short list.
  await page.goto("/en");
  expect(await page.locator("main").innerText()).not.toContain("ARBAK");
});

test("media page lists the channel's videos and YouTube is in Follow us", async ({ page }) => {
  await page.goto("/en/media");
  await expect(page.getByLabel("Main navigation").getByRole("link", { name: "Media" })).toHaveAttribute("aria-current", "page");
  // Click to load: nothing is embedded until a video is played.
  await expect(page.locator("main iframe")).toHaveCount(0);
  await page.locator("main figure button").click();
  await expect(page.locator('main iframe[src^="https://www.youtube-nocookie.com/embed/"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="https://www.youtube.com/@atlasplast"]')).toHaveText("YouTube");
  await page.goto("/ar/contact");
  await expect(page.locator('main a[href="https://www.youtube.com/@atlasplast"]')).toHaveText("YouTube");
});

test("the unlisted links page keeps the old address, the office pins and stays out of menus", async ({ page, request }) => {
  // The old site's /روابط/ and /ar/روابط/ land on the Arabic page.
  for (const old of ["/%D8%B1%D9%88%D8%A7%D8%A8%D8%B7/", "/ar/%D8%B1%D9%88%D8%A7%D8%A8%D8%B7"]) {
    await page.goto(old);
    await expect(page, old).toHaveURL(/\/ar\/links$/);
  }
  await expect(page.locator("h1")).toHaveText("روابط");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const main = page.locator("main");
  await expect(main.locator('a[href="tel:6779"]')).toHaveCount(1);
  await expect(main.locator('a[href="https://www.youtube.com/@atlasplast"]')).toHaveCount(1);
  await expect(main.locator('a[href^="https://play.google.com/"]')).toHaveCount(1);
  await expect(main.locator('a[href^="https://apps.apple.com/"]')).toHaveCount(1);
  // Every office opens its exact Google Maps place, not a search.
  await expect(main.locator('a[href^="https://maps.google.com/?cid="]')).toHaveCount(6);
  await expect(main.locator('a[href^="https://www.google.com/maps/search/"]')).toHaveCount(0);

  for (const path of ["/ar", "/en/contact"]) {
    await page.goto(path);
    await expect(page.locator('a[href$="/links"]'), path).toHaveCount(0);
  }
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/links");
});

test("About leads to the Chairman's message and the board members", async ({ page }) => {
  await page.goto("/ar/about");
  await page.locator('main a[href="/ar/about/board"]').click();
  await expect(page).toHaveURL(/\/ar\/about\/board$/);
  await expect(page.locator("h1")).toHaveText("كلمة رئيس مجلس الإدارة");
  await expect(page.getByLabel("القائمة الرئيسية").getByRole("link", { name: "من نحن" })).toHaveAttribute("aria-current", "page");
  const main = page.locator("main");
  await expect(main).toContainText("جعفر الموسوي");
  await expect(main).toContainText("رئيس مجلس إدارة مجموعة أطلس");

  await page.goto("/en/about/board");
  await expect(page.locator("main")).toContainText("over four decades");
  for (const name of ["Jaafar Almusawi", "Omer Ibrahim", "Mohammed Bajalan"]) {
    const photo = page.getByRole("img", { name, exact: true }).first();
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toBeVisible();
    expect(await photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), name).toBe(true);
  }
  await expect(page.locator('section[aria-labelledby="board-title"] li')).toHaveCount(2);
  // The owner's portrait of the chairman, and the three values his message names.
  await expect(page.locator('main header img[alt="Jaafar Almusawi"]')).toHaveAttribute("src", /jaafar-almusawi-portrait/);
  await expect(page.locator("main li", { hasText: /^(Excellence|Integrity|Progress)$/ })).toHaveCount(3);
});

test("moving photos can be paused on touch screens", async ({ page }) => {
  await page.goto("/en/brands");
  const track = page.locator(".current-track").first();
  await page.getByRole("button", { name: "Pause slideshow" }).first().click();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Play slideshow" }).first().click();
  await page.mouse.move(0, 0);
  await expect(track).toHaveCSS("animation-play-state", "running");

  await page.goto("/en/solutions/water-supply");
  const photos = page.getByRole("group", { name: "Water supply pipes: product photos" });
  await photos.getByRole("button", { name: "Pause slideshow" }).click();
  await expect(photos.getByRole("button", { name: "Play slideshow" })).toBeVisible();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("Play resumes the slideshows straight after a tap", async ({ page }) => {
    await page.goto("/en");
    const hero = page.locator('section[aria-roledescription="carousel"]');
    await hero.getByRole("button", { name: "Pause slideshow" }).tap();
    await hero.getByRole("button", { name: "Play slideshow" }).tap();
    await expect(page.locator('[role="tab"][aria-selected="true"] span[style*="hero-progress"]')).toHaveCSS(
      "animation-play-state",
      "running",
    );

    await page.goto("/en/solutions/water-supply");
    const photos = page.getByRole("group", { name: "Water supply pipes: product photos" });
    await photos.getByRole("button", { name: "Pause slideshow" }).tap();
    await photos.getByRole("button", { name: "Play slideshow" }).tap();
    await expect(photos.locator('button[aria-current="true"]')).not.toHaveAttribute("aria-label", "Photo 1 of 5", {
      timeout: 8000,
    });
  });
});
