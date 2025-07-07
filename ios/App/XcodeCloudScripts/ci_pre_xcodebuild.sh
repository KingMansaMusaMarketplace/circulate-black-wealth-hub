
#!/bin/bash

# Xcode Cloud Pre-Build Script for Mansa Musa Marketplace
# This script runs before the Xcode build process

set -e

echo "🚀 Starting Mansa Musa Marketplace pre-build setup..."

# Install Node.js and npm if not available
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
fi

# Navigate to project root
cd ..

# Install dependencies
echo "📦 Installing npm dependencies..."
npm ci

# Build the web app
echo "🏗️ Building React web app..."
npm run build

# Copy built assets to iOS project
echo "📱 Copying web assets to iOS app..."
npx cap copy ios

# Update iOS project with latest web build
echo "🔄 Syncing Capacitor..."
npx cap sync ios

# Run pre-build tests to ensure everything is working
echo "🧪 Running pre-build validation tests..."
npm run test:pre-build

echo "✅ Pre-build setup completed successfully!"
