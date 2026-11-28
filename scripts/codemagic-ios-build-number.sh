#!/usr/bin/env bash
# Set the iOS build number to (latest TestFlight build + 1).
# Uses the App Store Connect API key that Codemagic injects from the
# `codemagic_asc` integration. No key material lives in this file.
set -euo pipefail

cd "${CM_BUILD_DIR:-.}/ios/App"

BUNDLE_ID="${BUNDLE_ID:-com.aniki1413.paomianstock}"
APPLE_ID="${APP_STORE_APPLE_ID:-}"

if [[ -z "$APPLE_ID" ]]; then
  echo "Looking up the App Store Connect app id for ${BUNDLE_ID}"
  set +e
  LIST_JSON="$(app-store-connect apps list --bundle-id-identifier "$BUNDLE_ID" --strict-match-identifier --json 2>/dev/null)"
  LIST_STATUS=$?
  set -e
  if [[ "$LIST_STATUS" -eq 0 && -n "$LIST_JSON" ]]; then
    APPLE_ID="$(
      printf '%s' "$LIST_JSON" | BUNDLE_ID="$BUNDLE_ID" python3 -c '
import json, os, sys
raw = sys.stdin.read().strip()
want = os.environ["BUNDLE_ID"]
if not raw:
    sys.exit(0)
data = json.loads(raw)
items = data.get("data") if isinstance(data, dict) else data
if isinstance(items, dict):
    items = [items]
if not isinstance(items, list):
    items = []
for item in items:
    if not isinstance(item, dict):
        continue
    attrs = item.get("attributes") or {}
    bundle = str(attrs.get("bundleId") or item.get("bundleId") or "")
    app_id = str(item.get("id") or "")
    if app_id and (bundle == want or bundle == ""):
        print(app_id)
        break
'
    )"
  else
    echo "Could not list apps yet. The first upload can still use build number 1 after the app record exists."
  fi
fi

BUILD_NUMBER=1
if [[ -n "${APPLE_ID:-}" ]]; then
  echo "App Store Apple ID: ${APPLE_ID}"
  set +e
  LATEST="$(app-store-connect get-latest-testflight-build-number "$APPLE_ID" --platform IOS 2>/dev/null)"
  LATEST_STATUS=$?
  set -e
  if [[ "$LATEST_STATUS" -eq 0 && "$LATEST" =~ ^[0-9]+$ ]]; then
    BUILD_NUMBER=$((LATEST + 1))
  else
    echo "No TestFlight build for this app yet. Starting at 1."
  fi
else
  echo "No App Store Connect app id yet. Starting at build number 1."
fi

agvtool new-version -all "$BUILD_NUMBER"
echo "CFBundleVersion=${BUILD_NUMBER}"
