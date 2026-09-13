# 🚀 Monorepo Setup & CI/CD Deployment Guide

**Complete setup instructions for Nakshora v3.0 monorepo with automated publishing**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Monorepo Setup](#local-monorepo-setup)
3. [GitHub Configuration](#github-configuration)
4. [NPM Token Setup](#npm-token-setup)
5. [GitHub Actions Configuration](#github-actions-configuration)
6. [Testing the CI/CD Pipeline](#testing-the-cicd-pipeline)
7. [Creating Releases](#creating-releases)
8. [CDN Distribution](#cdn-distribution)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: 18.0.0 or higher
- **pnpm**: 9.0.0 or higher
- **Git**: Latest version
- **GitHub account** with repository access

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check pnpm version
pnpm --version  # Should be 9.0.0 or higher

# Check git
git --version
```

---

## Local Monorepo Setup

### 1. Clone the Repository

```bash
# Clone the Nakshora repository
git clone https://github.com/nakshora/nakshora.git
cd nakshora

# Create a new branch for development
git checkout -b develop
git push -u origin develop
```

### 2. Install pnpm (If Not Already Installed)

```bash
# Install latest pnpm using corepack (Node.js 16.9.0+)
corepack prepare pnpm@9.0.0 --activate

# Or install globally
npm install -g pnpm@9

# Verify installation
pnpm --version
```

### 3. Install Monorepo Dependencies

```bash
# Navigate to project root
cd nakshora

# Install all workspace dependencies
pnpm install

# Verify installation
pnpm list

# This will show all packages and their dependencies
```

### 4. Build All Packages

```bash
# Build all packages
pnpm build

# Or build individual packages
pnpm build:core      # Build @nakshora/core
pnpm build:cli       # Build @nakshora/cli
pnpm build:postcss   # Build @nakshora/postcss
pnpm build:vite      # Build @nakshora/vite-plugin

# Watch mode for development
pnpm dev
```

### 5. Run Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Run tests in specific package
pnpm -F @nakshora/core test
```

### 6. Code Quality Checks

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Format checking
pnpm format:check
pnpm format
```

---

## GitHub Configuration

### 1. Create GitHub Repository Settings

1. Go to your GitHub repository settings: `https://github.com/nakshora/nakshora/settings`

2. **Enable Branch Protection** (Main branch):
   - Go to Settings → Branches → Add rule
   - Branch name pattern: `main`
   - Enable:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date
     - ✅ Require code reviews before merging

3. **Configure Status Checks**:
   - Add required status checks:
     - ✅ `test (18.x)`, `test (20.x)`, `test (22.x)`
     - ✅ `Lint & Format`
     - ✅ `Build & Verify`

### 2. Set Repository Secrets

1. Go to Settings → Secrets and variables → Actions

2. Create these repository secrets:
   - **`NPM_TOKEN`** (for npmjs.org publishing)
   - **`GITHUB_TOKEN`** (auto-created, but verify it exists)

### 3. Configure Repository Variables

1. Go to Settings → Secrets and variables → Variables

2. Add these variables:
   ```
   NPM_REGISTRY=https://registry.npmjs.org
   GITHUB_REGISTRY=https://npm.pkg.github.com
   ```

---

## NPM Token Setup

### 1. Create NPM Account

1. Visit [npmjs.com](https://www.npmjs.com)
2. Click "Sign Up"
3. Fill in registration details:
   - Username: `rrc-dev` or similar
   - Email: `rrc@bsdc.info.bd`
   - Password: Strong, unique password

### 2. Enable Two-Factor Authentication (2FA)

**Recommended for security:**

1. Log in to npmjs.com
2. Go to Account settings → Two-Factor Authentication
3. Enable 2FA (Account security or Dev tools only)
4. Save backup codes

### 3. Create NPM Automation Token

#### For Publishing (Recommended: NPM Provenance)

```bash
# Log in to npmjs.com → Account settings → Tokens

# Create a new token:
# - Type: Automation
# - Scopes: read-only (for verification) or read-write (for publishing)
# - Expiration: 12 months

# Example token format:
# npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Set Token in GitHub

1. Copy your NPM token
2. Go to GitHub repository → Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM token
6. Click "Add secret"

### 4. Verify Token Works Locally

```bash
# Create .npmrc file in project root (optional for local testing)
echo "//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN" > ~/.npmrc

# Test authentication
npm whoami

# This should return your NPM username
```

### 5. Configure npm Provenance (Recommended for Security)

```bash
# In your GitHub Actions workflow (already configured in release.yml)
# Set this environment variable:
export NPM_CONFIG_PROVENANCE=true

# This creates cryptographic attestation of published packages
# Verifiable at: https://docs.npmjs.com/about-npm-provenance
```

---

## GitHub Actions Configuration

### 1. Verify Workflow Files

Check that these files exist in `.github/workflows/`:

```
.github/workflows/
├── release.yml       # Main release workflow
├── test.yml          # Test workflow
└── performance.yml   # Performance tracking
```

### 2. Configure OpenID Connect (OIDC) for npm

**This enables keyless, OIDC-based authentication (most secure):**

1. Go to npmjs.com → Account settings → Authentication tokens
2. Create a new token with:
   - Type: "OIDC Configuration"
   - Audience: `https://github.com/nakshora/nakshora`

3. Add to GitHub secrets:
   - **`NPM_OIDC_AUDIENCE`** = `https://github.com/nakshora/nakshora`

4. The workflow automatically uses OIDC if `NPM_CONFIG_PROVENANCE=true`

### 3. Customize Workflow Files (If Needed)

Edit `.github/workflows/release.yml`:

```yaml
# Update these fields:
- name: 'Publish to GitHub Packages'
  # Adjust package paths if structure differs
  run: |
    for package in packages/@nakshora/*; do
      if [ -f "$package/package.json" ]; then
        cd "$package"
        npm publish --registry https://npm.pkg.github.com --access public
        cd - > /dev/null
      fi
    done
```

### 4. Enable Workflow Permissions

1. Go to Settings → Actions → General
2. Under "Workflow permissions":
   - Select: "Read and write permissions"
   - Select: ✅ Allow GitHub Actions to create and approve pull requests
3. Save

---

## Testing the CI/CD Pipeline

### 1. Create a Test Branch and PR

```bash
# Create a test branch
git checkout -b test/ci-cd-verification

# Make a trivial change
echo "# Test CI/CD" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test(ci): verify CI/CD pipeline"
git push -u origin test/ci-cd-verification
```

### 2. Monitor Workflow Execution

1. Go to GitHub repository → Actions tab
2. Watch workflows run:
   - ✅ `Test & Quality` (test.yml)
   - Status should show passing tests, linting, builds

3. Once all checks pass, create a Pull Request:
   - Compare: `test/ci-cd-verification` → `main`
   - Create PR

4. Monitor the `Release & Publish` workflow:
   - After merge to main, workflow starts automatically

### 3. Verify Package Publication

```bash
# After workflow completes successfully:

# Check @nakshora/core published
npm view @nakshora/core

# Check @nakshora/cli published
npm view @nakshora/cli

# Install and test locally
npm install -g @nakshora/cli
nakshora --version
```

---

## Creating Releases

### 1. Using Changesets (Recommended)

```bash
# Add a changeset
pnpm changeset add

# This creates a file in .changeset/ with:
# - Package name
# - Bump type (patch/minor/major)
# - Change description

# Example output:
# .changeset/feat-jit-compiler.md
```

### 2. Changeset File Format

```markdown
---
'@nakshora/core': minor
'@nakshora/cli': minor
'@nakshora/postcss': minor
'@nakshora/vite-plugin': minor
---

Implement JIT compiler for on-demand CSS generation

- Add dynamic class scanning
- Implement variant system
- Add arbitrary value support
```

### 3. Automatic Release Process

```bash
# Push changeset to main branch
git add .changeset/
git commit -m "chore: add changeset for v3.0.0"
git push

# GitHub Actions automatically:
# 1. Creates a "Release" PR with bumped versions
# 2. Updates CHANGELOG.md
# 3. On merge: publishes to NPM
# 4. Creates GitHub Release
```

### 4. Manual Release (If Needed)

```bash
# Create release manually
pnpm version major|minor|patch

# This:
# - Updates version in package.json files
# - Commits changes
# - Creates git tag

# Publish to NPM
pnpm publish:packages

# Publish to GitHub Packages
pnpm publish:github
```

---

## CDN Distribution

### 1. Automatic CDN Availability

Once published to NPM, packages automatically available on:

```html
<!-- jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/npm/@nakshora/core@3.0.0/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nakshora/core@3.0.0/dist/core.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nakshora/core@3.0.0/dist/core.min.css" />

<!-- Unpkg CDN -->
<script src="https://unpkg.com/@nakshora/core@3.0.0/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@nakshora/core@3.0.0/dist/core.css" />

<!-- Latest version (auto-updates) -->
<script src="https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@nakshora/core/dist/core.css" />
```

### 2. Verify CDN Availability

```bash
# After publishing, wait 5-10 minutes, then verify:

# jsDelivr
curl -I https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.umd.js

# Unpkg
curl -I https://unpkg.com/@nakshora/core@latest/dist/core.umd.js

# Should return HTTP 200 OK
```

### 3. Update Documentation

Add CDN URLs to README and docs:

````markdown
# Installation

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nakshora/core@latest/dist/core.css" />
```
````

## NPM

```bash
npm install @nakshora/core
pnpm add @nakshora/core
yarn add @nakshora/core
```

````

---

## Troubleshooting

### Issue: "pnpm not found"

```bash
# Solution: Install pnpm
corepack prepare pnpm@9.0.0 --activate

# Or use npm to install pnpm globally
npm install -g pnpm@9
````

### Issue: "npm ERR! 403 Forbidden"

**Problem**: NPM_TOKEN not set or invalid

```bash
# Solution 1: Verify token in GitHub
# Go to Settings → Secrets → Check NPM_TOKEN exists

# Solution 2: Test locally
npm whoami

# Solution 3: Create new token on npmjs.com
# Account settings → Tokens → New Token
# Copy and update GitHub secret
```

### Issue: "Cannot find module '@nakshora/core'"

```bash
# Solution: Build all packages first
pnpm build

# Or install dependencies
pnpm install --frozen-lockfile
```

### Issue: "Workflow failed: No permission to publish"

**Problem**: GitHub token permissions

```bash
# Solution:
# Go to Settings → Actions → General
# Under "Workflow permissions" select:
# - Read and write permissions
# - Allow GitHub Actions to create and approve pull requests
```

### Issue: "Types not found after installation"

**Problem**: TypeScript declarations not included

```bash
# Verify package.json has:
{
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js"
    }
  }
}

# Rebuild:
pnpm build
pnpm publish:packages
```

---

## Complete Workflow Summary

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes
# ... edit files ...

# 3. Run tests
pnpm test
pnpm lint
pnpm type-check

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push to GitHub
git push origin feat/new-feature

# 6. Create PR (GitHub creates PR)
# Wait for CI checks to pass
# Request review

# 7. Merge PR to main
# (After approval)
```

### Release Workflow

```bash
# 1. Create changeset
pnpm changeset add

# 2. Commit changeset
git add .changeset/
git commit -m "chore: add changeset"
git push

# 3. GitHub Actions creates Release PR
# (Automatic)

# 4. Review and merge Release PR
# (Automatic publishing)

# 5. Packages published to NPM
# GitHub Release created
# CDN automatically updated
```

---

## Security Best Practices

✅ **Always:**

- Use NPM Automation token (not user token)
- Enable 2FA on npmjs.com account
- Store tokens in GitHub Secrets (not in code)
- Use Branch protection rules
- Require code reviews for main
- Enable OIDC for keyless authentication

❌ **Never:**

- Commit `.npmrc` or tokens to git
- Share NPM tokens
- Use user password in CI/CD
- Publish without tests
- Disable Branch protection

---

## Next Steps

1. ✅ Complete local setup
2. ✅ Set up GitHub repository secrets
3. ✅ Configure Branch protection rules
4. ✅ Test CI/CD pipeline with PR
5. ✅ Create first release using Changesets
6. ✅ Verify CDN availability
7. ✅ Update documentation with CDN URLs

---

## Support & Questions

- 📧 Email: rrc@bsdc.info.bd
- 🌐 Website: rrc.bsdc.info.bd
- 📚 Docs: https://nakshora.dev/docs
- 💬 GitHub Discussions: https://github.com/nakshora/nakshora/discussions

---

**Ready to release? Follow this guide and automate your publishing! 🚀**

**v3.0.0 Monorepo Setup | MIT License | Built by RRC Development**
