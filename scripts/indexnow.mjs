// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver and others).
// Usage: npm run indexnow            (uses https://atlasplast.iq)
//        SITE_URL=https://atlasplast.iq npm run indexnow
// The key must match src/lib/indexnow.ts and public/<key>.txt.

const KEY = "10a24adcefe968996992d893b0bf54d0";
const site = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlasplast.iq").replace(/\/$/, "");
const host = new URL(site).host;

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === host);
if (!urls.length) throw new Error(`No URLs for ${host} in ${site}/sitemap.xml`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs for ${host}, status ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exit(1);
