#!/bin/bash

# App Icon Setup Script for Mansa Musa Marketplace
# Run this after git pulling your exported project

echo "🎨 Setting up iOS App Icons..."
echo ""

# Check if we're in the right directory
if [ ! -d "ios/App/App/Assets.xcassets/AppIcon.appiconset" ]; then
    echo "❌ Error: Not in project root or iOS folder not found"
    echo "Please run this from your project root directory"
    exit 1
fi

# Create the icon directory if it doesn't exist
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset

# List of required icon sizes
echo "📋 Required icon files:"
echo "   - AppIcon-1024.png (1024x1024)"
echo "   - AppIcon-180.png (180x180)"
echo "   - AppIcon-167.png (167x167)"
echo "   - AppIcon-152.png (152x152)"
echo "   - AppIcon-144.png (144x144)"
echo "   - AppIcon-120.png (120x120)"
echo "   - AppIcon-114.png (114x114)"
echo "   - AppIcon-100.png (100x100)"
echo "   - AppIcon-87.png (87x87)"
echo "   - AppIcon-80.png (80x80)"
echo "   - AppIcon-76.png (76x76)"
echo "   - AppIcon-72.png (72x72)"
echo "   - AppIcon-60.png (60x60)"
echo "   - AppIcon-58.png (58x58)"
echo "   - AppIcon-57.png (57x57)"
echo "   - AppIcon-50.png (50x50)"
echo "   - AppIcon-40.png (40x40)"
echo "   - AppIcon-29.png (29x29)"
echo "   - AppIcon-20.png (20x20)"
echo ""

# Instructions
echo "📂 Place your generated icon files in one of these locations:"
echo "   1. Project root directory"
echo "   2. In a folder called 'icons' in project root"
echo ""
echo "Then run this script again to copy them automatically"
echo ""

# Check for icons in common locations
if ls AppIcon-*.png 1> /dev/null 2>&1; then
    echo "✅ Found icons in current directory"
    echo "📦 Copying icons to iOS project..."
    cp AppIcon-*.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
    echo "✅ Icons copied successfully!"
elif [ -d "icons" ] && ls icons/AppIcon-*.png 1> /dev/null 2>&1; then
    echo "✅ Found icons in 'icons' folder"
    echo "📦 Copying icons to iOS project..."
    cp icons/AppIcon-*.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
    echo "✅ Icons copied successfully!"
else
    echo "⚠️  No icons found yet"
    echo ""
    echo "Next steps:"
    echo "1. Place your AppIcon-*.png files in the project root or 'icons' folder"
    echo "2. Run this script again: bash setup-icons.sh"
fi

echo ""
echo "🎯 After icons are in place:"
echo "   1. Open Xcode"
echo "   2. Product → Clean Build Folder"
echo "   3. Product → Archive"
echo ""
