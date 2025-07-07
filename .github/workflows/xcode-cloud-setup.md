
# Xcode Cloud Setup Guide for Mansa Musa Marketplace

## Overview
This guide helps you set up Xcode Cloud workflows for automated building, testing, and distribution of the Mansa Musa Marketplace iOS app.

## Prerequisites
- Xcode 14 or later
- Apple Developer Account with Xcode Cloud access
- App Store Connect access
- Capacitor iOS project configured

## Workflow Configurations

### 1. Development Workflow (Quick Health Check)
**Trigger**: Every commit to `develop` branch
**Purpose**: Fast validation of core functionality
**Duration**: ~5-10 minutes

**Test Suite Includes**:
- Authentication tests
- Basic subscription status checks
- QR scanner initialization
- Geolocation permissions
- Core UI component rendering

### 2. Feature Branch Workflow (Comprehensive Testing)
**Trigger**: Pull requests to `main` branch
**Purpose**: Full feature validation
**Duration**: ~15-25 minutes

**Test Suite Includes**:
- All development tests plus:
- Subscription webhook simulation
- Apple/Stripe integration tests
- Business directory search
- Loyalty system functionality
- Community impact calculations

### 3. Release Candidate Workflow (Full Device Matrix)
**Trigger**: Tags matching `v*.*.*` pattern
**Purpose**: Pre-release validation across all target devices
**Duration**: ~30-45 minutes

**Test Suite Includes**:
- All previous tests plus:
- Cross-device compatibility
- Performance benchmarks
- Memory usage validation
- Network connectivity tests
- Offline functionality

## Device Testing Matrix

### Quick Health Check Devices
- iPhone 14 (iOS 16)
- iPad Air (iPadOS 16)

### Comprehensive Testing Devices
- iPhone SE 3rd Gen (iOS 16)
- iPhone 14 (iOS 16)
- iPhone 14 Pro Max (iOS 16)
- iPad Air 5th Gen (iPadOS 16)
- iPad Pro 12.9" (iPadOS 16)

### Full Matrix Testing Devices
- All comprehensive devices plus:
- iPhone 13 mini (iOS 15)
- iPhone 12 (iOS 15)
- iPad 9th Gen (iPadOS 15)
- Mac Studio (macOS 13) - for Apple Silicon compatibility

## Environment Configuration

### Required Environment Variables
```
SUPABASE_URL=https://agoclnqfyinwjxdmjnns.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_PUBLISHABLE_KEY=(from your Stripe dashboard)
```

### Build Settings
- **Deployment Target**: iOS 15.0
- **Swift Version**: 5.8
- **Architectures**: arm64, x86_64 (for simulator)
- **Code Signing**: Automatic

## TestFlight Distribution

### Beta Groups Setup
1. **Internal Testing**: Development team
2. **Business Partners**: Select business owners for feedback
3. **Premium Users**: Existing premium subscribers
4. **Community Leaders**: Key community members

### Distribution Triggers
- **Development builds**: Every successful feature branch test
- **Release candidates**: Tagged releases only
- **Hotfixes**: Emergency patches with expedited review

## Crash Reporting Integration
Xcode Cloud will automatically collect and report crashes from TestFlight builds, integrated with your existing error tracking.
