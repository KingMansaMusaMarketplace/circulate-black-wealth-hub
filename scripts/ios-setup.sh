#!/usr/bin/env bash
set -euo pipefail

# iOS setup helper for Capacitor projects
# Usage: run this from the project root:  bash scripts/ios-setup.sh

if [ ! -f package.json ]; then
  echo "❌ package.json not found. Please run this from your project root directory."
  echo "Tip: In Finder, right-click your project folder → New Terminal at Folder, then run: bash scripts/ios-setup.sh"
  exit 1
fi

echo "📦 Installing npm dependencies (npm ci)"
npm ci

echo "🔄 Syncing Capacitor with iOS"
npx cap sync ios

echo "📱 Installing CocoaPods in ios/App"
cd ios/App
pod repo update
pod install

echo "🔓 Opening Xcode workspace (optional)"
open App.xcworkspace || true

echo "✅ iOS setup complete"
