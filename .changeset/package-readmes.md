---
'@nakshora/core': patch
'@nakshora/cli': patch
'@nakshora/postcss': patch
'@nakshora/vite-plugin': patch
---

Ship a package `README.md` (and `CHANGELOG.md`) inside the published tarball.
`files` already listed `README.md`, but no package had one, so every package
would have landed on npmjs.com showing "No readme found".
