#!/usr/bin/env python3
"""Watch NCBI for tunicate genome assemblies that the portal does not list yet.

Compares the NCBI Datasets report for taxon 7712 (Tunicata) with the accessions in
public/assets/js/genomes-data.js and reports:

  - new assemblies            (accession not in the data file; "new species" if the
                               organism is not in the data file either)
  - new versions              (GCA_X.2 on NCBI while the data file has GCA_X.1)
  - new RefSeq annotations    (a GCF_ whose GCA_ twin is in the data file)
  - assembly level changes    (e.g. Scaffold -> Chromosome for a listed accession)

Run by .github/workflows/ncbi-watch.yml every week; also fine to run by hand:

    python3 scripts/ncbi_watch.py              # prints the report
    python3 scripts/ncbi_watch.py --out report.md --json summary.json

Accessions listed in .github/ncbi-watch-ignore.txt (one per line, # comments) are
skipped — use it for records that were looked at and deliberately left out.
Standard library only. Exits non-zero if NCBI cannot be read, so a network error
never looks like "nothing new".
"""
import argparse, json, re, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "public/assets/js/genomes-data.js"
IGNORE = ROOT / ".github/ncbi-watch-ignore.txt"
API = "https://api.ncbi.nlm.nih.gov/datasets/v2/genome/taxon/7712/dataset_report?page_size=1000"
ACC = re.compile(r"GC[AF]_\d{9}\.\d+")


def fetch_ncbi():
    reports, token = [], None
    for _ in range(50):                       # 50 pages x 1000 = far more than exists
        url = API + (f"&page_token={token}" if token else "")
        for attempt in range(4):
            try:
                with urllib.request.urlopen(url, timeout=90) as r:
                    d = json.load(r)
                break
            except Exception as e:            # retry transient errors, then give up loudly
                if attempt == 3:
                    sys.exit(f"ncbi_watch: cannot read NCBI Datasets ({e})")
                time.sleep(5 * (attempt + 1))
        reports += d.get("reports", [])
        token = d.get("next_page_token")
        if not token:
            break
        time.sleep(0.4)                       # stay under 3 requests/s without an API key
    if not reports:
        sys.exit("ncbi_watch: NCBI returned no assemblies for taxon 7712 — refusing to report")
    return reports


def read_data(path=DATA):
    src = Path(path).read_text(encoding="utf-8")
    known = set(ACC.findall(src))
    # level of each listed assembly: the asm objects are flat { … } literals
    level = {}
    for obj in re.findall(r"\{[^{}]*\}", src):
        m = re.search(r'\bacc:\s*"(GC[AF]_\d{9}\.\d+)"', obj)
        lv = re.search(r'\blevel:\s*"([^"]+)"', obj)
        if m and lv:
            level[m.group(1)] = lv.group(1)
    species = set(re.findall(r'\bsp:\s*"([^"]+)"', src))
    return known, level, species


def read_ignore():
    if not IGNORE.exists():
        return set()
    return {l.split("#")[0].strip() for l in IGNORE.read_text().splitlines() if l.split("#")[0].strip()}


def split(acc):                               # GCA_000224145.2 -> ("GCA", "000224145", 2)
    p, rest = acc.split("_")
    num, ver = rest.split(".")
    return p, num, int(ver)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", help="write the Markdown report here")
    ap.add_argument("--json", help="write a machine-readable summary here")
    ap.add_argument("--data", default=str(DATA), help="data file to compare (default: the portal's; for testing)")
    a = ap.parse_args()

    reports = fetch_ncbi()
    known, level, species = read_data(a.data)
    ignore = read_ignore()
    known_ver = {}                            # (prefix, number) -> highest listed version
    for k in known:
        p, n, v = split(k)
        known_ver[(p, n)] = max(v, known_ver.get((p, n), 0))
    known_gca = {n for (p, n) in known_ver if p == "GCA"}

    new, bump, refseq, lvl = [], [], [], []
    for r in reports:
        acc = r.get("accession", "")
        if not ACC.fullmatch(acc) or acc in ignore:
            continue
        info = r.get("assembly_info", {})
        row = {
            "accession": acc,
            "organism": r.get("organism", {}).get("organism_name", "?"),
            "taxid": r.get("organism", {}).get("tax_id", ""),
            "name": info.get("assembly_name", ""),
            "level": info.get("assembly_level", ""),
            "released": info.get("release_date", ""),
            "status": info.get("assembly_status", ""),
            "size_mb": round(int(r.get("assembly_stats", {}).get("total_sequence_length") or 0) / 1e6),   # NCBI gives a string
        }
        if acc in known:
            if acc in level and row["level"] and row["level"] != level[acc]:
                lvl.append(dict(row, listed_level=level[acc]))
            continue
        p, n, v = split(acc)
        if (p, n) in known_ver and v > known_ver[(p, n)]:
            bump.append(dict(row, listed=f"{p}_{n}.{known_ver[(p, n)]}"))
        elif (p, n) in known_ver:
            continue                          # an older version than the one listed
        elif p == "GCF" and n in known_gca:
            refseq.append(row)
        else:
            row["new_species"] = row["organism"] not in species
            new.append(row)

    for L in (new, bump, refseq, lvl):
        L.sort(key=lambda x: (x["released"] or "", x["accession"]))
    total = len(new) + len(bump) + len(refseq) + len(lvl)

    def table(rows, extra=None):
        h = "| Organism | Accession | Assembly | Level | Size | Released |" + (f" {extra[0]} |" if extra else "") + "\n"
        h += "|---|---|---|---|---|---|" + ("---|" if extra else "") + "\n"
        for x in rows:
            org = f"*{x['organism']}*" + (" **(new species)**" if x.get("new_species") else "")
            link = f"[{x['accession']}](https://www.ncbi.nlm.nih.gov/datasets/genome/{x['accession']}/)"
            h += f"| {org} | {link} | {x['name']} | {x['level']} | {x['size_mb']} Mb | {x['released']} |" + (f" {x[extra[1]]} |" if extra else "") + "\n"
        return h

    md = [f"NCBI Datasets lists **{len(reports)}** tunicate assemblies (taxon 7712); "
          f"`genomes-data.js` lists **{len(known)}** accessions.\n"]
    if new:
        md.append(f"### New assemblies ({len(new)})\n" + table(new, ("NCBI taxid", "taxid")))
    if bump:
        md.append(f"### New versions of listed assemblies ({len(bump)})\n" + table(bump, ("Listed", "listed")))
    if refseq:
        md.append(f"### New RefSeq annotations for listed assemblies ({len(refseq)})\n" + table(refseq))
    if lvl:
        md.append(f"### Assembly level changed ({len(lvl)})\n" + table(lvl, ("Listed level", "listed_level")))
    if total:
        md.append("**To apply:** open Claude Code in the repository and say *“Update the genome data from NCBI "
                  "following UPDATING.md”* (or add the rows by hand, §3 of UPDATING.md), then open a pull request.\n"
                  "To silence a record that should stay out, add its accession to `.github/ncbi-watch-ignore.txt`.")
    else:
        md.append("Nothing new — the portal is up to date.")
    report = "\n".join(md)
    # Stable key: the same set of findings gives the same key, so the workflow does not repeat itself
    key = ",".join(sorted(x["accession"] + ("@" + x["level"] if x in lvl else "") for x in new + bump + refseq + lvl))

    print(report)
    if a.out:
        Path(a.out).write_text(report + f"\n\n<!-- ncbi-watch-key: {key} -->\n", encoding="utf-8")
    if a.json:
        Path(a.json).write_text(json.dumps({"total": total, "new": len(new), "versions": len(bump), "refseq": len(refseq),
                                            "levels": len(lvl), "new_species": sum(1 for x in new if x.get("new_species")),
                                            "key": key, "ncbi": len(reports), "listed": len(known)}), encoding="utf-8")


if __name__ == "__main__":
    main()
