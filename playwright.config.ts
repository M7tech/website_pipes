import { defineConfig, devices } from "@playwright/test";

/**
 * Site QA: layout, errors, headings and accessibility in every locale.
 * Runs against BASE_URL when set (e.g. a running `next start`), otherwise builds and starts one.
 */
const port = 3100;
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL, ...devices["Desktop Chrome"] },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npm run build && npm run start -- -p ${port}`, url: `${baseURL}/en`, timeout: 300_000, reuseExistingServer: true },
});
