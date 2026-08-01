# Updating the genome datasets — maintenance & handoff guide

> ## 🔄 Site owner: how to refresh the data
> Open Claude Code in this folder and say:
> ### 「UPDATING.md に従って、NCBIから最新のホヤゲノムデータに更新して」
> That's it — Claude reads this file and does the rest. Suggested every ~3–6 months
> (or when you hear of new genomes / gene models). The rest of this file is the how-to.

This file is the handoff for keeping the **Genome Datasets** page current as new
tunicate genome assemblies and gene models appear. It is written so a fresh
assistant (with no memory of past sessions) — or a human — can do the update.

> TL;DR: **all genome data lives in one file, `public/assets/js/genomes-data.js`.**
> Edit that array; the table, grouping, counts, search and gene-model chips all
> update automatically. Never hand-edit the rendered table (there is none — it's
> built by JS at load time).

---

## 1. What each file does

| File | Role | Edit when updating data? |
| ---- | ---- | ------------------------ |
| `public/assets/js/genomes-data.js` | **Single source of truth.** One object per species, each with an `asm` array of assemblies. | **YES — this is the file to edit.** |
| `public/assets/js/genomes.js` | Renderer + interaction (grouping, expand, search, chips). Reads the data file. | Only if changing behaviour/columns. |
| `public/genomes.html` | Page shell: hero, class-switch buttons, three empty `<tbody>`s, callout. | Rarely (e.g. new column header, callout text). |
| `public/assets/css/style.css` | Styling (shared with the Resources page). | Rarely. |
| `SupplementaryMaterial_1_260409.xlsx` | Source spreadsheet for gene-model ↔ assembly mapping (see §4). **Kept at project root, git-ignored, NOT served publicly.** | Reference only. |

The site is 100% static (open `public/index.html`, or serve `public/`). No build step.

---

## 2. Data model (`genomes-data.js`)

```js
{ sp: "Genus species",        // scientific name (italicised in the table)
  family: "Familyidae",
  order: "Phlebobranchia",    // see order sequence below
  cls: "Ascidiacea",          // "Ascidiacea" | "Appendicularia" | "Thaliacea"
  asm: [                      // assemblies, newest-relevant first (display re-sorts by year desc)
    { n: "AssemblyName",      // assembly name / label shown in the expansion
      acc: "GCA_0000000.1",   // GenBank accession → builds the NCBI "Source" link
      size: "120 Mb",         // free text ("64 Mb", "1.05 Gb")
      year: 2025,             // number, or null if unknown (sorts to the bottom)
      ref: "Reference",       // OPTIONAL small green tag (e.g. "Reference", "NCBI reference")
      refseq: "GCF_0000000.1",// OPTIONAL — presence = NCBI RefSeq annotation (NCBI gene model)
      gm: true,               // OPTIONAL — true = a TUNOME gene model exists on THIS assembly
      gmUrl: "https://…",     // OPTIONAL — override the gene-model link (default = TUNOME Downloads)
      gmLabel: "GHOST",       // OPTIONAL — override the gene-model chip label (default = "TUNOME")
      aniseed: true,          // OPTIONAL — true = an ANISEED gene model exists on THIS assembly
      aniseedLabel: "ANISEED",// OPTIONAL — override the ANISEED chip label
      resource: { url: "https://…", label: "ANISEED" }, // OPTIONAL — use INSTEAD of acc when there is no NCBI accession
      note: "free text …" }
  ]
}
```

Field rules:
- **Every assembly needs either `acc` (NCBI) or `resource` (non-NCBI).** The **Source**
  column shows the NCBI accession link, or the `resource` label/link (ANISEED, GHOST, Ryan Lab…).
- **`refseq`** → shows an **NCBI** chip in the Gene model column (links to the RefSeq
  genome page). This is how we say "NCBI has gene models for this assembly."
- **`gm: true`** → shows a **TUNOME** chip (or `gmLabel` if overridden, e.g. GHOST).
- **`aniseed: true`** → shows an **ANISEED** chip linking to the ANISEED download page
  (see §4b for the current species↔assembly mapping).
  All applicable chips appear together (`refseq` + `gm` + `aniseed`).
- Counts in the hero (`82 assemblies`, `63 species`, `3 classes`) and the per-class
  counts are computed from the data — do not hard-code them.

**Order sequence** within Ascidiacea is fixed in `genomes.js` (`ORDER_SEQ`):
Phlebobranchia → Aplousobranchia → Stolidobranchia. Appendicularia = Copelata,
Thaliacea = Salpida. Within an order, species are grouped by **family** (family name
shown once, on the left). Add new families/orders and they slot in; unknown orders
sort last (add them to `ORDER_SEQ` if you want a specific position).

---

## 3. Updating genome assemblies from NCBI

Goal: refresh the list of publicly available tunicate genome assemblies and their
metadata (size, year, RefSeq annotation).

1. **Pull the current set from the NCBI Datasets API** (taxon 7712 = Tunicata; this
   returns all descendants). Either method:

   - REST API (no install needed):
     ```bash
     curl -s 'https://api.ncbi.nlm.nih.gov/datasets/v2/genome/taxon/7712/dataset_report?page_size=1000' > tunicata.json
     ```
     Useful fields per report entry:
     - `accession` (GCA_… or GCF_…)
     - `organism.organism_name`
     - `assembly_info.assembly_name`, `assembly_info.release_date`
     - `assembly_stats.total_sequence_length` (bytes → Mb/Gb)
     - `paired_accession` (links a GCA to its GCF and vice-versa)
     - annotation present? → the entry has an `annotation_info` object, and/or a
       RefSeq (`GCF_`) `paired_accession`. **A GCF / annotation_info means NCBI has a
       gene model → set `refseq: "GCF_…"` on that assembly.**
   - Or the `datasets` CLI if available: `datasets summary genome taxon 7712 --as-json-lines`.
   - Or the web portal: https://www.ncbi.nlm.nih.gov/datasets/genome/?taxon=7712

2. **Diff against `genomes-data.js`.** For each species already present, add any new
   assemblies to its `asm` array; add brand-new species as new objects. Keep the
   comprehensive NCBI list (all haplotypes/versions are fine — put minor ones later
   in the array with a short `note`; the display sorts by `year`).

3. **Set `refseq`** on assemblies that have a RefSeq (GCF) annotation.

4. **Do not remove** the non-NCBI species/assemblies (they have `resource`, no `acc`) —
   see §4 and §5.

---

## 4. Updating gene models (TUNOME + others)

Gene models are **per-assembly**, and TUNOME is the main curated source.

**How to get the TUNOME coverage** (which species/assemblies have a TUNOME gene model):
- The TUNOME download page — https://ciona.bpni.bio.keio.ac.jp/Tunome/Latest/Downloads.php —
  lists every species TUNOME provides. The page builds its table **client-side from
  JavaScript** (`.../Tunome/Latest/js/download.js`, a hard-coded `tunicates` array of
  species + short ids, plus a MySQL call). Automated fetch tools (WebFetch) will NOT
  see the table because it isn't in the static HTML — fetch `js/download.js` directly,
  or ask the maintainer for the current list.
- The maintainer's spreadsheet `SupplementaryMaterial_1_260409.xlsx`, sheet **Table S1**,
  has one row per assembly with columns incl. **Gene Model (◯/X)**, **Assembly**, and
  **Resource** (the download link = which assembly the gene model is built on).

**IMPORTANT nuance (from the maintainer):** in Table S1 the **◯/X reflects the state
BEFORE TUNOME was created**. TUNOME then *made* gene models for ~35 species and *reused*
3 pre-existing high-quality ones as-is: **Ciona robusta (GHOST HT), Styela clava,
Clavelina lepadiformis**. So **every species on the TUNOME download page now has a gene
model** — do not treat S1's ✗ as "no gene model today." Use the download-page species
list for "has a TUNOME gene model," and use S1's *Resource/Assembly* column to decide
**which assembly** each gene model attaches to.

To apply:
- For each species with a TUNOME gene model, set `gm: true` on the **specific assembly**
  TUNOME used (often an older / ANISEED / GHOST assembly, NOT the newest one — e.g.
  Styela clava's gene model is on the old OUC `GCA_013122585.2`, not the ToL reference).
- If the gene model is hosted somewhere other than TUNOME, set `gmUrl` + `gmLabel`
  (e.g. Ciona HT uses `gmLabel: "GHOST"` + the GHOST download URL).
- NCBI RefSeq gene models are handled separately via `refseq` (§2). An assembly can show
  both **NCBI** and **TUNOME** chips.

---

## 4b. ANISEED gene models (`aniseed: true`)

ANISEED serves its own gene models for 13 species from one page:
https://aniseed.fr/aniseed/download/download_data?module=aniseed&action=download:download_data
(the per-species panels are built client-side, so WebFetch sees them but the version
labels are easiest to read from the download **file names** in the raw HTML).

Which assembly each ANISEED gene model sits on — verified 2026-08-01 by reading the
download file names and, where the page gives no version, by inspecting the fasta inside
the zip (HTTP range request + raw-deflate inflate → internal filename and scaffold names):

| Species (ANISEED) | ANISEED version | Assembly in this site's data |
| --- | --- | --- |
| C. robusta | KH2012 ("Joined Scaffold") | *C. intestinalis* **KH** `GCA_000224145.2` |
| C. savignyi | ENS81 | **ENS81** (Ensembl v81 on Broad CSAV2.0) |
| H. roretzi | MTP2014 (2018) | **Harore_MTP2014** `GCA_013436055.1` |
| P. mammillata | MTP2014 (2018) | **Phmamm_MTP2014** `GCA_003260075.1` |
| B. schlosseri | `botznik-chr.fa` (no version label) | **356a-chromosome-assembly** `GCA_000444245.1` (Stanford 2013) |
| B. leachii | SBv3 genome / v5 transcripts / v4 proteins | **Bleachii draft (SBv3)** (no GCA) |
| M. oculata | `Mocu_genome_v12` | **MolOcul2014** (no GCA) |
| M. occulta | august 2015 | **not flagged** — genome only, no ANISEED gene model |
| M. occidentalis | august 2015 | **MolOcci2014** (no GCA) |
| H. aurantium | MTP2014 (2018) | **Haaura_MTP2014** `GCA_013436065.1` |
| P. fumigata | MTP2014 (2018) | **Phfumi_MTP2014** `GCA_008931825.1` |
| O. dioica | OdB3 scaffolds (S1…), 2019 proteins | **ASM20953v1** `GCA_000209535.1` (Genoscope 2010) — *not* OKI2018 |
| B. villosa | anatomy/expression only | not flagged (no genomic data) |

Note *M. occulta* and *B. villosa*: ANISEED has a genome fasta for *M. occulta* but no
transcript/protein (gene-model) files, and *B. villosa* has no genomic data at all — so
neither gets an `aniseed` chip.

---

## 5. Species with a genome but NO NCBI assembly

Some important genomes are only on ANISEED / GHOST / other repos (no GCA). They are
listed with a `resource` instead of `acc`. Currently: **Molgula occidentalis / oculata /
occulta, Botrylloides leachii, Corella inflata**, and the **Ciona robusta / Type-A GHOST
HT** entry (under *Ciona intestinalis*). Keep these; they are called out in the page's
"Genomes without an NCBI assembly" box. Truly unsequenced (no genome anywhere):
*Salpa fusiformis*, any *Pyrosoma*, any *Doliolum*.

---

## 5b. Sequencing-in-progress species (no genome yet)

To advertise a genome that is being sequenced but not yet public, add a species with
`status: "progress"`, an empty `asm: []`, and a `progress` block. It renders with a
**red name** + "sequencing in progress" badge, expands to show the contact, and is
**excluded** from the assembly/species counts (it shows as "· N in progress" per class).

```js
{ sp: "Molgula appendiculata", family: "Molgulidae", order: "Stolidobranchia", cls: "Ascidiacea",
  status: "progress", asm: [],
  progress: { year: 2026, contact: "Sébastien Darras", institution: "CNRS – Sorbonne University", country: "France" } }
```

Contact is intentionally routed through the Discord community (no email addresses on
the public site). When the genome is released, replace the `progress` entry with a
normal `asm` array (drop `status`/`progress`).

## 6. Verify after editing

No bun in this environment's PATH; use these:

```bash
# 1) JS syntax
node --check public/assets/js/genomes-data.js
node --check public/assets/js/genomes.js

# 2) Serve locally and eyeball (or use the bun server if bun is installed: bun run start)
cd public && python -m http.server 8000   # → http://localhost:8000/genomes.html

# 3) Headless screenshot (Windows Chrome from WSL) — expand a couple of rows to check
#    Source / Gene model chips render correctly.
#    "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
#      --headless=new --screenshot=OUT.png --window-size=1500,1600 \
#      "file:///C:/Users/<you>/…/public/genomes.html"
```

Sanity checks: hero counts changed as expected; new species appear under the right
family/order; `gm`/`refseq` chips show on the intended assemblies; expansion sorts by
year (newest first).

**Final step — stamp & log it.** (1) Bump the `updated: "YYYY-MM-DD"` field at the top
of `genomes-data.js` (it shows as "Data last updated" on the page). (2) Append a dated
entry to `CHANGELOG.md` (newest at top) describing what you updated (e.g. "Data: +N
assemblies, +M species from NCBI; refreshed RefSeq/TUNOME flags"). Required every time.

---

## 7. Known mapping decisions (so they aren't "corrected" by mistake)

- **Ciona robusta = Ciona intestinalis Type A.** NCBI files Type A under *C. intestinalis*
  (KH `GCA_000224145.2`). The GHOST HT/KY21 gene model is added as an assembly under
  *Ciona intestinalis* with `gmLabel: "GHOST"`. There is no separate GCA "Ciona robusta".
- Family/order placement follows WoRMS-style classification. `Diazona violacea` is placed
  in Phlebobranchia (Diazonidae) though some schemes put it in Aplousobranchia.
- Do not publish `SupplementaryMaterial_1_260409.xlsx` (it's git-ignored and kept out of
  `public/`).
