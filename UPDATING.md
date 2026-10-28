# Updating the genome datasets — maintenance & handoff guide

> ## 🔄 Site owner: how to refresh the data
> Open Claude Code in this folder and say:
> ### 「UPDATING.md に従って、NCBIから最新のホヤゲノムデータに更新して」
> That's it — Claude reads this file and does the rest. Suggested every ~3–6 months
> (or when you hear of new genomes / gene models). The rest of this file is the how-to.
> **You no longer have to remember to look:** a weekly GitHub Action opens an issue
> (label `ncbi-watch`, and a Discord post if configured) when NCBI has something new — §3b.

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
| `scripts/validate_data.cjs` | Checks the data file against §2 (also run by PRs and deployment, §9). | Run it after editing. |
| `scripts/export_genomes_json.cjs` | Writes `public/data/genomes.json` at deployment (§9). | No. |
| `scripts/ncbi_watch.py`, `scripts/ncbi_watch_notify.sh` | Weekly NCBI comparison → issue + Discord (§3b). | No. |
| `.github/workflows/*.yml` | `pages.yml` (check + JSON + deploy), `check-data.yml` (PR checks), `ncbi-watch.yml` (weekly). | Rarely. |
| `.github/ISSUE_TEMPLATE/*.yml` | Issue forms: add a genome / add a resource / report a mistake. | Rarely. |
| `SupplementaryMaterial_1_260409.xlsx` | Source spreadsheet for gene-model ↔ assembly mapping (see §4). **Kept at project root, git-ignored, NOT served publicly.** | Reference only. |

The site is 100% static (open `public/index.html`, or serve `public/`). No build step —
the only generated file is `data/genomes.json`, written by the deployment workflow.

---

## 2. Data model (`genomes-data.js`)

```js
{ sp: "Genus species",        // scientific name (italicised in the table); within a
                              // family the table sorts species alphabetically by this,
                              // so position in the file does not matter
  taxid: 7719,                // NCBI Taxonomy ID — the species' stable identifier (§2a)
  // id: "Gspecies",          // ONLY when NCBI Taxonomy has no entry for the name (§2a)
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
      links: [{ url: "https://…", label: "GigaDB" }], // OPTIONAL — extra chips in the Gene model column
                              // (e.g. a paper's data repository holding assembly + GFF3)
      resource: { url: "https://…", label: "ANISEED" }, // OPTIONAL — use INSTEAD of acc when there is no NCBI accession
      note: "free text …" }
  ]
}
```

**Required** (enforced by `scripts/validate_data.cjs`, §9):
- species: `sp`, `family`, `order`, `cls`, `asm`, and `taxid` — or `id` if NCBI Taxonomy has
  no entry (§2a). A species with an empty `asm` must be a red row (`status: "progress"`, §5b).
- assembly: `n`; `acc` or `resource`; `level` (an `unpublished` assembly may lack the last two).
- everything else is optional. `chrPct` is expected on Chromosome-level assemblies — if it is
  missing the check prints a warning but still passes.
- `family` / `order`: use the family of congeners already in the table, otherwise WoRMS
  (https://www.marinespecies.org); §8 lists the decisions that must not be "corrected".
- order of the `asm` array: put the primary assembly first by convention; the expansion
  re-sorts by year anyway, so the order never changes what readers see.
- no other field names — an unknown field fails the check (usually a typo); add new fields to
  the lists at the top of `scripts/validate_data.cjs`.

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

### 2a. Stable species identifier (`taxid`, or `id`)

Names change (a genus is revised, a placeholder such as *Pegea* sp. RAD2-039 gets a name,
a typo is fixed); identifiers must not. Every species carries one, so that anything
outside the portal that refers to a species (scripts, other databases reading
`data/genomes.json`) keeps working when the name changes.

- **`taxid`** — the NCBI Taxonomy ID. Use it whenever NCBI has the name. Where to get it:
  `organism.tax_id` in the NCBI Datasets genome report (§3), or
  `curl -s 'https://api.ncbi.nlm.nih.gov/datasets/v2/taxonomy/taxon/Ciona%20intestinalis' | python3 -c 'import json,sys; print(json.load(sys.stdin)["taxonomy_nodes"][0]["taxonomy"]["tax_id"])'`
- **`id`** — only for a species NCBI Taxonomy does not know (so far three red rows:
  `Bfrankovichi`, `Mappendiculata`, `Tcfsavignii`). Genus initial + epithet, letters and
  digits only. **Once given, keep it**: if NCBI later creates a taxid, add `taxid` but do
  not remove `id` (the exported identifier stays `local:<id>`; the JSON `taxid` field is
  filled in, so readers can use either).
- Never change an existing `taxid`/`id` when renaming a species — that is the point.
- In `data/genomes.json` the identifier is `taxid:<number>` or `local:<id>` (§9).

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

5. **Audit the result** — run the check below after every refresh. It answers the two
   questions a species-name diff cannot: *is any NCBI assembly missing from the file*, and
   *does every row still match NCBI on level and size*.

```bash
curl -s 'https://api.ncbi.nlm.nih.gov/datasets/v2/genome/taxon/7712/dataset_report?page_size=1000' > /tmp/tuni.json
python3 - <<'EOF'
import json, io, re
by = {r['accession']: r for r in json.load(open('/tmp/tuni.json'))['reports']}
src = io.open('public/assets/js/genomes-data.js', encoding='utf-8').read()
for acc, r in by.items():                      # (a) in NCBI, absent from the file
    if not acc.startswith('GCF_') and acc not in src:
        print('MISSING', acc, r['organism']['organism_name'], r['assembly_info']['assembly_name'])
for line in src.splitlines():                  # (b) row vs NCBI, level and size
    m = re.search(r'acc: "(GC[AF]_\d+\.\d+)"', line)
    if not m: continue
    r = by.get(m.group(1))
    if not r: print('NOT CURRENT', m.group(1)); continue
    lm, sm = re.search(r'level: "([^"]+)"', line), re.search(r'size: "([\d,]+) Mb"', line)
    nl = r['assembly_info']['assembly_level']
    ns = round(int(r['assembly_stats']['total_sequence_length']) / 1e6)
    if lm and lm.group(1) != nl: print('LEVEL', m.group(1), lm.group(1), '->', nl)
    if sm and abs(int(sm.group(1).replace(',', '')) - ns) > 3: print('SIZE', m.group(1), sm.group(1), '->', ns)
EOF
```


**Why (a) matters:** NCBI upgrades assemblies **in place**, and the accession version
moves with it. On 2026-08-11 *Perophora annectens* `GCA_048173355.1` and
*Botrylloides violaceus* `GCA_047301215.1` both became `.2` and went **contig →
scaffold**, with new sizes and new alt-haplotype accessions. Nothing about the species
list changed, so only the accession check finds them.

---

## 3b. Weekly NCBI watch (automatic)

`.github/workflows/ncbi-watch.yml` runs every Monday (00:17 UTC) and on demand
(Actions tab → *Watch NCBI for new tunicate genomes* → *Run workflow*). It runs
`scripts/ncbi_watch.py`, which pulls the same NCBI Datasets report as §3 and compares
it with `genomes-data.js`:

| Finding | Meaning |
| ------- | ------- |
| New assembly | accession not mentioned anywhere in `genomes-data.js` (*new species* if the organism is not in the file either) |
| New version | NCBI has `GCA_X.2`, the file has `GCA_X.1` |
| New RefSeq annotation | a `GCF_` whose `GCA_` twin is listed (→ add `refseq:`) |
| Level changed | e.g. Scaffold → Chromosome for a listed accession (→ update `level`, `chrPct`) |

`scripts/ncbi_watch_notify.sh` then opens an issue labelled `ncbi-watch` with the
table, comments on it when the findings change (never repeats the same findings),
and closes it once the file catches up. **To act on it:** follow §3 (or ask Claude:
*"Update the genome data from NCBI following UPDATING.md"*) and open a PR; the next
run closes the issue.

- **Discord:** add a repository secret `DISCORD_WEBHOOK_URL` (Discord channel →
  Edit Channel → Integrations → Webhooks → Copy Webhook URL; GitHub → Settings →
  Secrets and variables → Actions → New repository secret). Without it the job only
  opens issues.
  **To check it:** Actions → *Watch NCBI for new tunicate genomes* → *Run workflow*, tick
  *Also post a test message to Discord*. A ✅ message appears in the channel; if the
  secret is missing or wrong, the run fails with “Discord test failed”.
- **Something that should stay out** (looked at and deliberately not listed): add
  its accession to `.github/ncbi-watch-ignore.txt` with a comment. Accessions
  mentioned in a `note` (e.g. alternate haplotypes) already count as known.
- **Run it locally:** `python3 scripts/ncbi_watch.py` (standard library only).
  `--data FILE` compares another copy of the data file (for testing).
- If NCBI cannot be reached the job **fails** (red in the Actions tab) instead of
  reporting "nothing new".

---

## 4. Updating gene models (TUNOME + others)

Gene models are **per-assembly**, and TUNOME is the main curated source.

**How to get the TUNOME coverage** (which species/assemblies have a TUNOME gene model):
- The TUNOME download page — https://ciona.bpni.bio.keio.ac.jp/Tunome/Latest/Downloads.php —
  lists every species TUNOME provides. The table is built **client-side**, so WebFetch
  sees nothing; but the species list itself is embedded in that page's HTML as a
  `SP_LIST` JSON array (spid / class / ordo / family / genus / species), so a plain
  `curl` gets it:

  ```bash
  curl -s https://ciona.bpni.bio.keio.ac.jp/Tunome/Latest/Downloads.php \
  | python3 -c "import re,sys,json; print(*[f\"{s['genus']} {s['species']}\" for s in \
      json.loads(re.search(r'SP_LIST\s*=\s*(\[.*?\]);', sys.stdin.read(), re.S).group(1))], sep='\n')"
  ```

  **Do not go looking in `js/download.js`** — it used to hold a hard-coded `tunicates`
  array, but the page was rewritten to build both the taxonomy and the species names from
  `SP_LIST` (the DB's own list), and the array is gone. Checked 2026-08-30: 38 species.
- The maintainer's spreadsheet `SupplementaryMaterial_1_260409.xlsx`, sheet **Table S1**,
  has one row per assembly with columns incl. **Gene Model (◯/X)**, **Assembly**, and
  **Resource** (the download link = which assembly the gene model is built on).

**Cross-check after any gene-model edit:** the chips the page renders should account for
every species in `SP_LIST` — one chip per species, whatever the label. Count them with:

```bash
node -e 'global.window={}; require("./public/assets/js/genomes-data.js");
  const sp=Object.values(window.TUNICATE_GENOMES).find(Array.isArray); const c={};
  for(const s of sp) for(const a of (s.asm||[])) if(a.gm) c[a.gmLabel||"TUNOME"]=(c[a.gmLabel||"TUNOME"]||0)+1;
  console.log(c);'   # 2026-08-30: { TUNOME: 37, GHOST: 1, OCTOPUS: 1 } — 37+1 = SP_LIST's 38
```

TUNOME reuses the GHOST gene model for *Ciona robusta*, so that species is in `SP_LIST`
but renders a **GHOST** chip. OCTOPUS (*Botryllus schlosseri*) is an extra source on top
of TUNOME, so it is not part of the 38. A total below 38 means a species' `gm: true` is
missing or sits on a species the file does not list; above 38 means one is duplicated
across two assemblies of the same species.

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
  (e.g. Ciona HT uses `gmLabel: "GHOST"` + the GHOST download URL; Botryllus schlosseri
  Bs_hap1 uses `gmLabel: "OCTOPUS"` + the LBDV Villefranche download page).
- NCBI RefSeq gene models are handled separately via `refseq` (§2). An assembly can show
  both **NCBI** and **TUNOME** chips.

**A species can have gene models in several places at once**, on different assemblies —
*Botryllus schlosseri* has OCTOPUS on the 2025 chromosome-level assembly, TUNOME and
ANISEED on the 2013 Stanford one, plus NCBI RefSeq. The collapsed species row shows one
chip per **distinct `gmLabel`**, so adding `gm` to a newer assembly never hides the older
source. Keep the labels spelled consistently — they are what the de-duplication keys on.

---

**If a gene-model site cannot be reached** (TUNOME, ANISEED or any other): leave the chips
as they are — the portal does not depend on those sites, only links to them. Remove a
site's chips only once it is gone for good, and say so in CHANGELOG.md. **When TUNOME's
next version (TUNOME2) replaces the current site**, the `SP_LIST` recipe above stops
working (its Downloads page becomes a redirect); update this section to read the species
list from the new site, exactly as one would if ANISEED changed its download page.

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

| `state`               | badge                  | meaning                          |
| --------------------- | ---------------------- | -------------------------------- |
| `"sequencing"` (default) | sequencing in progress | being sequenced, no assembly yet |
| `"assembled"`         | assembled              | assembled in a lab, not released |

The badge states the assembly state and **nothing else** — keep it that way. Anything
that depends on having heard from the owner goes in the expansion instead, because only
some owners have replied to us: a badge would rank the ones who answered above the ones
we simply never asked.

**`share: "author"`** is that kind of field. Set it when the owner has told us they will
share the genome on request; the Status line then reads *"Assembled — not in a public
archive, but available from the author"* and an unpublished assembly's Source cell reads
*from the author*. Never assume it — a bare "not public" reads to other researchers as
"the owner is keeping it", which is exactly what a willing owner does not want, but
saying someone will share when they have not said so is worse. Set it only on the
owner's word (Marie Nydam asked for it across the Soka panel, Aug 2026).

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
{ n: "Soka WGS", unpublished: true, share: "author", size: "~1,199 Mb", year: null,
  note: "Assembled at Soka University (M. Nydam) but not in a public archive …" },
```

Leave `year: null` so it sorts last, and omit `level` (it renders as "—").
`share: "author"` turns the Source cell into *from the author* instead of *not released*.
If something public exists for it after all — raw reads, a lab download page — give it a
`resource: { url, label }` and the Source cell links there instead, still in red:

```js
{ n: "Soka WGS", unpublished: true, share: "author", year: 2021,
  resource: { url: "https://www.ncbi.nlm.nih.gov/sra/SRR40088050", label: "SRA reads" },
  note: "… the raw reads are public (run SRR40088050 of BioProject PRJNA1507425); the assembly itself is not archived." },
```

**Link the run, not the BioProject.** A row is one species, so point `resource.url`
(and the `pub` entry on a red row) at that species' **run** page
`https://www.ncbi.nlm.nih.gov/sra/SRR…`; name the BioProject in the `note` instead, so
the visitor lands on their reads rather than on a project page listing seven species.
To get the runs of a project:

```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sra&term=PRJNA1507425&retmax=100&retmode=json"
# then efetch db=sra with those ids (rettype=full&retmode=xml) — the XML carries the
# run accession, total_bases, INSTRUMENT_MODEL and the sample's geo_loc_name/collection_date.
```

Watch the sample's scientific name: SRA samples are sometimes registered under an open
or interim name (*Symplegma* sp., *Botrylloides* sp. f MLN-2022) rather than the species
the portal lists — say so in the note, or the reader will conclude the reads are missing.

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
# 0) The data checks (the same ones a pull request runs — must say OK)
node scripts/validate_data.cjs

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
- Family/order placement follows WoRMS-style classification. `Diazona violacea` (Diazonidae)
  is placed in **Aplousobranchia** (maintainer's decision, 2026-10-11; until then it was in
  Phlebobranchia, where some schemes still put it).
- Do not publish `SupplementaryMaterial_1_260409.xlsx` (it's git-ignored and kept out of
  `public/`).

---

## 9. Automatic checks and `data/genomes.json`

- **Pull requests are checked** (`.github/workflows/check-data.yml`): `scripts/validate_data.cjs`
  loads `genomes-data.js` and checks it against §2 (required fields, `cls`/`level` values,
  accession formats, no duplicate accession/taxid/id, no unknown field — usually a typo).
  The result shows on the pull request as ✓ or ✗ with the list of problems. When you add
  a new field to the data model, add it to the lists at the top of that script too.
- **Deployment runs the same check first** (`pages.yml`): a broken data file is never
  published; the live site keeps the previous version.
- **`data/genomes.json`** — every deployment also writes the table as JSON
  (`scripts/export_genomes_json.cjs`) to https://ttshito.github.io/tunicate-portal/data/genomes.json
  (linked under the genome table). It is generated, git-ignored, never edited by hand.
  Shape: `{schema_version, updated, counts, species: [{id, taxid, name, class, order, family,
  status, assemblies: [{name, accession, url, source, level, chromosome_pct, size, year,
  public, gene_models: [{label, url}], note}], progress}]}`. Other projects may read it; the
  portal itself never depends on anything that reads it. If you rename or remove a field,
  bump `schema_version`.
- **Pull requests from forks**: the checks run with read-only permissions. For someone's
  first contribution GitHub may hold the run until the maintainer clicks *Approve and run*
  on the pull request (repository Settings → Actions decides who needs approval).
- **When a scheduled job fails** (e.g. NCBI unreachable), the run is red in the Actions tab
  and GitHub e-mails the person who last changed that workflow (the usual GitHub
  notification setting). The Discord webhook (`DISCORD_WEBHOOK_URL`) is a repository secret
  managed by the repository owner (Settings → Secrets and variables → Actions).
