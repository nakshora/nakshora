# 📋 NPM Publishing Quick Reference Card

**Nakshora 2.0 - Publishing Checklist & Commands**

---

## 🎯 Publishing in 5 Steps

### Step 1: Prepare
```bash
# Install dependencies
npm install

# Update version
npm version minor

# Build project
npm run build
```

### Step 2: Test
```bash
# Run tests
npm run test

# Test locally
npm pack
npm install ./nakshora-2.0.0.tgz
```

### Step 3: Authenticate
```bash
# Login to NPM
npm login

# Verify login
npm whoami
```

### Step 4: Publish
```bash
# Publish to NPM
npm publish

# Verify publication
npm view nakshora
```

### Step 5: Announce
```bash
# Push to GitHub
git push
git push --tags

# Create GitHub release with changelog
```

---

## 📦 Build Commands

```bash
# Development
npm run dev                # Start dev server

# Building
npm run build             # Full build
npm run build:ts          # TypeScript only
npm run build:css         # CSS only
npm run build:prod        # Production build
npm run minify            # Minify CSS

# Testing
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Code Quality
npm run lint              # Lint code
npm run format            # Format code
```

---

## 🔐 Pre-Publishing Checks

- [ ] Version updated in `package.json`
- [ ] Version updated in `src/index.ts`
- [ ] `CHANGELOG.md` updated
- [ ] Documentation reviewed
- [ ] All tests passing
- [ ] No linting errors
- [ ] Build succeeds
- [ ] `.npmignore` configured
- [ ] README optimized
- [ ] License file present

---

## 📁 Essential Files

| File | Purpose |
|------|---------|
| `package.json` | NPM package config |
| `.npmignore` | Publish ignore rules |
| `README.md` | Package documentation |
| `CHANGELOG.md` | Version history |
| `LICENSE` | License file |
| `dist/` | Build output folder |

---

## 🚀 Complete Publishing Workflow

```bash
# 1. Make your changes
git checkout -b feature/new-feature

# 2. Test thoroughly
npm run test
npm run lint

# 3. Build project
npm run build

# 4. Update version
npm version patch        # 2.0.0 → 2.0.1
# npm version minor     # 2.0.0 → 2.1.0
# npm version major     # 2.0.0 → 3.0.0

# 5. Login (if needed)
npm login

# 6. Publish
npm publish

# 7. Push changes
git push
git push --tags

# 8. Create GitHub release
# Go to GitHub and create release from tag
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied | `npm login` again |
| Already published | Update version |
| Files missing | Check `.npmignore` |
| Large size | Remove dev files |
| Types not found | Check `types` in package.json |

---

## 📊 Publish Verification

```bash
# Check package on NPM
npm view nakshora

# Install from NPM
npm install nakshora

# Check version
npm info nakshora version

# View all versions
npm view nakshora versions

# Check download stats
npm stat nakshora
```

---

## 🔑 Important Notes

1. **Version Numbering**: Use semantic versioning (MAJOR.MINOR.PATCH)
2. **Git Tags**: Always tag releases in git
3. **Changelog**: Update before each release
4. **Documentation**: Keep docs in sync with code
5. **Testing**: Run tests before publishing
6. **File Size**: Monitor package size
7. **Security**: Keep dependencies updated

---

## 📈 Versioning Guide

### PATCH (Bug fixes)
```
2.0.0 → 2.0.1
- Bug fixes
- Minor improvements
- No new features
```

### MINOR (New features)
```
2.0.0 → 2.1.0
- New features
- Backwards compatible
- No breaking changes
```

### MAJOR (Breaking changes)
```
2.0.0 → 3.0.0
- Major rewrite
- Breaking changes
- Migration guide required
```

---

## 🎯 Pre-Release Publishing

### Beta Release
```bash
npm publish --tag beta
npm dist-tag add nakshora@2.0.0-beta latest
```

### Next Release
```bash
npm publish --tag next
npm dist-tag add nakshora@2.1.0-next latest
```

---

## 📚 Useful Links

| Resource | URL |
|----------|-----|
| NPM Package | https://npmjs.com/package/nakshora |
| NPM Docs | https://docs.npmjs.com/ |
| Semantic Versioning | https://semver.org/ |
| GitHub | https://github.com/nakshora/nakshora |

---

## 💾 File Checklist for NPM

```
nakshora-2.0.0.tgz should contain:
├── dist/
│   ├── nakshora.css           ✓
│   ├── nakshora.min.css       ✓
│   ├── nakshora.esm.js        ✓
│   └── types/                 ✓
├── src/                       ✓
├── package.json               ✓
├── README.md                  ✓
├── CHANGELOG.md               ✓
├── LICENSE                    ✓
└── .npmignore                 ✓
```

---

## 🎉 After Publishing

1. **Verify on NPM**: npm view nakshora
2. **Test Installation**: npm install nakshora@latest
3. **Update Website**: Link to npm page
4. **Social Media**: Announce release
5. **GitHub Release**: Create release notes
6. **Community**: Share in forums/discussions

---

## 📞 Support

**For publishing issues:**
- Email: rrc@bsdc.info.bd
- GitHub Issues: https://github.com/nakshora/nakshora/issues

---

**Happy Publishing! 🚀**

**Nakshora 2.0.0 | MIT License | Made by RRC Development**
