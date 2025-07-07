
#!/bin/bash

# Xcode Cloud Post-Build Script for Mansa Musa Marketplace
# This script runs after the Xcode build process

set -e

echo "🎯 Starting Mansa Musa Marketplace post-build actions..."

# Navigate to project root
cd ..

# Run post-build tests
echo "🧪 Running post-build integration tests..."
npm run test:integration

# Generate test reports
echo "📊 Generating test reports..."
npm run test:report

# Upload crash symbolication files if this is a release build
if [ "$CI_XCODE_SCHEME" == "App" ] && [ "$CI_WORKFLOW" == "Release" ]; then
    echo "📤 Uploading symbolication files..."
    # This would typically upload dSYM files to your crash reporting service
fi

# Notify team of successful build
echo "📨 Sending build notification..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"✅ Mansa Musa Marketplace build completed successfully for $CI_BRANCH\"}" || true

echo "✅ Post-build actions completed!"
