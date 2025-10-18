#!/bin/bash
set -euo pipefail

echo "🧹 Clean rebuild for iOS starting..."

# 1) Install deps and build web assets
npm install
npm run build

# 2) Ensure AppIcon set exists and copy icons if provided in ./icons
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
if [ -d icons ] && ls icons/AppIcon-*.png 1>/dev/null 2>&1; then
  echo "🎨 Copying icons from ./icons to AppIcon.appiconset..."
  cp icons/AppIcon-*.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
fi

# 3) Verify critical icon exists
if [ ! -f ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png ]; then
  echo "⚠️  Warning: AppIcon-1024.png not found in AppIcon.appiconset."
  echo "    Make sure your AppIcon-*.png files are in ./icons or already in the appiconset folder."
fi

# 4) Sync Capacitor
npx cap sync ios

echo "✅ Web assets built and iOS synced. Next: npx cap open ios (Clean Build Folder, then Archive)"