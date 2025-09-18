#!/usr/bin/env bash

# Fail fast and show commands
set -euo pipefail
set -x

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
export HOMEBREW_NO_AUTO_UPDATE=1

# Install CocoaPods and Node.js 20 (required by Capacitor CLI >= 7)
echo "📦 Install CocoaPods and Node.js (20.x)"
brew install cocoapods || true
brew install node@20 || true
brew link --overwrite --force node@20 || true

# Ensure Node 20 is first in PATH on both Intel and Apple Silicon runners
export PATH="/usr/local/opt/node@20/bin:/opt/homebrew/opt/node@20/bin:$PATH"
node -v
npm -v

# Change to repository root
cd /Volumes/workspace/repository

# Install dependencies
echo "📦 Installing npm dependencies"
# Xcode Cloud maxsockets fix for reliability
npm config set maxsockets 3
npm ci

# Build the web app
echo "🏗️ Building web app"
npm run build

# Sync Capacitor with iOS (requires Node 20)
echo "🔄 Syncing Capacitor with iOS"
npx cap sync ios

# Install CocoaPods dependencies from ios/App
echo "📱 Installing iOS dependencies"
cd /Volumes/workspace/repository/ios/App
pwd
ls -la
pod install

echo "✅ Post-clone script completed successfully"