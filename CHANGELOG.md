# Changelog

All notable changes to the Tunicate Genomics Portal are recorded here.

**How to maintain this file:** whenever you add a feature or update the data,
add an entry. Put new entries at the **top**, under a dated heading
(`## YYYY-MM-DD`). Keep bullets short and factual — what changed and why.
Group under **Added / Changed / Fixed / Data**. If several changes happen the
same day, add bullets under that day's heading rather than a new one.
(See `UPDATING.md` for the data-update procedure.)

---

## 2026-08-21

### Data
- Added the 23 unpublished genomes of the Soka University (M. Nydam) WGS panel,
  all shown in red as "assembled · not public". 18 are new species rows
  (3 *Ascidia*, 6 Pyuridae, 4 Botryllinae, 5 Didemnidae); the remaining 5
  (*Diplosoma listerianum*, *Microcosmus squamiger*, *Botrylloides diegensis*,
  *B. violaceus*, *Symplegma brakenhielmi*) already have a public assembly, so the
  unreleased dataset was added as an `unpublished: true` assembly inside them
  instead of a duplicate red row.
- Bumped `updated` to 2026-08-21. Public counts are unchanged (63 species /
  87 assemblies) — nothing unreleased is counted.

### Added
- Hero badge "N not public yet" (red) — counts the red species rows plus the
  `unpublished` assemblies. The other four badges stay public-only, so
  "87 assemblies" never counts a genome nobody can download.
- `unpublished: true` on an assembly: renders a red row in the species expansion
  with Source = *not released*, and is excluded from every count (hero stats,
  per-class totals, the "N assemblies" chip, the chromosome-level badge).

### Changed
- Red (no-public-genome) rows now carry detail instead of just a contact. New
  optional `progress` keys: `state` ("sequencing" | "assembled"), `size`, `level`,
  `site` (sampling site), `gm`, `since`, `url`, `note`. All optional — existing
  contact-only entries render as before.
- The badge follows `state`: "sequencing in progress" vs "assembled · not public".
  The collapsed row stays name + badge only; all the detail is in the expansion.
- "Reported" (info made available) and "Project started" are separate lines, and the
  contact's lab/faculty page is linked from "Get in touch" alongside Discord.
- Per-class header count reads "· N not public yet" (was "· N in progress").
- Reworded the red-row legend on `genomes.html`; documented all of the above in
  §5b of `UPDATING.md`.

## 2026-08-11 — Assembly level (chromosome / scaffold / contig) on the genomes page

### Added
- **`level` field on every assembly** in `genomes-data.js` (`"Chromosome"` |
  `"Scaffold"` | `"Contig"`). Taken from the NCBI Datasets field
  `assembly_info.assembly_level` for all 75 accessioned assemblies (fetched
  2026-08-11, taxon 7712); the 7 non-NCBI assemblies are set from their source
  publications — HT (Ghost/KY21) = Chromosome (Satou et al. 2019: 95 % of the genome
  in 14 chromosomes), ENS81 / Core_infl / Bleachii SBv3 / the three Molgula 2014
  drafts = Scaffold. Totals: **47 chromosome · 28 scaffold · 7 contig**, 43 species
  with at least one chromosome-level assembly.
- Genome Datasets → expanded table: a **Level** column with a colour-coded chip.
- **`chrPct` on every chromosome-level assembly** — the share of the assembly actually
  placed on chromosomes, computed from the NCBI sequence report
  (`role == "assembled-molecule"`). Shown on the chip as `Chromosome 68%`, because
  NCBI's "Chromosome" only means *some* sequence is on a chromosome: *Ciona* **KH**
  is 67.9 % anchored (78 Mb on 14 chromosomes, 37 Mb in 1,257 unplaced scaffolds,
  scaffold N50 3.1 Mb) while 32 of the 46 accessioned chromosome-level assemblies are
  ≥ 95 %. The KH note now states this instead of calling it plainly "chromosome-level".
  Species badge rule is unchanged (any chromosome-level assembly).
- Genome Datasets → species rows: a green **chromosome-level** badge when any of the
  species' assemblies is chromosome-level; the level is also part of the search text
  (searching "chromosome" works).
- Genome Datasets → toolbar: **Chromosome-level only** checkbox, and a
  *N chromosome-level* hero badge.

### Data
- **+5 assemblies from the NCBI diff** (82 → 87; every GCA under taxon 7712 is now either
  an entry or named in a note): *Ciona intestinalis* **ASM5357250v1** `GCA_053572505.1`
  (partial — NCBI flags "genome length too small"), *Botryllus schlosseri*
  **kaBotSchl7_p1.1** `GCA_059910395.1`, *Botrylloides violaceus* **kaBotViol2_p1.1**
  `GCA_047301215.1`, *Clavelina lepadiformis* **kaClaLepa18-hap1.1** `GCA_982319195.1`
  (NBIS Sweden, 9 chromosomes, 91.8 %), *Oikopleura dioica* **ASM20955v1**
  `GCA_000209555.1`. Their alternate haplotypes (`GCA_059910365.1`, `GCA_047301245.1`,
  `GCA_982319175.1`) are named in the notes, as elsewhere in the file.
- **The GHOST HT assembly now has an accession.** `GCA_009617815.2` (ASM961781v2, Kyoto,
  PacBio/MECAT, inbred Type-A line, 14 chromosomes, 95.6 % anchored) is the Satou et al.
  2019 HT assembly, so the HT entry uses `acc` instead of `resource` — its Source column
  links to NCBI, while the gene-model chip still points at GHOST (KY21 is GHOST-only).
  The "Genomes without an NCBI assembly" callout was updated accordingly.
- Both **suppressed RefSeq records** are now spelled out in their notes:
  `GCF_000224145.3` (Ciona KH, Annotation Release 104) and `GCF_013122585.1`
  (*Styela clava* ASM1312258v2) were retired because the species reference moved to a
  newer assembly ("superseded by newer assembly for species"); the GCA records stay
  current and the files are still served, so the NCBI chips stay.
- `updated` stamped **2026-08-11**.

### Fixed
- *Botryllus schlosseri* `356a-chromosome-assembly`: note now says NCBI classifies
  `GCA_000444245.1` as scaffold-level despite the assembly's name.

### Changed
- `UPDATING.md`: documents the `level` field, how to pull `assembly_level` from the
  Datasets report, the manual values for the non-NCBI assemblies, and a verify
  snippet that flags any assembly missing a level.

---

## 2026-08-01 — Renamed to Tunicate Genomics Portal; ANISEED chips; M. appendiculata

### Fixed
- Resources → GHOST card: it serves the **KY21 gene models on the HT assembly**, not
  "KH gene models". The *C. intestinalis* KH assembly note now says it is the basis of
  the KH2012 models and points out that KY21 lives on the GHOST HT assembly.

### Removed
- Genome Datasets → "Genomes without an NCBI assembly" callout: dropped *Salpa
  fusiformis* from the "not yet sequenced at all" line — singling out one salp species
  is arbitrary; the genus-level *Pyrosoma* / *Doliolum* statement stands.
- Resources → Community: the section eyebrow "Model Organism / Community" is now just
  **Community**.
- Resources → Genomics: the **GoaT (Genomes on a Tree)** card — a general tree-of-life
  genome hub, not a tunicate-community resource.

### Changed
- Resources → Genomics card order is now ANISEED, GHOST, MARIMBA, Octopus, **TUNOME**,
  putting the long-standing community resources first.
- **Site renamed "Tunicate Portal" → "Tunicate Genomics Portal"** (an older, unrelated
  project already used the former name). Applies to the browser titles, navbar brand,
  footer, Discord link label, docs and the preview server banner.
  The repository slug and the live URL stay `tunicate-portal` — the site is already
  distributed under that address, so it must not change.

### Added
- **Real logos on the Resources cards** instead of emoji: 12 icons in
  `public/assets/img/icons/` (ANISEED, GHOST, TUNOME, MARIMBA, Octopus, MorphoNet,
  TunicAnatO, RAMNe, Discord, GitHub, Ascidian News, NCBI). Sources were trimmed,
  downscaled to ≤104 px and palette-reduced — **44 kB for all 12** — and are shown in a
  52 px white rounded badge (`.rc-icon.rc-img`), lazy-loaded.
- **GitHub links on the site**: a "GitHub ↗" item in the navbar of both pages, a
  "GitHub repository ↗" entry in the footer's External list, and a "This portal on
  GitHub" card in the Community section of the Resources page.
- **ANISEED chip in the Gene model column**, alongside NCBI (RefSeq) and TUNOME/GHOST.
  New optional per-assembly field `aniseed: true` (+ `aniseedLabel`) in `genomes-data.js`;
  the chip links to the ANISEED download page. Flagged on the 11 species ANISEED serves
  gene models for, each on the assembly the model is actually built on: *Ciona robusta*
  (KH2012 → KH `GCA_000224145.2`, under *C. intestinalis*), *C. savignyi* (ENS81),
  *H. roretzi* / *H. aurantium* / *P. mammillata* / *P. fumigata* (MTP2014 assemblies),
  *B. schlosseri* (Stanford 2013 `botznik-chr`), *B. leachii* (SBv3), *M. oculata*
  (`Mocu_genome_v12`), *M. occidentalis* (aug 2015), *O. dioica* (Genoscope OdB3
  `GCA_000209535.1` — *not* the OKI2018 reference). Mapping table + how it was verified:
  `UPDATING.md` §4b.

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
