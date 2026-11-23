#!/usr/bin/env bash
# Depth audit: how far a template has moved from _golden. Mechanical evidence only; it cannot judge taste.
# Usage: audit.sh <name> <prefix>
# Flags (exit 1 if any FAIL): missing planning docs, sections still close to golden, too few generated
# assets, unreferenced assets, sprites/particles unchanged, leftover golden geometry.
set -uo pipefail
NAME="${1:?name}"; PFX="${2:?prefix}"
SRC="$(cd "$(dirname "$0")/../.." && pwd)"
G="$SRC/_golden"; T="$SRC/$NAME"
FAIL=0
norm() { sed "s/gd-/P-/g; s/\\bgd\\b/P/g; s/$PFX-/P-/g; s/\\b$PFX\\b/P/g" "$1" 2>/dev/null; }
changed() { diff <(norm "$1") <(norm "$2") | grep -c '^[<>]'; }
fail() { echo "FAIL  $*"; FAIL=1; }
ok() { echo "ok    $*"; }

echo "== planning docs"
for f in cultural-direction.md reference-analysis.md; do
  [[ -s "$T/planning/$f" ]] && ok "planning/$f" || fail "planning/$f missing: research + reference analysis must be written before code"
done

echo "== section depth (changed lines vs _golden: index + Divider + css)"
for s in opening couple countdown celebrations rsvp closing; do
  total=0
  for f in "$G/sections/$s"/*; do
    b="$T/sections/$s/$(basename "$f")"
    [[ -f "$b" ]] && total=$((total + $(changed "$f" "$b"))) || total=$((total + 1))
  done
  idx=$(changed "$G/sections/$s/index.tsx" "$T/sections/$s/index.tsx")
  div=$(changed "$G/sections/$s/Divider.tsx" "$T/sections/$s/Divider.tsx")
  line="$s total=$total index=$idx divider=$div"
  # Closing has no divider by design; require its own full-scene treatment instead.
  # Floors calibrated just under tamil-wedding (the reference build). Raise them when a richer reference exists.
  min=150; [[ $s == opening ]] && min=100; [[ $s == rsvp || $s == closing ]] && min=90
  [[ $total -ge $min ]] && ok "$line" || fail "$line: below $min, still close to golden"
  if [[ $s != closing ]]; then [[ $div -ge 14 ]] || fail "$s divider not redrawn ($div)"; fi
done

echo "== ambient + particles"
sp=$(diff "$G/core/ambient/Sprites.tsx" "$T/core/ambient/Sprites.tsx" | grep -c '^>')
[[ $sp -ge 20 ]] && ok "sprites added: $sp lines" || fail "sprites barely changed ($sp): culture-specific particles needed"
for s in opening couple countdown celebrations rsvp closing; do
  a=$(awk '/particles: \[/,/\],/' "$G/sections/$s/index.tsx" | grep -o "sprite: '[a-z-]*'" | sort -u | tr '\n' ' ')
  b=$(awk '/particles: \[/,/\],/' "$T/sections/$s/index.tsx" | grep -o "sprite: '[a-z-]*'" | sort -u | tr '\n' ' ')
  [[ -n "$b" && "$a" != "$b" ]] && ok "$s particles: $b" || fail "$s particles same as golden or missing (sprites: ${b:-none}); use culture-specific sprites"
done

echo "== generated assets"
n=$(ls "$T/assets/generated" 2>/dev/null | wc -l | tr -d ' ')
[[ $n -ge 7 ]] && ok "$n generated assets" || fail "only $n generated assets (need ≥7: family crest+corner, event toran+corner, rsvp header, countdown scene, closing scene, plus extras)"
for f in "$T/assets/generated"/*; do
  [[ -f "$f" ]] || continue
  b=$(basename "$f"); b="${b%.*}"
  grep -rqs "$b" "$T/sections" "$T/config" || fail "asset not referenced: $b"
  kb=$(( $(stat -f%z "$f" 2>/dev/null || stat -c%s "$f") / 1024 ))
  [[ $kb -le 650 ]] || fail "$b is ${kb} KB (limit 650)"
done

echo "== leftovers"
grep -rIn --include=*.tsx --include=*.css -E 'glass|backdrop-filter' "$T/sections" | head -3 | sed 's/^/warn  /'
if grep -rIn "Math\.random()" "$T" --include=*.ts --include=*.tsx | grep -v '^\S*contract.ts' | grep -q .; then fail "Math.random() used; derive from ctx.seed"; fi

echo
[[ $FAIL -eq 0 ]] && echo "AUDIT PASSED (mechanical only: still review screenshots)" || { echo "AUDIT FAILED"; exit 1; }
