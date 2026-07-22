# Tunicate Portal

**Live site:** https://ttshito.github.io/tunicate-portal/

A small, **fully static** portal for tunicate (Urochordata) web resources.
Built with plain HTML + Bootstrap 5 (via CDN) so it is trivial to move: copy the
`public/` folder to any static host, or just open the files in a browser.

## Pages

| File                    | What it is                                                                 |
| ----------------------- | ------------------------------------------------------------------------- |
| `public/index.html`     | Curated links to online tunicate resources (genomics, morphology, community). |
| `public/genomes.html`   | Every publicly available tunicate genome assembly, grouped by phylogeny, each linking to NCBI. |

## Structure

```
public/
  index.html            # Resources portal
  genomes.html          # Genome datasets table
  assets/
    css/style.css       # Shared ocean theme (on top of Bootstrap)
    js/genomes.js       # Live search + class filter for the table (progressive enhancement)
    img/                # Drop photos here
index.ts                # Optional local preview server (Bun.serve)
```

Both pages are self-contained HTML. Bootstrap and fonts load from CDNs, so an
internet connection is needed for styling; everything else is local.

## Run locally

The site needs no build step. Either open `public/index.html` directly, or run
the tiny preview server:

```bash
bun install
bun run start        # http://localhost:3000
# or, with hot reload:
bun run dev
```

Any static file server works too (e.g. `python -m http.server` from `public/`).

## Editing content

- **Resource cards** — edit the `<div class="col-...">` card blocks in `public/index.html`.
- **Genome data** — edit `public/assets/js/genomes-data.js`, the single source of
  truth. Each species is one object with an `asm` array (primary assembly first):

  ```js
  { sp: "Genus species", family: "Familyidae", order: "Order", cls: "Ascidiacea",
    asm: [ { n: "AssemblyName", acc: "GCA_...", size: "120 Mb", year: 2025,
             ref: "Reference", note: "…" } ] }
  ```

  Each tunicate class (`cls`) gets its own table; the buttons at the top switch
  between them (one shown at a time). Within Ascidiacea, orders render in the
  sequence Phlebobranchia → Aplousobranchia → Stolidobranchia (see `ORDER_SEQ`
  in `genomes.js`). One collapsible row per species — species with several
  assemblies expand to list them all. The group headers, hero counts, per-class
  counts and search all update automatically. `assets/js/genomes.js` only
  renders and wires interaction; you shouldn't need to touch it.

## Hosting & collaboration

To put the site online for free and let others edit it, see **[`HOSTING.md`](./HOSTING.md)**
— a beginner guide to GitHub + GitHub Pages (auto-deploys `public/`) and inviting editors.

## Updating the data

Genome assemblies and gene models change over time. See **[`UPDATING.md`](./UPDATING.md)**
for the full maintenance guide (data model, pulling from the NCBI Datasets API,
TUNOME gene-model rules, and how to verify). In short: edit the single data file
`public/assets/js/genomes-data.js` — everything else updates automatically.

## Data sources

- Genome assemblies: NCBI Datasets API for Tunicata (taxid 7712), July 2026.
- Resource links point to third-party sites maintained by their institutions.

Corrections and additions welcome.
