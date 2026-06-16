#!/usr/bin/env node
/**
 * Optional helper for converting saved article HTML into structured JSON.
 * Usage: node scripts/ingest-article-content.mjs path/to/article.html > output.json
 *
 * withpersona.com is Cloudflare-protected — save article HTML from a browser session first.
 */

import { readFileSync } from "node:fs";

const html = readFileSync(process.argv[2] ?? 0, "utf8");

const stripTags = (value) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  .map((match) => stripTags(match[1]))
  .filter((text) => text.length > 40);

const output = {
  abstract: paragraphs[0] ?? "",
  blocks: paragraphs.slice(1).map((text) => ({ type: "paragraph", text })),
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
