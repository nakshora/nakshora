# Nakshora CSS Framework 2.0 - NPM Publishing Guide

Complete step-by-step guide for publishing Nakshora 2.0 to NPM.

---

## ✅ Pre-Publishing Checklist

- [ ] Update version in `package.json` (currently 2.0.0)
- [ ] Update version in `src/index.ts`
- [ ] Build the project successfully
- [ ] Run all tests and ensure they pass
- [ ] Update `CHANGELOG.md` with changes
- [ ] Ensure all documentation is up-to-date
- [ ] Create `.npmignore` file
- [ ] Verify `package.json` has all required fields
- [ ] Test the package locally

---

## 🔧 Step 1: Setup NPM Account

### Create NPM Account

1. Visit https://www.npmjs.com/signup
2. Create a new account with email
3. Verify your email address
4. Set up two-factor authentication (recommended)

### Login to NPM

```bash
npm login
# Enter your username
# Enter your password
# Enter OTP code (if 2FA enabled)
```

Verify login:

```bash
npm whoami
# Should display your username
```

---

## 🏗️ Step 2: Build the Project

### Clean Previous Builds

```bash
rm -rf dist/
rm -rf *.tgz
```

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm run test
npm run test:coverage
```

### Build for Production

```bash
npm run build:prod
npm run minify
```

### Verify Build Output

```bash
ls -lah dist/
# Should contain:
# - nakshora.css
# - nakshora.min.css
# - nakshora.esm.js
# - types/
```

---

## 📋 Step 3: Verify Package.json

Ensure `package.json` has all required fields:

```json
{
  "name": "nakshora",
  "version": "2.0.0",
  "description": "The world's most advanced utility-first CSS framework...",
  "main": "dist/nakshora.esm.js",
  "module": "dist/nakshora.esm.js",
  "types": "dist/types/index.d.ts",
  "style": "dist/nakshora.min.css",
  "files": ["dist", "src", "README.md", "LICENSE"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nakshora/nakshora.git"
  },
  "keywords": ["css", "framework", "utility-first", "responsive", "modern", "tailwind-like"],
  "author": "Rizwan Rahim Chowdhury <rizwan@bsdc.info.bd>",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  }
}
```

---

## 📦 Step 4: Test Package Locally

### Create Test Archive

```bash
npm pack
# Creates nakshora-2.0.0.tgz
```

### Test in Another Directory

```bash
mkdir test-nakshora
cd test-nakshora
npm install ../nakshora-2.0.0.tgz
```

### Verify Installation

```bash
# Check node_modules/nakshora exists
ls -la node_modules/nakshora

# Check dist files are present
ls -la node_modules/nakshora/dist

# Try importing
node -e "require('nakshora')"
```

### Cleanup

```bash
cd ..
rm -rf test-nakshora
rm nakshora-2.0.0.tgz
```

---

## 🚀 Step 5: Publish to NPM

### Option 1: Publish Latest Release

```bash
npm publish
```

This will:

1. Run prepublishOnly script (builds and tests)
2. Upload to NPM registry
3. Make it publicly available

### Option 2: Publish with Tag

```bash
npm publish --tag next
# or
npm publish --tag beta
```

### Option 3: Publish Scoped Package

If you want `@nakshora/css`:

Update `package.json`:

```json
{
  "name": "@nakshora/css"
}
```

Then publish:

```bash
npm publish --access public
```

---

## ✨ Step 6: Verify Publication

### Check NPM Registry

```bash
npm view nakshora
# Shows package details
```

### Install from NPM

```bash
mkdir verify-install
cd verify-install
npm init -y
npm install nakshora
ls -la node_modules/nakshora/dist/
```

### View on Web

Visit: https://www.npmjs.com/package/nakshora

---

## 📝 Step 7: Update Version for Next Release

### Bump Version

```bash
# Patch version (2.0.0 → 2.0.1)
npm version patch

# Minor version (2.0.0 → 2.1.0)
npm version minor

# Major version (2.0.0 → 3.0.0)
npm version major
```

This will:

1. Update `package.json`
2. Create git commit
3. Create git tag

### Push to GitHub

```bash
git push
git push --tags
```

---

## 🔄 Publishing Updates

### After Making Changes

```bash
# 1. Make your code changes
# 2. Test thoroughly
npm run test

# 3. Build
npm run build

# 4. Update version
npm version minor
# or patch or major

# 5. Publish
npm publish

# 6. Push to GitHub
git push
git push --tags
```

---

## 📊 Monitoring After Publish

### View Package Stats

https://www.npmjs.com/package/nakshora/stats

### Set Up CI/CD for Automated Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Publish
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## ⚠️ Common Issues & Solutions

### Issue: Permission Denied

**Solution:**

```bash
npm login
# or use personal access token
npm login --auth-type=legacy
```

### Issue: Package Already Exists

**Solution:**

```bash
# Update version in package.json and try again
npm version patch
npm publish
```

### Issue: Large Bundle Size

**Solution:**

```bash
# Check what's included
npm pack --dry-run

# Use .npmignore to exclude unnecessary files
# Check .npmignore file
```

### Issue: Missing TypeScript Types

**Ensure in package.json:**

```json
{
  "types": "dist/types/index.d.ts"
}
```

Build TypeScript:

```bash
npm run build:ts
```

---

## 🔐 NPM Best Practices

1. **Use Semantic Versioning**
   - MAJOR.MINOR.PATCH
   - 2.0.0 (current)

2. **Write Clear Changelogs**
   - Document all changes
   - Link to related issues/PRs

3. **Use Meaningful Tags**
   - `v2.0.0`, `v2.0.1`, `v2.1.0`
   - Not just `latest`

4. **Require Authentication**
   - Use 2FA on NPM account
   - Use access tokens for CI/CD

5. **Keep README Updated**
   - Installation instructions
   - Usage examples
   - Links to documentation

6. **Maintain Compatibility**
   - Update CHANGELOG.md
   - Note breaking changes
   - Provide migration guide

---

## 📚 Documentation

- [Official NPM Docs](https://docs.npmjs.com/cli/publish)
- [Semantic Versioning](https://semver.org/)
- [Package.json Guide](https://docs.npmjs.com/cli/package.json)

---

## 🎯 After Publishing

### Announce Release

1. **GitHub Release**
   - Create release with tag
   - Add changelog
   - Link to NPM page

2. **Social Media**
   - Tweet about new release
   - Share on relevant communities

3. **Documentation**
   - Update website
   - Add download instructions
   - Link to new version

4. **Community**
   - Notify on Discord/Slack
   - Update GitHub discussions

---

## ✅ Publishing Checklist for Each Release

- [ ] Update version numbers
- [ ] Build project (`npm run build`)
- [ ] Run all tests (`npm run test`)
- [ ] Update CHANGELOG.md
- [ ] Update documentation
- [ ] Review .npmignore
- [ ] Test locally (`npm pack`)
- [ ] Create git tag
- [ ] Publish to NPM (`npm publish`)
- [ ] Verify on npmjs.com
- [ ] Push to GitHub (`git push --tags`)
- [ ] Create GitHub Release
- [ ] Announce release

---

## 🚀 Ready to Publish?

You're all set! Follow this guide to successfully publish Nakshora 2.0 to NPM.

**Start with:** `npm publish`

---

**Happy publishing! 🎉**
