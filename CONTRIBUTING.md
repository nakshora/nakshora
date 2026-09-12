# Contributing to Nakshora CSS Framework

Thank you for your interest in contributing to Nakshora! We welcome contributions from everyone in the community.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Reporting Bugs](#reporting-bugs)
5. [Suggesting Enhancements](#suggesting-enhancements)
6. [Pull Requests](#pull-requests)
7. [Style Guide](#style-guide)
8. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing opinions
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git
- Basic knowledge of CSS and TypeScript

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Go to https://github.com/nakshora/nakshora
   # Click "Fork" button
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nakshora.git
   cd nakshora
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/nakshora/nakshora.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Create Development Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Process

### Running Development Server

```bash
npm run dev
```

Starts webpack dev server with live reload at `http://localhost:3000`

### Building Project

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Full build
npm run build
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Check code style
npm run lint

# Fix automatically
npm run format
```

---

## Reporting Bugs

### Before Reporting

- Check existing issues to avoid duplicates
- Test with the latest version
- Gather as much information as possible

### Creating Bug Report

1. Go to [GitHub Issues](https://github.com/nakshora/nakshora/issues)
2. Click "New Issue"
3. Use the bug report template
4. Include:
   - Clear title describing the bug
   - Step-by-step reproduction instructions
   - Expected behavior
   - Actual behavior
   - Screenshots/videos if applicable
   - Your environment (OS, Node version, etc.)
   - Version of Nakshora you're using

### Example Bug Report

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain the problem.

**Environment**
- OS: [e.g. macOS 12.0]
- Node: [e.g. 16.0.0]
- npm: [e.g. 8.0.0]
- Nakshora: [e.g. 2.0.0]
```

---

## Suggesting Enhancements

### Before Suggesting

- Check existing issues and discussions
- Ensure the feature fits Nakshora's scope
- Think about implementation feasibility

### Creating Feature Request

1. Go to [GitHub Issues](https://github.com/nakshora/nakshora/issues)
2. Click "New Issue"
3. Use the feature request template
4. Include:
   - Clear, descriptive title
   - Problem statement
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### Example Feature Request

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context about the feature request.
```

---

## Pull Requests

### Before Starting

1. Create an issue describing the change
2. Get feedback from maintainers
3. Fork the repository
4. Create a feature branch

### PR Requirements

- Clear description of changes
- Related issue reference
- Tests for new functionality
- Updated documentation if needed
- Passes all checks (tests, linting)
- Follows code style guidelines

### Creating a Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request**
   - Go to [Pull Requests](https://github.com/nakshora/nakshora/pulls)
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

3. **PR Template**
   ```markdown
   ## Description
   Brief description of the changes.

   ## Fixes
   Fixes #(issue number)

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe how you tested this.

   ## Checklist
   - [ ] My code follows style guidelines
   - [ ] Tests pass locally
   - [ ] New/updated documentation added
   - [ ] No new warnings generated
   ```

### Review Process

- Maintainers will review your PR
- Feedback and requests may be provided
- Make requested changes
- PR will be merged when approved

---

## Style Guide

### TypeScript

```typescript
// Use type declarations
const myFunction = (param: string): string => {
  return `Hello, ${param}`;
};

// Use interfaces for complex types
interface Config {
  theme: ThemeConfig;
  variants?: VariantsConfig;
}

// Use proper naming conventions
const DEFAULT_THEME = { /* ... */ };
const generateCSS = (config: Config): string => { /* ... */ };
```

### CSS

```css
/* Use semantic class names */
.text-blue-500 { /* ... */ }

/* Group related properties */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

/* Use custom properties for tokens */
:root {
  --color-primary: #3b82f6;
  --spacing-unit: 0.25rem;
}
```

### Documentation

- Use clear, concise language
- Add code examples
- Include usage patterns
- Link to related docs
- Keep current

### Commit Messages

```
Verb: Brief description

Longer explanation of changes if needed.

Fixes #123
```

Good examples:
- `feat: Add dark mode support`
- `fix: Resolve spacing calculation bug`
- `docs: Update installation guide`
- `refactor: Improve CSS generator performance`
- `test: Add tests for theme system`

---

## Community

### Getting Help

- **GitHub Discussions**: [Ask questions](https://github.com/nakshora/nakshora/discussions)
- **Issues**: [Report bugs or request features](https://github.com/nakshora/nakshora/issues)
- **Email**: rrc@bsdc.info.bd

### Communication Channels

- GitHub Issues & Discussions (primary)
- Email (support questions)
- Community Discord (coming soon)

### Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Feel free to reach out:
- Email: rrc@bsdc.info.bd
- GitHub: [@rizwan](https://github.com/rizwan)

---

**Thank you for contributing to Nakshora! 🚀**
