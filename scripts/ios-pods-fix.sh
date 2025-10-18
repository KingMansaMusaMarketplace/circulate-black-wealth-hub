#!/bin/bash
set -euo pipefail

echo "🔧 Fixing CocoaPods and regenerating iOS build scripts..."

cd ios/App

if ! command -v pod >/dev/null 2>&1; then
  echo "❌ CocoaPods isn't installed. Install with one of these:"
  echo "   - brew install cocoapods"
  echo "   - sudo gem install cocoapods"
  exit 1
fi

echo "📦 CocoaPods version: $(pod --version)"

pod repo update
pod deintegrate
pod install

cd ../..

echo "🔄 Syncing Capacitor iOS platform..."
npx cap sync ios

echo "✅ Done. Open Xcode with: npx cap open ios, then Clean Build Folder and Archive."