
#!/bin/bash

# Xcode Cloud Post-Clone Script
# This script runs immediately after cloning your repository

set -e

echo "🔧 Setting up Mansa Musa Marketplace build environment..."

# Install Homebrew if not present
if ! command -v brew &> /dev/null; then
    echo "🍺 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Node.js via Homebrew
echo "📦 Installing Node.js..."
brew install node@18
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"

# Verify Node.js installation
node --version
npm --version

# Install global dependencies
echo "🌐 Installing global npm packages..."
npm install -g @capacitor/cli @ionic/cli

# Navigate to project root and install dependencies
cd ..
echo "📦 Installing project dependencies..."
npm ci

# Create necessary directories
mkdir -p test-results
mkdir -p logs

echo "✅ Build environment setup completed!"
