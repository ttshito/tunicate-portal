# Changelog

All notable changes to the Tunicate Portal are recorded here.

**How to maintain this file:** whenever you add a feature or update the data,
add an entry. Put new entries at the **top**, under a dated heading
(`## YYYY-MM-DD`). Keep bullets short and factual — what changed and why.
Group under **Added / Changed / Fixed / Data**. If several changes happen the
same day, add bullets under that day's heading rather than a new one.
(See `UPDATING.md` for the data-update procedure.)

---

## 2026-08-01 — Molgula appendiculata sequencing in progress

### Data
- Sequencing in progress: **Molgula appendiculata** (Molgulidae, Stolidobranchia) —
  2026, Sébastien Darras, CNRS – Sorbonne University, France. Verified against the NCBI
  Datasets API that no public *Molgula* assembly exists (taxid 7712 report).
- Bumped `updated` in `genomes-data.js` to 2026-08-01.

### Removed
- Sequencing in progress: **Rhopalaea idoneta** (Diazonidae, Phlebobranchia) — it was a
  mock/placeholder entry added on 2026-07-28 to demonstrate the feature, not a real
  project. The `status: "progress"` example in `UPDATING.md` §5b now uses a real entry.

## 2026-07-28 — MARIMBA + Octopus resources, new in-progress species

### Added
- Resources → Genomics: **Octopus Database** (https://octopus.obs-vlfr.fr/) — LBDV
  Villefranche-sur-Mer genome/BLAST server (JBrowse, gene-prediction and sequence tools;
  public *Botryllus schlosseri* BLAST + 2025 genome annotation; other databases restricted).

### Changed
- Resources → Genomics: the placeholder "Botryllus schlosseri Database" card (no link)
  is replaced by **MARIMBA** (https://marimba.obs-vlfr.fr/) — Marine Invertebrate Models
  Database, whose tunicate model is *B. schlosseri* (genome browser, BLAST, expression,
  stage/anatomy ontologies, molecular tools).

### Data
- Sequencing in progress: **Polyandrocarpa zorritensis** (Styelidae, Stolidobranchia) —
  2026, Stefano Tiozzo, CNRS – Sorbonne University, France. Verified against the NCBI
  Datasets API that no public *Polyandrocarpa* assembly exists (taxid 7712 report).
- `updated` stamp bumped to 2026-07-28. Note: the NCBI assembly set itself was **not**
  re-pulled in this change — only the in-progress entry was added.

## 2026-07-22 — Contributor workflow (Claude + Pull Requests)

### Added
- README "Add or change something (just ask Claude)" section: contributors fork,
  open Claude Code, describe the change in plain language, and Claude opens a Pull
  Request. No write access handed out; maintainer reviews & merges.
- CLAUDE.md guidance so a contributor's Claude commits to their fork and opens a PR
  (`gh pr create`) rather than pushing to `main`.
- HOSTING.md reworked to recommend the PR model.

## 2026-07-22 — Published to GitHub Pages

### Added
- Git repository initialised and pushed to `github.com/ttshito/tunicate-portal`.
- Live at **https://ttshito.github.io/tunicate-portal/** via GitHub Pages
  (auto-deploys `public/` on every push through `.github/workflows/pages.yml`).
- `HOSTING.md` — beginner guide for hosting and inviting editors.
- `.claude/settings.local.json` added to `.gitignore` (local settings kept private).

## 2026-07-22 — Sequencing-in-progress species

### Added
- Support for **"sequencing in progress"** species (genome not yet public): set
  `status: "progress"` + a `progress` block in `genomes-data.js`. Rendered with a red
  species name + badge; expands to show status, year reported, and contact (routed via
  the Discord community, no email). Excluded from assembly/species counts; classes show
  a "· N in progress" tally. First entry: *Rhopalaea idoneta* (2026, Takumi Shito,
  University of the Ryukyus, Japan).
- Legend + "add your project via Discord" invite under the toolbar.
- "Data last updated" stamp on the genomes page (from `updated` in `genomes-data.js`),
  plus a site-owner quickstart at the top of `UPDATING.md`.

## 2026-07-22 — Initial build

### Added
- Two-page static portal (HTML + Bootstrap 5 via CDN, no build step), served from `public/`.
  - `index.html` — curated tunicate online resources, grouped into Genomics /
    Morphology / Community cards (ANISEED, GHOST, TUNOME, MorphoNet, TunicAnatO,
    RAMNe, GoaT, Botryllus schlosseri Database, Ascidian News, NCBI, Discord, …).
  - `genomes.html` — genome datasets, one collapsible row per species; click to
    expand assemblies.
- Ocean-theme shared CSS (`assets/css/style.css`); local preview server (`index.ts`, Bun).
- `itm` logo optimised (323 KB → ~23 KB, transparent) into `assets/img/`, wired into
  navbar + favicons.
- Community Discord link in the header and a Community card.
- Data-driven genome table from a single source (`assets/js/genomes-data.js`) rendered
  by `assets/js/genomes.js`; live search + class-switch buttons (Ascidiacea /
  Appendicularia / Thaliacea, one table shown at a time).
- **Gene model** column: per-assembly chips for **NCBI** (RefSeq) and/or **TUNOME**
  (with per-assembly link override, e.g. Ciona HT → GHOST). Both shown when both exist.
- `UPDATING.md` maintenance/handoff guide and this `CHANGELOG.md`.

### Changed
- Genome table reworked several times per feedback: separate table per class with
  switch buttons; columns reduced to Family (left, shown once per family) + Species,
  with assembly details (Assembly / Size / Year / Source / Gene model / Notes) inside
  the expansion; uniform expand behaviour for single- and multi-assembly species;
  faint divider between families; expansion sorted by year (newest first); class names
  (Ascidiacea etc.) not italicised.

### Data
- Genome assemblies compiled from the NCBI Datasets API (taxon 7712), organised by
  class → order (Phlebobranchia → Aplousobranchia → Stolidobranchia) → family.
- Gene-model ↔ assembly mapping added from TUNOME (Downloads page + the maintainer's
  Supplementary Table S1). Non-NCBI genomes included with ANISEED/GHOST/Ryan Lab
  sources (Molgula ×3, Botrylloides leachii, Corella inflata, Ciona Type-A GHOST HT).
- Current totals: **82 assemblies · 63 species · 3 classes**; 38 assemblies with a
  TUNOME gene model, 13 with an NCBI RefSeq annotation.
- `SupplementaryMaterial_1_260409.xlsx` kept at project root, git-ignored, not served.
