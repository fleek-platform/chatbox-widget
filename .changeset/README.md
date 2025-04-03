# Changesets

This directory contains [Changesets](https://github.com/changesets/changesets) files that are used to manage versioning and changelogs for this project.

## What are Changesets?

Changesets are a way to manage versioning and changelogs for your packages. They allow you to:

- Record changes to packages
- Automatically determine the next version number
- Generate changelogs
- Publish packages to npm

## How to use Changesets

### Adding a changeset

When you make a change to the codebase that should result in a version bump, you need to add a changeset:

```bash
npx changeset
```

This will prompt you to:

1. Select the packages that have changed (in this monorepo)
2. Choose the type of change (major, minor, patch)
3. Write a description of the change

A new markdown file will be created in the `.changeset` directory with the information you provided.

### Types of changes

- **major**: Breaking changes
- **minor**: New features, non-breaking changes
- **patch**: Bug fixes, documentation updates

### Commit the changeset

Make sure to commit the changeset file along with your code changes:

```bash
git add .changeset/
git commit -m "Add changeset for [your change]"
```

### What happens next?

When your PR is merged to the main branch, the GitHub Actions workflow will:

1. Create a version PR if there are changesets
2. When the version PR is merged:
   - Update the version in package.json
   - Update the CHANGELOG.md
   - Publish to npm
   - Deploy to GitHub Pages

## Example changeset file

```md
---
'@fleek-platform/agents-chatbox-widget': minor
---

Added new feature X that allows users to do Y.
```
