#!/usr/bin/env bash

set -x

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Install CocoaPods and Node.js
echo "📦 Install CocoaPods and Node.js"
brew install cocoapods
brew install node@18
brew link node@18

# Install dependencies
echo "📦 Installing npm dependencies"
# XCode Cloud maxsockets fix for reliability
npm config set maxsockets 3
npm ci

# Build the web app
echo "🏗️ Building web app"
npm run build

# Sync Capacitor with iOS
echo "🔄 Syncing Capacitor with iOS"
npx cap sync ios

# Install CocoaPods dependencies
echo "📱 Installing iOS dependencies"
cd ios/App && pod install

echo "✅ Post-clone script completed successfully"