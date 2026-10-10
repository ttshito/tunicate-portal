#!/usr/bin/env node
/* Write the genome table as machine-readable JSON — public/data/genomes.json on the site
   (https://ttshito.github.io/tunicate-portal/data/genomes.json).

   Built from public/assets/js/genomes-data.js at deployment time by
   .github/workflows/pages.yml, so it is never edited by hand and never out of date.
   Any project can read it (e.g. other tunicate databases deciding which genomes to
   include); the portal itself does not depend on anyone reading it.

       node scripts/export_genomes_json.cjs [OUT]     # default public/data/genomes.json

   Species "id" is stable: "taxid:<NCBI Taxonomy ID>", or "local:<id>" for species NCBI
   Taxonomy does not have yet (the `id` field of the data file). Field meanings: UPDATING.md §2. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const ROOT = path.join(__dirname, "..");
const OUT = process.argv[2] || path.join(ROOT, "public/data/genomes.json");
const SITE = "https://ttshito.github.io/tunicate-portal/";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "public/assets/js/genomes-data.js"), "utf8"), sandbox);
const D = sandbox.window.TUNICATE_GENOMES;

// The gene-model link targets live in genomes.js (one place); read them from there
const js = fs.readFileSync(path.join(ROOT, "public/assets/js/genomes.js"), "utf8");
const constant = (name) => { const m = js.match(new RegExp("var " + name + ' = "([^"]+)"')); if (!m) throw new Error(name + " not found in genomes.js"); return m[1]; };
const TUNOME_PAGE = constant("TUNOME_PAGE"), ANISEED_PAGE = constant("ANISEED_PAGE"), NCBI_GENOME = constant("NCBI_GENOME");

const species = D.species.map((s) => ({
  id: s.id ? "local:" + s.id : "taxid:" + s.taxid,
  taxid: s.taxid || null,
  name: s.sp,
  class: s.cls,
  order: s.order,
  family: s.family,
  status: s.status === "progress" ? ((s.progress && s.progress.state) || "sequencing") : "public",
  assemblies: s.asm.map((a) => {
    const gm = [];
    if (a.refseq) gm.push({ label: "NCBI", url: NCBI_GENOME + a.refseq + "/", accession: a.refseq });
    if (a.gm) gm.push({ label: a.gmLabel || "TUNOME", url: a.gmUrl || TUNOME_PAGE });
    if (a.aniseed) gm.push({ label: a.aniseedLabel || "ANISEED", url: ANISEED_PAGE });
    return {
      name: a.n,
      accession: a.acc || null,
      url: a.acc ? NCBI_GENOME + a.acc + "/" : (a.resource ? a.resource.url : null),
      source: a.acc ? "NCBI" : (a.resource ? a.resource.label : null),
      level: a.level || null,
      chromosome_pct: a.chrPct === undefined ? null : a.chrPct,
      size: a.size || null,
      year: a.year === undefined ? null : a.year,
      public: !a.unpublished,
      gene_models: gm,
      note: a.note || null,
    };
  }),
  progress: s.progress || null,
}));

const out = {
  schema_version: 1,
  title: "Tunicate Genomics Portal — genome datasets",
  updated: D.updated,
  site: SITE + "genomes.html",
  repository: "https://github.com/ttshito/tunicate-portal",
  documentation: "https://github.com/ttshito/tunicate-portal/blob/main/UPDATING.md",
  counts: {
    species: species.length,
    species_with_public_genome: species.filter((s) => s.status === "public").length,
    public_assemblies: species.reduce((n, s) => n + s.assemblies.filter((a) => a.public).length, 0),
  },
  species,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log("wrote " + path.relative(process.cwd(), OUT) + ": " + out.counts.species + " species, " + out.counts.public_assemblies + " public assemblies");
