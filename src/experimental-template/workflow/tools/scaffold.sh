#!/usr/bin/env bash
# Scaffold a new experimental template from _golden. Engineering only: no design decisions here.
# Usage: scaffold.sh <name> <prefix> <ComponentName>
#   e.g. scaffold.sh tamil-wedding tm TamilWedding
# Does: copy _golden, rename the gd prefix, add the lazy import + route to src/App.tsx (idempotent).
# Never touches _golden or other templates.
set -euo pipefail

NAME="${1:?name}"; PFX="${2:?2-3 letter prefix}"; COMP="${3:?ComponentName}"
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
SRC="$ROOT/src/experimental-template"
DEST="$SRC/$NAME"

[[ "$PFX" =~ ^[a-z]{2,3}$ ]] || { echo "prefix must be 2-3 lowercase letters"; exit 1; }
[[ "$PFX" != "gd" ]] || { echo "prefix must differ from gd"; exit 1; }
[[ ! -e "$DEST" ]] || { echo "$DEST already exists"; exit 1; }

cp -R "$SRC/_golden" "$DEST"

# -exec per file: xargs / `find {} +` fail in the Cursor sandbox (ARG_MAX sysconf).
find "$DEST" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.md' \) \
  -exec perl -pi -e "s/gd-/$PFX-/g; s/\\bgd\\b/$PFX/g" {} \;

LEFT=$(grep -rIlw 'gd' "$DEST" || true)
[[ -z "$LEFT" ]] || { echo "leftover 'gd' in:"; echo "$LEFT"; }

APP="$ROOT/src/App.tsx"
if ! grep -q "experimental/$NAME\"" "$APP"; then
  # Insert after the last experimental lazy import and the last experimental route.
  perl -0pi -e "s|(const \\w+ = lazy\\(\\(\\) => import\\('./experimental-template/[^']+'\\)\\)\\n)(?!.*const \\w+ = lazy\\(\\(\\) => import\\('./experimental-template/)|\$1const $COMP = lazy(() => import('./experimental-template/$NAME'))\\n|s; s|(<Route path=\"/experimental/[^\"]+\" element=\\{<\\w+ />\\} />\\n)(?!.*<Route path=\"/experimental/)|\$1      <Route path=\"/experimental/$NAME\" element={<$COMP />} />\\n|s" "$APP"
  grep -q "experimental/$NAME\"" "$APP" || echo "WARN: could not auto-add route; add it to src/App.tsx by hand"
fi

echo "Scaffolded $DEST (prefix $PFX). Route: /experimental/$NAME"
