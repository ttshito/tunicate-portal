/* Renders the genome data (window.TUNICATE_GENOMES) into one table per class.
   Layout: within each order, species are grouped by family. The family name is
   shown once, on the left, at the top of its group (not repeated per row).
   Every species row expands on click to reveal its assemblies (Assembly / Size /
   Year / NCBI / Notes) — identical behaviour whether it has one assembly or many. */
(function () {
  "use strict";

  var DATA = window.TUNICATE_GENOMES;
  if (!DATA) return;

  var NCBI = "https://www.ncbi.nlm.nih.gov/datasets/genome/";
  var species = DATA.species;

  // Gene-model availability is per-assembly (assembly.gm), sourced from the TUNOME
  // supplementary table. TUNOME_PAGE is where the gene models are downloaded.
  var TUNOME_PAGE = "https://ciona.bpni.bio.keio.ac.jp/Tunome/Latest/Downloads.php";
  var NCBI_GENOME = "https://www.ncbi.nlm.nih.gov/datasets/genome/";
  // ANISEED hosts its own gene models (assembly.aniseed) — one download page for all species.
  var ANISEED_PAGE = "https://aniseed.fr/aniseed/download/download_data?module=aniseed&action=download:download_data";
  function firstRefseq(sp) {
    for (var i = 0; i < sp.asm.length; i++) { if (sp.asm[i].refseq) return sp.asm[i]; }
    return null;
  }
  function firstAniseed(sp) {
    for (var i = 0; i < sp.asm.length; i++) { if (sp.asm[i].aniseed) return sp.asm[i]; }
    return null;
  }
  // NCBI RefSeq annotation link (NCBI's own gene models on that assembly).
  function ncbiAnchor(a) {
    return '<a class="gm-ncbi" href="' + NCBI_GENOME + esc(a.refseq) +
      '/" target="_blank" rel="noopener">NCBI</a>';
  }
  // TUNOME gene-model link — default TUNOME, override via gmUrl/gmLabel (e.g. GHOST).
  function gmAnchor(a) {
    var url = (a && a.gmUrl) ? a.gmUrl : TUNOME_PAGE;
    var label = (a && a.gmLabel) ? a.gmLabel : "TUNOME";
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
  }
  // ANISEED gene-model link — override the label via aniseedLabel (e.g. "ANISEED KH2012").
  function aniseedAnchor(a) {
    var label = (a && a.aniseedLabel) ? a.aniseedLabel : "ANISEED";
    return '<a class="gm-aniseed" href="' + ANISEED_PAGE + '" target="_blank" rel="noopener">' +
      esc(label) + "</a>";
  }
  // One assembly's gene-model chips: NCBI (RefSeq), TUNOME/GHOST, ANISEED — all that apply.
  function gmChips(a) {
    var parts = [];
    if (a.refseq) parts.push(ncbiAnchor(a));
    if (a.gm) parts.push(gmAnchor(a));
    if (a.aniseed) parts.push(aniseedAnchor(a));
    return parts.length
      ? '<td class="gene-model">' + parts.join(" ") + "</td>"
      : '<td class="gene-model gm-no">—</td>';
  }
  // Species-level summary chip(s) for the collapsed row. A species can carry gene
  // models in more than one place — TUNOME on an old assembly, OCTOPUS or GHOST on
  // the new one — so show every distinct source, not just the first one found.
  function geneModelCell(sp) {
    var parts = [];
    var r = firstRefseq(sp), an = firstAniseed(sp);
    if (r) parts.push(ncbiAnchor(r));
    var seenGm = {};
    sp.asm.forEach(function (a) {
      if (!a.gm) return;
      var label = a.gmLabel || "TUNOME";
      if (seenGm[label]) return;
      seenGm[label] = 1;
      parts.push(gmAnchor(a));
    });
    if (an) parts.push(aniseedAnchor(an));
    return parts.length
      ? '<td class="gene-model">' + parts.join(" ") + "</td>"
      : '<td class="gene-model gm-no">—</td>';
  }
  // Assembly source link: an NCBI accession, or a non-NCBI resource (ANISEED, GHOST…).
  function sourceCell(a) {
    if (a.acc) return '<td class="accession">' + accLink(a.acc) + "</td>";
    // an unreleased assembly can still have somewhere to point at (raw reads, a lab page)
    if (a.resource) return '<td class="accession' + (a.unpublished ? " unpub-src" : "") +
      '"><a href="' + esc(a.resource.url) + '" target="_blank" rel="noopener">' +
      esc(a.resource.label) + "</a></td>";
    if (a.unpublished) return '<td class="accession unpub-src">' +
      (a.share === "author" ? "from the author" : "not released") + "</td>";
    return '<td class="gm-no">—</td>';
  }

  var CLASSES = ["Ascidiacea", "Appendicularia", "Thaliacea"];
  var ORDER_SEQ = {
    Phlebobranchia: 1, Aplousobranchia: 2, Stolidobranchia: 3,
    Copelata: 1, Salpida: 1,
  };
  function seq(order) {
    return Object.prototype.hasOwnProperty.call(ORDER_SEQ, order) ? ORDER_SEQ[order] : 99;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function accLink(acc) {
    return '<a href="' + NCBI + esc(acc) + '/" target="_blank" rel="noopener">' + esc(acc) + "</a>";
  }
  function refTag(a) {
    return a.ref ? ' <span class="ref-tag">' + esc(a.ref) + "</span>" : "";
  }
  // Assembly level = NCBI Datasets `assembly_info.assembly_level`
  // ("Chromosome" | "Scaffold" | "Contig"); set by hand for the non-NCBI assemblies.
  // NCBI calls an assembly "Chromosome" as soon as ANY sequence sits on a chromosome,
  // so chromosome-level assemblies also show `chrPct` — how much of the sequence is
  // actually placed on chromosomes (Ciona KH: 68%, the rest unplaced scaffolds).
  function levelCell(a) {
    if (!a.level) return '<td class="gm-no">—</td>';
    var pct = "", title = "";
    if (a.level === "Chromosome" && a.chrPct != null) {
      // capped at 99: every assembly in the data still has some unplaced sequence,
      // so rounding must never claim a complete 100 %
      pct = " " + Math.min(99, Math.round(a.chrPct)) + "%";
      title = a.chrPct + "% of the assembly is placed on chromosomes; " +
        "the remainder is unplaced scaffolds";
    }
    return '<td class="asm-level"><span class="lvl lvl-' + esc(a.level.toLowerCase()) + '"' +
      (title ? ' title="' + esc(title) + '"' : "") + ">" + esc(a.level) + pct + "</span></td>";
  }
  // `unpublished: true` marks an assembly that exists in a lab but has not been
  // released (no accession, no download). It is shown — in red — inside the
  // species' expansion, but never counted as a public assembly.
  function pubAsm(sp) {
    return (sp.asm || []).filter(function (a) { return !a.unpublished; });
  }
  function hasChromosome(sp) {
    return pubAsm(sp).some(function (a) { return a.level === "Chromosome"; });
  }
  function isProgress(s) { return s.status === "progress"; }
  // A red species is either "sequencing" (no assembly yet) or "assembled"
  // (assembled in the lab, not released). Default = sequencing.
  // The badge states the assembly state and nothing else. Whether the owner will
  // share it is `share`, and it belongs in the expansion, not the badge: only some
  // owners have told us, so a badge would rank the ones who answered above the ones
  // we simply never asked.
  function progressBadge(pr) {
    return pr.state === "assembled" ? "assembled" : "sequencing in progress";
  }
  var DISCORD = "https://discord.gg/mgbhTgjMzk";

  function renderClass(cls) {
    var tbody = document.getElementById("genomeBody-" + cls);
    if (!tbody) return;

    // sort by order, then keep families contiguous (first-appearance order),
    // then original authoring order within a family
    var base = species.filter(function (s) { return s.cls === cls; });
    var orderIdx = {}, famRank = {};
    base.forEach(function (s, i) { orderIdx[base.indexOf(s)] = i; });
    var byOrder = base.slice().sort(function (a, b) { return seq(a.order) - seq(b.order); });
    byOrder.forEach(function (s, i) { if (!(s.family in famRank)) famRank[s.family] = i; });
    var pos = new Map(); byOrder.forEach(function (s, i) { pos.set(s, i); });
    var list = byOrder.slice().sort(function (a, b) {
      return (seq(a.order) - seq(b.order))
          || (famRank[a.family] - famRank[b.family])
          || (pos.get(a) - pos.get(b));
    });

    var rows = [];
    var lastOrder = "";
    var lastFamily = "";

    list.forEach(function (sp) {
      var idx = species.indexOf(sp);

      if (sp.order !== lastOrder) {
        lastOrder = sp.order;
        lastFamily = "";
        rows.push('<tr class="clade-row"><td colspan="3">' + esc(sp.order) + "</td></tr>");
      }

      var newFam = sp.family !== lastFamily;
      var famStart = (newFam && lastFamily !== "") ? " family-start" : "";
      var famCell = newFam
        ? '<td class="fam-name">' + esc(sp.family) + "</td>"
        : '<td class="fam-name"></td>';
      lastFamily = sp.family;

      // ---- red row: no public genome (being sequenced, or assembled but unreleased) ----
      if (isProgress(sp)) {
        var pr = sp.progress || {};
        var phay = (sp.sp + " " + sp.family + " " + sp.order + " " + sp.cls + " " +
          progressBadge(pr) + " no public genome yet " +
          (pr.share === "author" ? "available from the author on request " : "") +
          (pr.size || "") + " " + (pr.site || "") + " " + (pr.note || "") + " " +
          [].concat(pr.pub || []).map(function (r) { return r.label; }).join(" ") + " " +
          (pr.contact || "") + " " + (pr.institution || "") + " " + (pr.country || "")
        ).toLowerCase();
        rows.push(
          '<tr class="genome-row expandable progress-row' + famStart + '"' +
            ' data-idx="' + idx + '"' +
            ' data-chrom="0"' +
            ' data-search="' + esc(phay) + '"' +
            ' role="button" tabindex="0" aria-expanded="false">' +
            famCell +
            '<td class="sci-name"><span class="caret" aria-hidden="true">\u25b8</span>' +
              '<em class="sp-progress">' + esc(sp.sp) + "</em>" +
              ' <span class="progress-badge">' + esc(progressBadge(pr)) + "</span></td>" +
            '<td class="gene-model gm-no">\u2014</td>' +
          "</tr>"
        );

        // Key/value detail. Only the keys we actually know are emitted, so the
        // older entries (contact only) still render exactly as before.
        var lines = [];
        function pline(k, v) {
          if (v) lines.push('<div class="progress-line"><span class="pl-key">' + k +
            "</span> " + v + "</div>");
        }
        pline("Status", pr.state === "assembled"
          ? (pr.share === "author"
              ? "Assembled \u2014 not in a public archive, but available from the author"
              : "Assembled \u2014 not publicly released")
          : "Sequencing in progress \u2014 no public genome yet");
        pline("Approx. size", pr.size ? "~" + esc(pr.size) + " (estimate)" : "");
        pline("Assembly", pr.level ? esc(pr.level) : "");
        pline("Sampling site", pr.site ? esc(pr.site) : "");
        pline("Reported", pr.year ? esc(pr.year) : "");
        pline("Project started", pr.since ? esc(pr.since) : "");
        pline("Gene model", pr.gm ? esc(pr.gm) : "");
        // pr.pub: one {label,url} or an array of them (paper, BioProject, …)
        var pubs = pr.pub ? [].concat(pr.pub) : [];
        pline("Reference", pubs.map(function (r) {
          return r.url
            ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + " \u2197</a>"
            : esc(r.label);
        }).join(" \u00b7 "));
        var contact = esc(pr.contact || "") +
          (pr.institution ? " \u2014 " + esc(pr.institution) : "") +
          (pr.country ? ", " + esc(pr.country) : "");
        pline("Contact", pr.contact ? contact : "");
        pline("Get in touch",
          (pr.url ? '<a href="' + esc(pr.url) + '" target="_blank" rel="noopener">' +
            esc(pr.contact || "contact") + "\u2019s page \u2197</a>, or " : "via the ") +
          '<a href="' + DISCORD + '" target="_blank" rel="noopener">' +
          (pr.url ? "the portal Discord" : "Tunicate Genomics Portal Discord") + "</a> community");
        pline("Notes", pr.note ? esc(pr.note) : "");

        rows.push(
          '<tr class="detail-row" data-idx="' + idx + '" hidden><td colspan="3">' +
            '<div class="detail-wrap">' + lines.join("") + "</div>" +
          "</td></tr>"
        );
        return; // skip the normal assembly rendering
      }

      var n = pubAsm(sp).length;
      var hay = (sp.sp + " " + sp.family + " " + sp.order + " " + sp.cls + " " +
        sp.asm.filter(function (a) { return a.gm; })
          .map(function (a) { return (a.gmLabel || "TUNOME") + " gene model "; }).join("") +
        (firstRefseq(sp) ? "ncbi refseq annotation gene model " : "") +
        (firstAniseed(sp) ? "aniseed gene model " : "") +
        sp.asm.map(function (a) {
          return a.n + " " + (a.acc || "") + " " + (a.resource ? a.resource.label : "") + " " +
            (a.level ? a.level + "-level " : "") + (a.note || "");
        }).join(" ")
      ).toLowerCase();

      rows.push(
        '<tr class="genome-row expandable' + famStart + '"' +
          ' data-idx="' + idx + '"' +
          ' data-chrom="' + (hasChromosome(sp) ? "1" : "0") + '"' +
          ' data-search="' + esc(hay) + '"' +
          ' role="button" tabindex="0" aria-expanded="false">' +
          famCell +
          '<td class="sci-name"><span class="caret" aria-hidden="true">▸</span><em>' + esc(sp.sp) + "</em>" +
            ' <span class="asm-count">' + n + (n === 1 ? " assembly" : " assemblies") + "</span>" +
            (hasChromosome(sp) ? ' <span class="chrom-badge">chromosome-level</span>' : "") + "</td>" +
          geneModelCell(sp) +
        "</tr>"
      );

      var asmSorted = sp.asm.slice().sort(function (a, b) {
        var ay = a.year == null ? -Infinity : a.year;
        var by = b.year == null ? -Infinity : b.year;
        return by - ay; // newest first; undated assemblies last
      });
      var inner = asmSorted.map(function (a) {
        return '<tr' + (a.unpublished ? ' class="unpub-row"' : "") + ">" +
          '<td class="sub-asm">' + esc(a.n) + refTag(a) + "</td>" +
          '<td class="asm-size">' + esc(a.size) + "</td>" +
          levelCell(a) +
          "<td>" + (a.year == null ? "—" : esc(a.year)) + "</td>" +
          sourceCell(a) +
          gmChips(a) +
          '<td class="small text-muted">' + esc(a.note || "") + "</td>" +
        "</tr>";
      }).join("");

      rows.push(
        '<tr class="detail-row" data-idx="' + idx + '" hidden><td colspan="3">' +
          '<div class="detail-wrap">' +
            '<table class="table table-sm detail-table mb-0"><thead><tr>' +
              "<th>Assembly</th><th>Size</th><th>Level</th><th>Year</th><th>Source</th><th>Gene model</th><th>Notes</th>" +
            "</tr></thead><tbody>" + inner + "</tbody></table>" +
          "</div>" +
        "</td></tr>"
      );
    });

    tbody.innerHTML = rows.join("");

    var real = list.filter(function (s) { return !isProgress(s); });
    var prog = list.filter(isProgress);
    var nAsm = real.reduce(function (acc, s) { return acc + pubAsm(s).length; }, 0);
    var label = document.getElementById("count-" + cls);
    if (label) label.textContent = real.length + " species · " + nAsm + " assemblies" +
      (prog.length ? " · " + prog.length + " not public yet" : "");
  }

  CLASSES.forEach(renderClass);

  // ---- hero stats ----
  var realSpecies = species.filter(function (s) { return !isProgress(s); });
  var totalAsm = realSpecies.reduce(function (acc, s) { return acc + pubAsm(s).length; }, 0);
  var setC = {}; realSpecies.forEach(function (s) { setC[s.cls] = 1; });
  var t = document.getElementById("stat-total"); if (t) t.textContent = totalAsm;
  var sp2 = document.getElementById("stat-species"); if (sp2) sp2.textContent = realSpecies.length;
  var c = document.getElementById("stat-classes"); if (c) c.textContent = Object.keys(setC).length;
  var chromAsm = realSpecies.reduce(function (acc, s) {
    return acc + pubAsm(s).filter(function (a) { return a.level === "Chromosome"; }).length;
  }, 0);
  var ch = document.getElementById("stat-chrom"); if (ch) ch.textContent = chromAsm;
  var chSp = document.getElementById("stat-chrom-species");
  if (chSp) chSp.textContent = realSpecies.filter(hasChromosome).length;
  // Genomes that exist but are not released: red species rows (no public genome
  // at all) + unpublished assemblies sitting inside an otherwise-public species.
  var unpubCount = species.filter(isProgress).length +
    species.reduce(function (acc, s) {
      return acc + (s.asm || []).filter(function (a) { return a.unpublished; }).length;
    }, 0);
  var up = document.getElementById("stat-unpub"); if (up) up.textContent = unpubCount;
  var upd = document.getElementById("data-updated"); if (upd && DATA.updated) upd.textContent = DATA.updated;

  // ---- expand / collapse ----
  var speciesRows = Array.prototype.slice.call(document.querySelectorAll("tr.genome-row"));
  var cladeRows = Array.prototype.slice.call(document.querySelectorAll("tr.clade-row"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("section.genome-section"));
  var detailByIdx = {};
  Array.prototype.slice.call(document.querySelectorAll("tr.detail-row")).forEach(function (r) {
    detailByIdx[r.dataset.idx] = r;
  });

  function setExpanded(row, open) {
    var d = detailByIdx[row.dataset.idx];
    if (!d) return;
    row.classList.toggle("expanded", open);
    row.setAttribute("aria-expanded", open ? "true" : "false");
    d.hidden = !open;
  }
  function toggle(row) { setExpanded(row, row.getAttribute("aria-expanded") !== "true"); }

  document.addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    var row = e.target.closest("tr.genome-row.expandable");
    if (row) toggle(row);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var row = e.target.closest("tr.genome-row.expandable");
    if (row) { e.preventDefault(); toggle(row); }
  });

  // ---- class switch + search ----
  var search = document.getElementById("genomeSearch");
  var switcher = document.getElementById("classSwitch");
  var chromToggle = document.getElementById("chromOnly");
  var activeClass = "Ascidiacea";
  var query = "";
  var chromOnly = false;

  function apply() {
    sections.forEach(function (sec) {
      sec.style.display = sec.dataset.section === activeClass ? "" : "none";
    });

    speciesRows.forEach(function (row) {
      var inActive = row.closest("section.genome-section").dataset.section === activeClass;
      var show = inActive &&
        (!query || row.dataset.search.indexOf(query) !== -1) &&
        (!chromOnly || row.dataset.chrom === "1");
      row.style.display = show ? "" : "none";
      if (!show || query === "") setExpanded(row, false);
      else if (query) setExpanded(row, true); // auto-expand matches
    });

    cladeRows.forEach(function (header) {
      var visible = false, node = header.nextElementSibling;
      while (node && !node.classList.contains("clade-row")) {
        if (node.classList.contains("genome-row") && node.style.display !== "none") { visible = true; break; }
        node = node.nextElementSibling;
      }
      header.style.display = visible ? "" : "none";
    });

    var activeSec = sections.filter(function (s) { return s.dataset.section === activeClass; })[0];
    var any = activeSec && Array.prototype.slice.call(activeSec.querySelectorAll("tr.genome-row"))
      .some(function (r) { return r.style.display !== "none"; });
    var nr = document.getElementById("noResults");
    if (activeSec && !any) {
      if (!nr) {
        nr = document.createElement("p");
        nr.id = "noResults";
        nr.className = "text-center text-muted py-4";
        nr.textContent = "No matching assemblies.";
      }
      activeSec.appendChild(nr);
      nr.style.display = "";
    } else if (nr) { nr.style.display = "none"; }
  }

  if (switcher) {
    switcher.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-class]");
      if (!btn) return;
      activeClass = btn.dataset.class;
      switcher.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      apply();
    });
  }
  if (chromToggle) {
    chromToggle.addEventListener("change", function () {
      chromOnly = this.checked;
      apply();
    });
  }
  if (search) {
    search.addEventListener("input", function () {
      query = this.value.trim().toLowerCase();
      apply();
    });
  }

  apply();
})();
