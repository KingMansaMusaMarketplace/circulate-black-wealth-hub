#!/bin/bash
set -euo pipefail

SRC=${1:-public/app-icon-source.png}
DEST="ios/App/App/Assets.xcassets/AppIcon.appiconset"

if [ ! -f "$SRC" ]; then
  echo "❌ Source image not found: $SRC"
  echo "Usage: bash scripts/generate-ios-icons.sh path/to/1024x1024.png"
  exit 1
fi

mkdir -p "$DEST"

echo "🎨 Generating iOS AppIcon PNGs from $SRC ..."

# Declare required sizes mapped to filenames
sizes=(
  "1024 AppIcon-1024.png"
  "180 AppIcon-180.png"
  "167 AppIcon-167.png"
  "152 AppIcon-152.png"
  "144 AppIcon-144.png"
  "120 AppIcon-120.png"
  "114 AppIcon-114.png"
  "100 AppIcon-100.png"
  "87 AppIcon-87.png"
  "80 AppIcon-80.png"
  "76 AppIcon-76.png"
  "72 AppIcon-72.png"
  "60 AppIcon-60.png"
  "58 AppIcon-58.png"
  "57 AppIcon-57.png"
  "50 AppIcon-50.png"
  "40 AppIcon-40.png"
  "29 AppIcon-29.png"
  "20 AppIcon-20.png"
)

for entry in "${sizes[@]}"; do
  read -r px name <<<"$entry"
  echo "  • $name ($px x $px)"
  sips -s format png -z "$px" "$px" "$SRC" --out "$DEST/$name" >/dev/null
done

echo "✅ Icons generated into $DEST"

echo "🔄 Syncing Capacitor iOS platform..."
npx cap sync ios

echo "📦 Done. Verify one file exists:"
echo "   ls $DEST/AppIcon-1024.png"
echo "Then open Xcode: npx cap open ios (Clean Build Folder, then Archive)."