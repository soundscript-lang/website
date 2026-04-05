---
title: Versions and Release Notes
description: How the docs site handles versioning and when to freeze a release snapshot.
---

This page explains how the docs site handles versioning.

## Current policy

The site ships one active docs set until the first real release tag exists. The versioned-docs flow
is already wired up, but the first frozen snapshot should wait for the real release.

When `1.0.0` is tagged, the maintainer workflow is:

```bash
npm run docs:version:v1
npm run build
```

That freezes a `1.0.0` documentation snapshot while keeping `/docs` as the default docs line.

## Why this is the policy

Freezing docs too early makes the reference drift away from the shipped release. Waiting for the
real tag keeps the docs aligned with what people can actually install.

## What belongs here

This section is for:

- release notes
- compatibility notes
- docs version policy
- major public-surface changes

Do not use it as a blog substitute.

The main reason to use this page is release prep: deciding when to cut a versioned docs snapshot
and explaining why `/docs` and `/docs/1.0.0` may differ after release.

## See also

- [Tooling and Workflow](../guides/tooling-and-js-target.md)
- [V1 Launch Notes](./v1-launch-notes.md)
