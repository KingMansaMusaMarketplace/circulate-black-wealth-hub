#!/usr/bin/env bash

# Fail fast and show commands
set -euo pipefail
set -x

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
export HOMEBREW_NO_AUTO_UPDATE=1

# Install CocoaPods and Node.js 20 (required by Capacitor CLI >= 7)
echo "📦 Install CocoaPods and Node.js (20.x)"
brew install cocoapods || true

# Try to install Node@20, fallback to latest node if specific version fails
if ! brew install node@20; then
  echo "⚠️ Failed to install node@20, trying latest Node.js version"
  brew install node || true
fi

# Try to link node@20, but continue if it fails
brew link --overwrite --force node@20 || echo "⚠️ Could not link node@20, continuing with system node"

# Ensure Node is available in PATH (try multiple possible locations)
export PATH="/usr/local/opt/node@20/bin:/opt/homebrew/opt/node@20/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

# Verify Node and npm are available, exit if not found
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Attempting to install with default homebrew"
  brew install node
  export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Change to repository root
cd /Volumes/workspace/repository

# Install dependencies
echo "📦 Installing npm dependencies"
# Xcode Cloud maxsockets fix for reliability
npm config set maxsockets 3
# Prefer reproducible install; fallback to npm install if lock is out of sync
if ! npm ci; then
  echo "⚠️ npm ci failed due to lock mismatch. Falling back to npm install..."
  npm install
fi
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