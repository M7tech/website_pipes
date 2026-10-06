import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Search engines and AI search and answer crawlers, named so the welcome is explicit:
 * OpenAI (OAI-SearchBot for ChatGPT search, ChatGPT-User, GPTBot), Anthropic, Perplexity,
 * Google (incl. Google-Extended for Gemini), Microsoft Bing/Copilot, Apple, DuckDuckGo,
 * Yandex and Common Crawl. Everything else is allowed by the `*` rule as well.
 */
const crawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "YandexBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: crawlers, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
