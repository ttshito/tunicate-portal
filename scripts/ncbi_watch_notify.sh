#!/usr/bin/env bash
# Turn the ncbi_watch.py output (report.md, summary.json) into a GitHub issue and an
# optional Discord message. Called by .github/workflows/ncbi-watch.yml (needs GH_TOKEN;
# DISCORD_WEBHOOK_URL is optional — set it as a repository secret to get Discord posts).
#
#   findings, no open issue        -> open an issue (label ncbi-watch) + Discord
#   findings, same as last time    -> nothing (no weekly repeats)
#   findings changed               -> comment on the open issue + Discord
#   nothing new, issue still open  -> comment "up to date" and close it
set -euo pipefail

LABEL=ncbi-watch
j() { python3 -c "import json,sys; print(json.load(open('summary.json'))[sys.argv[1]])" "$1"; }
total=$(j total)
key=$(j key)
open=$(gh issue list --label "$LABEL" --state open --json number --jq '.[0].number // empty')

discord() {   # $1 = message text
  [ -n "${DISCORD_WEBHOOK_URL:-}" ] || { echo "no DISCORD_WEBHOOK_URL secret — skipping Discord"; return 1; }
  if python3 -c 'import json,sys; print(json.dumps({"content": sys.argv[1][:1900], "allowed_mentions": {"parse": []}}))' "$1" \
       | curl -fsS -X POST -H 'Content-Type: application/json' --data @- "$DISCORD_WEBHOOK_URL" >/dev/null; then
    echo "posted to Discord"
  else
    echo "Discord post failed (the issue is still there)"; return 1
  fi
}

# Manual run with "discord_test" ticked: check the webhook, and fail the job if it does not work
if [ "${DISCORD_TEST:-false}" = "true" ]; then
  discord "✅ Test from the Tunicate Genomics Portal: the weekly NCBI watch can post here. NCBI lists $(j ncbi) tunicate assemblies; the portal lists $(j listed)." \
    || { echo "::error::Discord test failed — check the DISCORD_WEBHOOK_URL secret"; exit 1; }
fi

summary_line() {
  python3 - <<'PY'
import json
d = json.load(open("summary.json")); p = []
pl = lambda n, one, many: f"{n} {one if n == 1 else many}"
if d["new"]: p.append(pl(d["new"], "new assembly", "new assemblies"))
if d["new_species"]: p.append(f"{d['new_species']} of them from species not in the portal")
if d["versions"]: p.append(pl(d["versions"], "new version", "new versions"))
if d["refseq"]: p.append(pl(d["refseq"], "new RefSeq annotation", "new RefSeq annotations"))
if d["levels"]: p.append(pl(d["levels"], "level change", "level changes"))
print(", ".join(p))
PY
}

if [ "$total" = "0" ]; then
  if [ -n "$open" ]; then
    gh issue comment "$open" --body "The portal now lists every tunicate assembly on NCBI ($(j ncbi)). Closing."
    gh issue close "$open"
  fi
  echo "nothing new"; exit 0
fi

if [ -n "$open" ]; then
  # Already reported exactly this? The key is in the issue body or a comment as an HTML comment.
  if gh issue view "$open" --json body,comments --jq '.body, .comments[].body' | grep -qF "ncbi-watch-key: $key -->"; then
    echo "same findings as issue #$open — nothing to do"; exit 0
  fi
  url=$(gh issue comment "$open" --body-file report.md)
  discord "🧬 NCBI update for the Tunicate Genomics Portal: $(summary_line). $url" || true   # the issue is what matters
else
  gh label create "$LABEL" --color 1D76DB --description "New tunicate genomes on NCBI (automatic)" 2>/dev/null || true
  url=$(gh issue create --label "$LABEL" --title "NCBI: $total tunicate genome record(s) not in the portal yet" --body-file report.md)
  discord "🧬 NCBI has tunicate genomes that the Tunicate Genomics Portal does not list yet: $(summary_line). $url" || true
fi
echo "reported: $url"
