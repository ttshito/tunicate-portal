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
  function firstGm(sp) {
    for (var i = 0; i < sp.asm.length; i++) { if (sp.asm[i].gm) return sp.asm[i]; }
    return null;
  }
  function firstRefseq(sp) {
    for (var i = 0; i < sp.asm.length; i++) { if (sp.asm[i].refseq) return sp.asm[i]; }
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
  // One assembly's gene-model chips: NCBI (RefSeq) and/or TUNOME/GHOST — both if both.
  function gmChips(a) {
    var parts = [];
    if (a.refseq) parts.push(ncbiAnchor(a));
    if (a.gm) parts.push(gmAnchor(a));
    return parts.length
      ? '<td class="gene-model">' + parts.join(" ") + "</td>"
      : '<td class="gene-model gm-no">—</td>';
  }
  // Species-level summary chip(s) for the collapsed row.
  function geneModelCell(sp) {
    var parts = [];
    var r = firstRefseq(sp), g = firstGm(sp);
    if (r) parts.push(ncbiAnchor(r));
    if (g) parts.push(gmAnchor(g));
    return parts.length
      ? '<td class="gene-model">' + parts.join(" ") + "</td>"
      : '<td class="gene-model gm-no">—</td>';
  }
  // Assembly source link: an NCBI accession, or a non-NCBI resource (ANISEED, GHOST…).
  function sourceCell(a) {
    if (a.acc) return '<td class="accession">' + accLink(a.acc) + "</td>";
    if (a.resource) return '<td class="accession"><a href="' + esc(a.resource.url) +
      '" target="_blank" rel="noopener">' + esc(a.resource.label) + "</a></td>";
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
  function isProgress(s) { return s.status === "progress"; }
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

      // ---- sequencing-in-progress row (no genome yet) ----
      if (isProgress(sp)) {
        var pr = sp.progress || {};
        var phay = (sp.sp + " " + sp.family + " " + sp.order + " " + sp.cls +
          " sequencing in progress no genome yet " +
          (pr.contact || "") + " " + (pr.institution || "") + " " + (pr.country || "")
        ).toLowerCase();
        rows.push(
          '<tr class="genome-row expandable progress-row' + famStart + '"' +
            ' data-idx="' + idx + '"' +
            ' data-search="' + esc(phay) + '"' +
            ' role="button" tabindex="0" aria-expanded="false">' +
            famCell +
            '<td class="sci-name"><span class="caret" aria-hidden="true">▸</span>' +
              '<em class="sp-progress">' + esc(sp.sp) + "</em>" +
              ' <span class="progress-badge">sequencing in progress</span></td>' +
            '<td class="gene-model gm-no">—</td>' +
          "</tr>"
        );
        var contact = esc(pr.contact || "") +
          (pr.institution ? " — " + esc(pr.institution) : "") +
          (pr.country ? ", " + esc(pr.country) : "");
        rows.push(
          '<tr class="detail-row" data-idx="' + idx + '" hidden><td colspan="3">' +
            '<div class="detail-wrap">' +
              '<div class="progress-line"><span class="pl-key">Status</span> Sequencing in progress — no public genome yet</div>' +
              '<div class="progress-line"><span class="pl-key">Reported</span> ' + esc(pr.year) + "</div>" +
              '<div class="progress-line"><span class="pl-key">Contact</span> ' + contact + "</div>" +
              '<div class="progress-line"><span class="pl-key">Get in touch</span> via the ' +
                '<a href="' + DISCORD + '" target="_blank" rel="noopener">Tunicate Portal Discord</a> community</div>' +
            "</div>" +
          "</td></tr>"
        );
        return; // skip the normal assembly rendering
      }

      var n = sp.asm.length;
      var hay = (sp.sp + " " + sp.family + " " + sp.order + " " + sp.cls + " " +
        (firstGm(sp) ? "tunome gene model " : "") + (firstRefseq(sp) ? "ncbi refseq annotation gene model " : "") +
        sp.asm.map(function (a) {
          return a.n + " " + (a.acc || "") + " " + (a.resource ? a.resource.label : "") + " " + (a.note || "");
        }).join(" ")
      ).toLowerCase();

      rows.push(
        '<tr class="genome-row expandable' + famStart + '"' +
          ' data-idx="' + idx + '"' +
          ' data-search="' + esc(hay) + '"' +
          ' role="button" tabindex="0" aria-expanded="false">' +
          famCell +
          '<td class="sci-name"><span class="caret" aria-hidden="true">▸</span><em>' + esc(sp.sp) + "</em>" +
            ' <span class="asm-count">' + n + (n === 1 ? " assembly" : " assemblies") + "</span></td>" +
          geneModelCell(sp) +
        "</tr>"
      );

      var asmSorted = sp.asm.slice().sort(function (a, b) {
        var ay = a.year == null ? -Infinity : a.year;
        var by = b.year == null ? -Infinity : b.year;
        return by - ay; // newest first; undated assemblies last
      });
      var inner = asmSorted.map(function (a) {
        return "<tr>" +
          '<td class="sub-asm">' + esc(a.n) + refTag(a) + "</td>" +
          "<td>" + esc(a.size) + "</td>" +
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
              "<th>Assembly</th><th>Size</th><th>Year</th><th>Source</th><th>Gene model</th><th>Notes</th>" +
            "</tr></thead><tbody>" + inner + "</tbody></table>" +
          "</div>" +
        "</td></tr>"
      );
    });

    tbody.innerHTML = rows.join("");

    var real = list.filter(function (s) { return !isProgress(s); });
    var prog = list.filter(isProgress);
    var nAsm = real.reduce(function (acc, s) { return acc + s.asm.length; }, 0);
    var label = document.getElementById("count-" + cls);
    if (label) label.textContent = real.length + " species · " + nAsm + " assemblies" +
      (prog.length ? " · " + prog.length + " in progress" : "");
  }

  CLASSES.forEach(renderClass);

  // ---- hero stats ----
  var realSpecies = species.filter(function (s) { return !isProgress(s); });
  var totalAsm = realSpecies.reduce(function (acc, s) { return acc + s.asm.length; }, 0);
  var setC = {}; realSpecies.forEach(function (s) { setC[s.cls] = 1; });
  var t = document.getElementById("stat-total"); if (t) t.textContent = totalAsm;
  var sp2 = document.getElementById("stat-species"); if (sp2) sp2.textContent = realSpecies.length;
  var c = document.getElementById("stat-classes"); if (c) c.textContent = Object.keys(setC).length;
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
  var activeClass = "Ascidiacea";
  var query = "";

  function apply() {
    sections.forEach(function (sec) {
      sec.style.display = sec.dataset.section === activeClass ? "" : "none";
    });

    speciesRows.forEach(function (row) {
      var inActive = row.closest("section.genome-section").dataset.section === activeClass;
      var show = inActive && (!query || row.dataset.search.indexOf(query) !== -1);
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
  if (search) {
    search.addEventListener("input", function () {
      query = this.value.trim().toLowerCase();
      apply();
    });
  }

  apply();
})();
