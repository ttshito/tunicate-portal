/**
 * Local preview server for the Tunicate Genomics Portal.
 *
 * The site itself is 100% static (HTML + CSS + images, Bootstrap via CDN) and
 * can be opened directly with file:// or dropped on any static host. This
 * server just exists for convenient local development:
 *
 *   bun run index.ts        # then open http://localhost:3000
 */
import { file } from "bun";
import { join, normalize } from "node:path";

const ROOT = join(import.meta.dir, "public");

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") pathname = "/index.html";

    // prevent path traversal
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(ROOT, safe);

    let f = file(filePath);
    if (!(await f.exists())) {
      // allow extension-less routes like /genomes
      const withHtml = file(filePath + ".html");
      if (await withHtml.exists()) {
        f = withHtml;
      } else {
        return new Response("404 — Not Found", { status: 404 });
      }
    }
    return new Response(f);
  },
});

console.log(`🐚 Tunicate Genomics Portal running at http://localhost:${server.port}`);
