
# Tunicate Genomics Portal — project overview

Static portal (HTML + Bootstrap 5 via CDN, no build step) for tunicate web
resources and genome datasets. Site lives in `public/` (`index.html` = resources,
`genomes.html` = genome datasets). All genome data is in one file:
`public/assets/js/genomes-data.js`, rendered by `public/assets/js/genomes.js`.

**Automation (GitHub Actions, `.github/workflows/`)** — know these before changing data or scripts:

| Workflow | When | What | Script |
|---|---|---|---|
| `pages.yml` | push to `main` | checks the data, writes `public/data/genomes.json`, publishes `public/` | `scripts/validate_data.cjs`, `scripts/export_genomes_json.cjs` |
| `check-data.yml` | pull requests touching data/scripts | ✓/✗ on the PR from the same data checks | `scripts/validate_data.cjs` |
| `ncbi-watch.yml` | Mondays 00:17 UTC, or by hand | NCBI (taxon 7712) vs the data file → issue `ncbi-watch` + Discord (secret `DISCORD_WEBHOOK_URL`) | `scripts/ncbi_watch.py`, `scripts/ncbi_watch_notify.sh` |

Contributions also come in through issue forms (`.github/ISSUE_TEMPLATE/`: add a genome,
add a resource, report a mistake). `data/genomes.json` is generated — never edit or commit
it (git-ignored); its shape is in UPDATING.md §9.

**If asked to update genomes / gene models from NCBI (or refresh the datasets),
READ [`UPDATING.md`](./UPDATING.md) first** — it is the maintenance handoff
(data model, NCBI Datasets API, TUNOME gene-model rules, verification steps).

**After touching `style.css`, `genomes.js` or `genomes-data.js`, bump the `?v=<date>`
cache-buster on the `<link>`/`<script>` tags in BOTH `public/genomes.html` and
`public/index.html`** — GitHub Pages does not content-hash assets, so without it
visitors keep the old JS and the update appears not to have happened
(§6 of [`UPDATING.md`](./UPDATING.md)).

**Resource-card icons** live in `public/assets/img/icons/` (one PNG per card on
`index.html`, referenced from the card's `<span class="rc-icon rc-img">`). Keep them
light — the pipeline for a new logo is
`convert SRC -fuzz 3% -trim +repage -strip -resize 104x104\> -colors 128 out.png`
(~2–5 kB each, displayed in a 52 px badge). Cards without a logo keep an emoji badge.

**After editing `genomes-data.js`, run `node scripts/validate_data.cjs`** (must say OK) —
pull requests and deployments run the same check. Every species needs a `taxid` (NCBI
Taxonomy ID) or, only if NCBI has none, an `id` (UPDATING.md §2a). Scripts in `scripts/`
are `.cjs` because package.json sets `"type": "module"`.

**The portal must not depend on any external database** (TUNOME, ANISEED, …): they are
linked, never read at runtime or required for an update. Dependencies may only point the
other way (they may read `data/genomes.json`).

**Always log your work:** after adding a feature or performing an update, append
an entry to [`CHANGELOG.md`](./CHANGELOG.md) (newest at the top, under a
`## YYYY-MM-DD` heading — today's date is in the session context). Do this as the
final step of any substantive change, before finishing.

**Contributions come as Pull Requests.** Most people editing this repo are outside
contributors working on a fork (they cloned with `gh repo fork … --clone --remote`,
so `origin` = their fork, `upstream` = the main repo). When you finish a change for
such a user, don't push to the main repo — commit, `git push` to their fork's `origin`,
then open a PR with `gh pr create --repo ttshito/tunicate-portal --fill` (confirm first
if the change is large). Only push straight to `main` when the user is the maintainer
working in the main repo.

Note: `bun` is NOT on PATH in this environment despite the guidance below — use
`node --check` for JS syntax and `python -m http.server` (from `public/`) or
Windows Chrome headless for previews/screenshots.

---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
