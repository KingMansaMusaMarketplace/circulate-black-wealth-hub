# Contributing to Mansa Musa Marketplace

Thank you for your interest in contributing to Mansa Musa Marketplace! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Bug Reports**: Found a bug? Open an issue with details
- **Feature Requests**: Have an idea? We'd love to hear it
- **Code Contributions**: Submit pull requests for improvements
- **Documentation**: Help improve our docs
- **Testing**: Help us test new features

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/mansa-musa-marketplace.git
cd mansa-musa-marketplace
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📝 Pull Request Process

### Before Submitting

1. **Run tests**: `npm run test`
2. **Check types**: `npx tsc --noEmit`
3. **Run linter**: `npm run lint`
4. **Test your changes** in the browser

### PR Guidelines

- Use clear, descriptive titles
- Reference any related issues
- Include screenshots for UI changes
- Keep changes focused and atomic
- Update documentation if needed

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(auth): add Google OAuth login
fix(payments): resolve QR code scanning issue
docs(readme): update installation instructions
```

## 🎨 Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with semantic tokens
- **Components**: Small, focused, reusable

### File Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # shadcn/ui components
│   └── [feature]/ # Feature-specific components
├── hooks/         # Custom React hooks
├── pages/         # Route pages
├── utils/         # Utility functions
└── integrations/  # External service integrations
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- src/components/Button.test.tsx
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)

## 🤝 Code of Conduct

Be respectful, inclusive, and constructive. We're building something meaningful for the community.

## 📞 Questions?

Open an issue or reach out to the maintainers. We're happy to help!

---

**Thank you for contributing to economic empowerment! 🏛️**
