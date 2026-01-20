# 🏛️ Mansa Musa Marketplace

**Circulate Black Wealth** — A community-powered platform connecting consumers with Black-owned businesses, fostering economic empowerment through verified business directories, loyalty rewards, and AI-powered assistance.

[![CI](https://github.com/your-username/mansa-musa-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/mansa-musa-marketplace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### 🏪 Business Directory
- **Verified Listings** — Multi-step verification ensures authentic Black-owned businesses
- **Smart Search** — Find businesses by category, location, and ratings
- **QR Code System** — Instant payments and loyalty point collection
- **Business Analytics** — Comprehensive dashboard for business owners

### 🎁 Loyalty & Rewards
- **Points System** — Earn points at participating businesses
- **Digital Wallet** — Track earnings and redeem rewards
- **Referral Program** — Earn bonuses for referring businesses and users

### 🤖 Kayla AI Assistant
- **Voice-Enabled** — Real-time voice conversations powered by OpenAI
- **Business Discovery** — Ask Kayla to find businesses near you
- **Personalized Recommendations** — AI-powered suggestions based on preferences

### 🎓 Community Features
- **HBCU Connections** — Special programs for historically Black colleges
- **Ambassador Program** — Become a community advocate and earn commissions
- **Wealth Metrics** — Track community economic impact in real-time

### 📱 Mobile Apps
- **iOS & Android** — Native apps via Capacitor
- **Push Notifications** — Stay updated on deals and rewards
- **Offline Support** — Access business info without internet

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Payments** | Stripe Connect, QR Code payments |
| **AI** | OpenAI GPT-4o, Realtime Voice API |
| **Analytics** | PostHog, Custom dashboards |
| **Mobile** | Capacitor (iOS/Android) |
| **Maps** | Mapbox GL |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or bun
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mansa-musa-marketplace.git
cd mansa-musa-marketplace

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup

See [`.env.example`](.env.example) for all required environment variables.

---

## 📱 Mobile Development

### iOS

```bash
# Build web assets
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

See [Xcode Cloud Setup](.github/workflows/xcode-cloud-setup.md) for CI/CD configuration.

### Android

```bash
# Build web assets
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [API Integration Guide](docs/API_INTEGRATION_GUIDE.md) | Backend API documentation |
| [Mobile App Guide](docs/MOBILE_APP_GUIDE.md) | iOS/Android development |
| [Admin Guide](docs/ADMIN_SECURITY_AUDIT_GUIDE.md) | Platform administration |
| [B2B Features](docs/B2B_FEATURES_GUIDE.md) | Business-to-business tools |
| [Ambassador Program](docs/AMBASSADOR_PROGRAM_GUIDE.md) | Community advocacy |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live App**: [circulate-black-wealth-hub.lovable.app](https://circulate-black-wealth-hub.lovable.app)
- **Documentation**: [docs.lovable.dev](https://docs.lovable.dev)

---

<p align="center">
  <strong>Built with ❤️ for the community</strong><br>
  <em>Circulating wealth, building futures</em>
</p>
