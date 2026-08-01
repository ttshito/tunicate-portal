
# Tunicate Genomics Portal — project overview

Static portal (HTML + Bootstrap 5 via CDN, no build step) for tunicate web
resources and genome datasets. Site lives in `public/` (`index.html` = resources,
`genomes.html` = genome datasets). All genome data is in one file:
`public/assets/js/genomes-data.js`, rendered by `public/assets/js/genomes.js`.

**If asked to update genomes / gene models from NCBI (or refresh the datasets),
READ [`UPDATING.md`](./UPDATING.md) first** — it is the maintenance handoff
(data model, NCBI Datasets API, TUNOME gene-model rules, verification steps).

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
