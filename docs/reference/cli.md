---
title: CLI Reference
description: The current public command surface for the soundscript CLI.
---

:::note Canonical source
This page mirrors the CLI contract in the soundscript repo, especially
[`docs/v1-user-contract.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/v1-user-contract.md)
and the CLI output design notes in
[`docs/active/2026-03-08-json-cli-output-design.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/active/2026-03-08-json-cli-output-design.md).
:::

This reference covers the CLI commands, output formats, and exit codes used in local workflows,
automation, and CI.

If you only need the basics, start with `init`, `check`, and `compile`.

## Install

```bash
npm install --save-dev soundscript
```

## Commands

### Init

Create a new soundscript project or add soundscript config to an existing TypeScript repo.

```bash
npx soundscript init
npx soundscript init --mode existing
```

### Check

Run the checker on a project.

```bash
npx soundscript check --project tsconfig.soundscript.json
```

### Compile

Compile a project.

```bash
npx soundscript compile --project tsconfig.soundscript.json
```

### Expand

Expand macro-aware source into plain TypeScript output.

```bash
npx soundscript expand --project tsconfig.soundscript.json --out-dir soundscript-expanded
```

### Explain

Look up a soundscript-owned diagnostic code.

```bash
npx soundscript explain SOUND1002
```

### LSP

Start the language server over stdio.

Most teams should let the editor extension launch this instead of running it by hand.

## Output formats

`check`, `compile`, `expand`, and `explain` support:

- `text`
- `json`
- `ndjson`

Examples:

```bash
npx soundscript check --format json
npx soundscript check --format ndjson
npx soundscript compile --format json
npx soundscript explain SOUND1002 --format json
```

## Common options

- `--mode <new|existing>` for `init`
- `-p, --project <path>` for `check`, `compile`, and `expand`
- `--format <text|json|ndjson>` for `check`, `compile`, `expand`, and `explain`
- `--out-dir <path>` for `expand`
- `--help`
- `--version`

## Exit codes

- `0` means success with no blocking diagnostics
- `1` means project findings or unsupported-code findings
- `2` means CLI usage, configuration, or internal tool failure

That distinction is useful in CI and automation because it separates “the project has findings” from
“the tool invocation itself was invalid.”

## Machine-readable guidance

When using `json` or `ndjson`:

- keep `stdout` for the structured payload
- treat `stderr` as human logging or progress output
- prefer `ndjson` for streaming or line-oriented tooling
- use `soundscript explain <code>` when you need stable diagnostic help text

## A note on terminology

Some older project material may talk about “building” a soundscript project. The actual CLI command
surface documented here currently exposes `compile` as the compiler entrypoint.

## See also

- [Tooling and Workflow](../guides/tooling-and-js-target.md)
- [CI and Editor Setup](../guides/ci-and-editor-setup.md)
- [Diagnostics](./diagnostics.md)
