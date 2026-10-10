#!/usr/bin/env node
/* Check public/assets/js/genomes-data.js against the data model in UPDATING.md §2.

   Runs on every pull request (.github/workflows/check-data.yml) and before every
   deployment (pages.yml), so a broken data file is caught before it reaches the site.
   Run it yourself after editing the data:

       node scripts/validate_data.cjs            # exit 0 = OK, 1 = errors (listed)

   No dependencies. Unknown fields are errors on purpose (they are usually typos);
   when you add a new field to the data model, add it to the lists below too. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const FILE = process.argv[2] || path.join(__dirname, "..", "public/assets/js/genomes-data.js");
const errors = [], warnings = [];
const err = (where, msg) => errors.push(where + ": " + msg);
const warn = (where, msg) => warnings.push(where + ": " + msg);

const sandbox = { window: {} };
try { vm.runInNewContext(fs.readFileSync(FILE, "utf8"), sandbox, { filename: FILE }); }
catch (e) { console.error("genomes-data.js does not load: " + e.message); process.exit(1); }
const D = sandbox.window.TUNICATE_GENOMES;
if (!D || !Array.isArray(D.species)) { console.error("window.TUNICATE_GENOMES.species is missing"); process.exit(1); }

const CLASSES = ["Ascidiacea", "Appendicularia", "Thaliacea"];
const LEVELS = ["Chromosome", "Scaffold", "Contig"];
const SPECIES_KEYS = ["sp", "taxid", "id", "family", "order", "cls", "asm", "status", "progress"];
const ASM_KEYS = ["n", "acc", "level", "chrPct", "size", "year", "ref", "refseq", "gm", "gmUrl", "gmLabel",
                  "aniseed", "aniseedLabel", "resource", "unpublished", "share", "note"];
const PROGRESS_KEYS = ["state", "year", "since", "size", "level", "gm", "site", "contact", "institution",
                       "country", "url", "pub", "note", "share"];
const GCA = /^GCA_\d{9}\.\d+$/, GCF = /^GCF_\d{9}\.\d+$/, URL_RE = /^https?:\/\/\S+$/;
const isStr = (x) => typeof x === "string" && x.trim() !== "";
const isYear = (x) => x === null || (Number.isInteger(x) && x >= 1990 && x <= 2100);

if (!/^\d{4}-\d{2}-\d{2}$/.test(D.updated || "")) err("updated", "must be a YYYY-MM-DD date");

const seen = { sp: {}, taxid: {}, id: {}, acc: {} };
D.species.forEach((s, i) => {
  const w = "species[" + i + "] " + (s && s.sp ? s.sp : "(no name)");
  if (!s || typeof s !== "object") return err(w, "not an object");
  Object.keys(s).forEach((k) => { if (!SPECIES_KEYS.includes(k)) err(w, "unknown field '" + k + "'"); });
  if (!isStr(s.sp)) err(w, "'sp' (scientific name) is required");
  else if (seen.sp[s.sp]) err(w, "species listed twice"); else seen.sp[s.sp] = 1;
  // Stable identifier: the NCBI Taxonomy ID, or `id` (short name) when NCBI has none
  if (s.taxid === undefined && s.id === undefined) err(w, "needs 'taxid' (NCBI Taxonomy ID) or, if NCBI has none, 'id'");
  if (s.taxid !== undefined) {
    if (!Number.isInteger(s.taxid) || s.taxid <= 0) err(w, "'taxid' must be a positive integer");
    else if (seen.taxid[s.taxid]) err(w, "taxid " + s.taxid + " is also used by " + seen.taxid[s.taxid]);
    else seen.taxid[s.taxid] = s.sp;
  }
  if (s.id !== undefined) {
    if (typeof s.id !== "string" || !/^[A-Z][A-Za-z0-9]+$/.test(s.id)) err(w, "'id' must look like 'Cintestinalis' (letters and digits)");
    else if (seen.id[s.id]) err(w, "id '" + s.id + "' is also used by " + seen.id[s.id]);
    else seen.id[s.id] = s.sp;
  }
  if (!isStr(s.family)) err(w, "'family' is required");
  if (!isStr(s.order)) err(w, "'order' is required");
  if (!CLASSES.includes(s.cls)) err(w, "'cls' must be one of " + CLASSES.join(" / "));
  if (!Array.isArray(s.asm)) return err(w, "'asm' must be an array (empty for a species with no public genome)");

  if (s.status !== undefined) {
    if (s.status !== "progress") err(w, "'status' can only be \"progress\"");
    const p = s.progress;
    if (!p || typeof p !== "object") err(w, "status \"progress\" needs a 'progress' block");
    else {
      Object.keys(p).forEach((k) => { if (!PROGRESS_KEYS.includes(k)) err(w, "unknown progress field '" + k + "'"); });
      if (p.state !== undefined && !["sequencing", "assembled"].includes(p.state)) err(w, "progress.state must be \"sequencing\" or \"assembled\"");
      if (p.url !== undefined && !URL_RE.test(p.url)) err(w, "progress.url is not a URL");
    }
  } else if (s.progress !== undefined) err(w, "'progress' without status: \"progress\"");
  if (!s.asm.length && s.status !== "progress") err(w, "no assemblies — a species without a public genome needs status: \"progress\"");

  s.asm.forEach((a, j) => {
    const wa = w + " / asm[" + j + "] " + (a && a.n ? a.n : "");
    if (!a || typeof a !== "object") return err(wa, "not an object");
    Object.keys(a).forEach((k) => { if (!ASM_KEYS.includes(k)) err(wa, "unknown field '" + k + "'"); });
    if (!isStr(a.n)) err(wa, "'n' (assembly name) is required");
    if (a.acc !== undefined) {
      if (!GCA.test(a.acc) && !GCF.test(a.acc)) err(wa, "'acc' must look like GCA_000000000.1");
      else if (seen.acc[a.acc]) err(wa, a.acc + " is also listed under " + seen.acc[a.acc]);
      else seen.acc[a.acc] = s.sp;
    }
    if (a.resource !== undefined && (!a.resource || !URL_RE.test(a.resource.url || "") || !isStr(a.resource.label)))
      err(wa, "'resource' must be { url: \"https://…\", label: \"…\" }");
    if (a.acc === undefined && a.resource === undefined && !a.unpublished)
      err(wa, "needs 'acc' (NCBI) or 'resource' (non-NCBI link)");
    if (a.level !== undefined && !LEVELS.includes(a.level)) err(wa, "'level' must be one of " + LEVELS.join(" / "));
    if (a.level === undefined && !a.unpublished) err(wa, "'level' is required");
    if (a.chrPct !== undefined) {
      if (typeof a.chrPct !== "number" || a.chrPct <= 0 || a.chrPct > 100) err(wa, "'chrPct' must be a percentage");
      if (a.level !== "Chromosome") err(wa, "'chrPct' only belongs on Chromosome-level assemblies");
    } else if (a.level === "Chromosome") warn(wa, "Chromosome-level without 'chrPct' (see UPDATING.md §3)");
    if (!isYear(a.year === undefined ? null : a.year)) err(wa, "'year' must be a year or null");
    if (a.refseq !== undefined && !GCF.test(a.refseq)) err(wa, "'refseq' must look like GCF_000000000.1");
    ["gm", "aniseed", "unpublished"].forEach((k) => { if (a[k] !== undefined && typeof a[k] !== "boolean") err(wa, "'" + k + "' must be true or false"); });
    if (a.gmUrl !== undefined && !URL_RE.test(a.gmUrl)) err(wa, "'gmUrl' is not a URL");
    if ((a.gmUrl !== undefined || a.gmLabel !== undefined) && !a.gm) err(wa, "'gmUrl'/'gmLabel' without gm: true");
    if (a.aniseedLabel !== undefined && !a.aniseed) err(wa, "'aniseedLabel' without aniseed: true");
  });
});

warnings.forEach((m) => console.log("warning  " + m));
errors.forEach((m) => console.log("ERROR    " + m));
const nAsm = D.species.reduce((n, s) => n + (s.asm || []).length, 0);
console.log((errors.length ? "FAILED" : "OK") + " — " + D.species.length + " species, " + nAsm + " assemblies, " +
            errors.length + " error(s), " + warnings.length + " warning(s)");
process.exit(errors.length ? 1 : 0);
