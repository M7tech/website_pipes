import { SITE_URL } from "@/lib/site";

/**
 * IndexNow (https://www.indexnow.org) tells Bing, Yandex, Seznam, Naver and the other
 * participating engines that pages changed, so they recrawl them within minutes.
 * The key is public by design: it is served at /<key>.txt (public/) to prove ownership of the host.
 */
export const INDEXNOW_KEY = "10a24adcefe968996992d893b0bf54d0";

const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Submits up to 10,000 URLs on SITE_URL's host. Returns the HTTP status (200 or 202 means accepted). */
export async function submitToIndexNow(urls: string[]) {
  const host = new URL(SITE_URL).host;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.filter((u) => new URL(u).host === host).slice(0, 10_000),
    }),
  });
  return res.status;
}
