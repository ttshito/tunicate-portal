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
      level: "Chromosome",    // assembly level: "Chromosome" | "Scaffold" | "Contig"
      chrPct: 95.8,           // chromosome-level only — % of sequence placed on chromosomes
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
- **`level`** → the **Level** column chip in the expansion, and the green
  `chromosome-level` badge on the species row (shown when **any** of the species'
  assemblies is `"Chromosome"`), the hero's *N chromosome-level* count, and the
  **Chromosome-level only** filter. Copy it verbatim from the NCBI Datasets field
  `assembly_info.assembly_level` (see §3). For the 7 assemblies with no NCBI accession
  it is set by hand from the source publication — current values: ENS81 (Broad CSAV2.0),
  Core_infl, Bleachii SBv3, MolOcul/MolOccu/MolOcci 2014 = Scaffold.
- **`chrPct`** (chromosome-level assemblies only) → the percentage shown on the chip
  (`Chromosome 68%`). NCBI calls an assembly "Chromosome" as soon as **any** sequence
  is placed on a chromosome, which is why *Ciona* KH — 67.9 % anchored, 1,257 unplaced
  scaffolds — carries the same level as a 99 % ToL assembly. The renderer caps the
  displayed value at 99 % (no assembly in the data is truly complete), so store the
  real number with one decimal. How to compute it (§3).
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
     - `assembly_info.assembly_level` → the `level` field ("Chromosome" / "Scaffold" /
       "Contig"). Refresh it for **every** accession on each update — assemblies get
       upgraded in place. One-liner over the downloaded report:
       ```bash
       node -e 'const d=require("/tmp/tunicata.json");for(const r of d.reports)
         console.log(r.accession, r.assembly_info.assembly_level)'
       ```
     - `assembly_info.assembly_status` — skip/flag anything not `current`. (Known:
       the RefSeq records `GCF_000224145.3` (Ciona KH) and `GCF_013122585.1`
       (Styela clava) are **suppressed** but still linked, since they are the gene-model
       records the community uses.)

   **`chrPct` (chromosome-level assemblies only)** needs a second call per accession —
   the dataset report has no "% anchored" field, so derive it from the sequence report:

   ```bash
   ACC=GCA_000224145.2
   curl -s "https://api.ncbi.nlm.nih.gov/datasets/v2/genome/accession/$ACC/sequence_reports?page_size=5000" -o /tmp/seq.json
   node -e 'const rs=require("/tmp/seq.json").reports; let a=0,t=0;
     for (const s of rs) { t += s.length;
       if (s.role === "assembled-molecule" && s.assigned_molecule_location_type === "Chromosome") a += s.length; }
     console.log((100*a/t).toFixed(1) + "%")'   # → 67.9%
   ```

   `role: "assembled-molecule"` = placed on a chromosome; `unplaced-scaffold` /
   `unlocalized-scaffold` = not. Do **not** use `assigned_molecule_location_type` alone —
   it reads "Chromosome" for unplaced scaffolds too, which silently gives 100 % for
   every assembly.
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
occulta, Botrylloides leachii, Corella inflata**, plus the ANISEED **ENS81** entry under
*C. savignyi*. (The **GHOST HT** entry moved to `acc: "GCA_009617815.2"` on 2026-08-11 —
the assembly is on GenBank, only its KY21 gene models are GHOST-only.)
Keep these; they are called out in the page's
"Genomes without an NCBI assembly" box. Truly unsequenced (no genome anywhere):
any *Pyrosoma*, any *Doliolum*.

---

## 5b. Species with no public genome (red rows)

Two situations get a **red species name**, both via `status: "progress"` + `asm: []`
+ a `progress` block. They are **excluded** from the four public hero counts and from
the assembly/species counts (each class header shows "· N not public yet"; the hero's
red "N not public yet" badge counts them together with the `unpublished` assemblies). The `progress.state` field picks the badge:

| `state`               | badge                     | meaning                                  |
| --------------------- | ------------------------- | ---------------------------------------- |
| `"sequencing"` (default) | sequencing in progress | being sequenced, no assembly yet         |
| `"assembled"`         | assembled · not public    | assembled in a lab, not released         |

Every `progress` key is optional except `contact` — only the keys present are rendered,
so a bare contact-only entry still looks exactly as it did before:

```js
{ sp: "Ascidia ceratodes", family: "Ascidiidae", order: "Phlebobranchia", cls: "Ascidiacea",
  status: "progress", asm: [],
  progress: { state: "assembled", year: 2026, since: 2022,
    size: "543 Mb",                         // expansion only: "~543 Mb (estimate)"
    level: "No chromosome-scale assembly",
    gm: "None deposited",
    site: "Wilmington, CA, USA",            // sampling site
    contact: "Marie Nydam", institution: "Soka University", country: "USA",
    url: "https://www.soka.edu/about/faculty-staff/marie-nydam",  // "Get in touch" link
    pub: { label: "Adi et al. 2026, Zool. Sci. 43(3):227-235",   // one, or an array of
           url: "https://doi.org/10.2108/zs250091" },            // {label,url} -> "Reference"
    note: "free text, last line" } }
```

`year` ("Reported") = when the information was made available to the portal; `since`
("Project started") = when the sequencing project itself began. They are separate lines,
so 2026 never reads as the project's start date.

`url` is a public lab/faculty page and is rendered on the "Get in touch" line next to the
Discord link; the Discord route stays so nobody has to publish an email address here. When the genome is released, replace
the `progress` entry with a normal `asm` array (drop `status`/`progress`).

### Unreleased assembly for a species that already has a public one

Do **not** add a second, red species row — the species is not red, it has a public
genome. Add the unreleased dataset as an assembly with `unpublished: true` instead. It
renders as a red row inside that species' expansion, its Source cell reads *not released*,
and it is skipped by every count (hero stats, per-class totals, "N assemblies" chip,
chromosome-level badge):

```js
{ n: "Soka WGS", unpublished: true, size: "~1,199 Mb", year: null,
  note: "Assembled at Soka University (M. Nydam) but not publicly released — reported 2026 …" },
```

Leave `year: null` so it sorts last, and omit `level` (it renders as "—").

## 6. Bump the asset cache-buster (`?v=`)

GitHub Pages serves `assets/**` with `cache-control: max-age=600` and no content
hashing, so a returning visitor can keep running the **old** `genomes-data.js` long
after a deploy — the update looks like it never happened. `genomes.html` and
`index.html` therefore load the CSS/JS with a dated query string:

```html
<link  href="assets/css/style.css?v=2026-08-21" rel="stylesheet" />
<script src="assets/js/genomes-data.js?v=2026-08-21"></script>
<script src="assets/js/genomes.js?v=2026-08-21"></script>
```

**Whenever you touch `style.css`, `genomes.js` or `genomes-data.js`, set every `?v=`
in both HTML files to today's date** — the same date you put in `updated:`. A new URL
is a new cache entry, so every visitor gets the new file on their next load instead of
up to 10 minutes (in practice: far longer) of stale JS.

```bash
# bump them all at once
NEW=$(date +%F)
sed -i -E "s/\?v=[0-9]{4}-[0-9]{2}-[0-9]{2}(\.[0-9]+)?/?v=$NEW/g" public/genomes.html public/index.html
grep -n "?v=" public/genomes.html public/index.html   # 4 hits: 1 css + 2 js + 1 css
```

**Deploying twice in one day?** The date alone would not change, so anyone who loaded
the first deploy stays stuck on it. Append a counter — `?v=2026-08-21.2`, `.3`, … — the
`sed` above matches those too and resets them on the next day.

Images (`assets/img/**`) are not versioned — they change rarely, and a replaced logo is
normally a new filename anyway. If you overwrite an image in place and it does not
refresh, give it a `?v=` too.

## 7. Verify after editing

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
year (newest first); every assembly has a `level` (a missing one renders as "—"):

```bash
node -e 'global.window={};require("./public/assets/js/genomes-data.js");
  const c={};for(const s of window.TUNICATE_GENOMES.species)for(const a of s.asm||[])
    c[a.level||"MISSING"]=(c[a.level||"MISSING"]||0)+1; console.log(c)'
```

**Final step — stamp & log it.** (1) Bump the `updated: "YYYY-MM-DD"` field at the top
of `genomes-data.js` (it shows as "Data last updated" on the page). (2) Append a dated
entry to `CHANGELOG.md` (newest at top) describing what you updated (e.g. "Data: +N
assemblies, +M species from NCBI; refreshed RefSeq/TUNOME flags"). Required every time.

---

## 8. Known mapping decisions (so they aren't "corrected" by mistake)

- **Ciona robusta = Ciona intestinalis Type A.** NCBI files Type A under *C. intestinalis*
  (KH `GCA_000224145.2`, and the HT assembly as `GCA_009617815.2` — same Kyoto inbred
  Type-A line, 95.6 % anchored). The HT entry keeps `gmLabel: "GHOST"` + the GHOST URL
  because the KY21 gene models live only at GHOST. No GCA is filed under the *name*
  "Ciona robusta".
- **Suppressed RefSeq records are kept on purpose.** `GCF_000224145.3` (Ciona KH,
  Annotation Release 104) and `GCF_013122585.1` (Styela clava ASM1312258v2) are
  `assembly_status: "suppressed"` — NCBI retires the old RefSeq annotation when the
  species reference moves to a newer assembly ("superseded by newer assembly for
  species"). The GCA side stays current and the files are still served from the FTP
  archive, so the chips stay, with the retirement spelled out in the note.
- **Botryllus schlosseri `356a-chromosome-assembly`** is named "chromosome-assembly" but
  NCBI classifies `GCA_000444245.1` as **Scaffold** — `level: "Scaffold"` is correct, don't
  "fix" it from the assembly name. (ANISEED separately serves a chromosome-scale
  `botznik-chr` fasta derived from it.)
- Family/order placement follows WoRMS-style classification. `Diazona violacea` is placed
  in Phlebobranchia (Diazonidae) though some schemes put it in Aplousobranchia.
- Do not publish `SupplementaryMaterial_1_260409.xlsx` (it's git-ignored and kept out of
  `public/`).
