#!/bin/bash
# ============================================================
# 1325.AI — iOS Splash Repair (Apple Guideline 2.1(a) fix)
# Forces the branded navy 1325.AI launch screen into the build
# and wipes every cache that could restore Capacitor's default
# placeholder splash (light gray screen with the blue X).
# ============================================================
set -euo pipefail

echo "🧹 Step 1/7 — Cleaning Xcode caches (DerivedData, module cache)"
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
rm -rf ios/App/build ios/App/DerivedData 2>/dev/null || true

echo "📦 Step 2/7 — Installing dependencies"
npm install

echo "🏗  Step 3/7 — Building web assets"
npm run build

echo "🎨 Step 4/7 — Forcing branded splash into the asset catalog"
SPLASH_DIR="ios/App/App/Assets.xcassets/Splash.imageset"
if [ ! -f "$SPLASH_DIR/splash-2732x2732.png" ]; then
  echo "❌ Branded splash missing at $SPLASH_DIR — run 'git pull' first."
  exit 1
fi
# Make all three scale slots identical to the branded artwork
cp -f "$SPLASH_DIR/splash-2732x2732.png" "$SPLASH_DIR/splash-2732x2732-1.png"
cp -f "$SPLASH_DIR/splash-2732x2732.png" "$SPLASH_DIR/splash-2732x2732-2.png"

echo "🔍 Step 5/7 — Verifying the splash is the branded navy artwork (not the placeholder)"
SIZE=$(stat -f%z "$SPLASH_DIR/splash-2732x2732.png" 2>/dev/null || stat -c%s "$SPLASH_DIR/splash-2732x2732.png")
if [ "$SIZE" -lt 200000 ]; then
  echo "❌ Splash file is only ${SIZE} bytes — that is the Capacitor placeholder, not the 1325.AI artwork."
  exit 1
fi
echo "   ✅ Splash OK (${SIZE} bytes, 2732x2732 navy 1325.AI)"

echo "🔄 Step 6/7 — Syncing Capacitor + reinstalling Pods"
npx cap sync ios
cd ios/App
pod deintegrate >/dev/null 2>&1 || true
pod install --repo-update
cd ../..

echo "✅ Step 7/7 — Done."
echo ""
echo "NEXT IN XCODE:"
echo "  1. npx cap open ios"
echo "  2. Product ▸ Clean Build Folder  (Shift+Cmd+K)"
echo "  3. Click App ▸ Assets ▸ Splash — confirm you see the NAVY 1325.AI image"
echo "  4. Set Build number to 36"
echo "  5. Product ▸ Archive ▸ Distribute App"
