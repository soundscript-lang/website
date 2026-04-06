---
title: Diagnostics
description: Stable documentation targets for soundscript-owned diagnostics emitted by the checker, compiler, CLI, and macro frontend.
---

:::note Canonical source
This page mirrors the normative diagnostics reference in the soundscript repo:
[`docs/diagnostics.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/diagnostics.md).
:::

This reference explains soundscript-owned diagnostic codes. If you want the same information from
the terminal, use `soundscript explain <code>`.

## Explain a code from the CLI

```bash
npx soundscript explain SOUND1002
npx soundscript explain SOUNDSCRIPT_NO_PROJECT --format json
```

## Checker diagnostics

### SOUND1001

`any` is banned in `.sts`. Use a concrete type, `unknown`, or an explicit validation boundary.

### SOUND1002

Unchecked type assertions are banned in `.sts`. Narrow with runtime checks instead of `as`.

### SOUND1003

Non-null assertions are banned in `.sts`. Prove non-nullness with control flow before use.

### SOUND1004

Numeric enums are banned in `.sts`. Use string literal unions or explicit tagged data instead.

### SOUND1005

A value imported from ordinary `.ts`, JavaScript, or declaration-only code crossed into `.sts`
without an explicit `// #[interop]` boundary.

### SOUND1006

The checker could not parse a `// #[...]` annotation comment.

### SOUND1007

A parsed annotation name is not registered in the current language version.

### SOUND1017

A user-defined type guard or assertion does not prove the predicate it declares.

### SOUND1018

An overload implementation does not satisfy all declared signatures.

### SOUND1019

An assignment depends on an assignability relation that soundscript treats as unsound. Common
examples include mutable array variance, callable parameter variance, and widening a value to an
unrelated class target that only matches structurally.
For the most common before/after fixes, see the `Common Rewrites` guide.

### SOUND1020

Earlier narrowing was invalidated by aliasing, mutation, callback escape, or suspension.
For the most common before/after fixes, see the `Common Rewrites` guide.

### SOUND1021

Null-prototype object creation is banned in `.sts`.

### SOUND1022

This JavaScript feature is outside the stable sound subset. Common examples include reflection,
prototype meta-programming, and weak-reference hazard families.

### SOUND1023

TypeScript pragma comments are banned in `.sts`.

### SOUND1024

An exotic object value is being widened to a plain object surface that soundscript treats as unsafe.

### SOUND1025

Only `Error` values may be thrown in `.sts`.

### SOUND1026

The same annotation name appeared more than once in one attached annotation block.

### SOUND1027

An annotation was attached to a declaration or statement shape that does not support it.

### SOUND1028

This annotation syntax allows arguments, but the attached annotation does not accept them. Today,
the builtin argument-bearing forms are `// #[variance(...)]` and
`// #[value(deep: true)]`.

### SOUND1029

Local ambient runtime declarations in `.sts` require a site-local `// #[extern]` marker.

### SOUND1030

Ambient runtime declarations may not be exported from `.sts`. Use `.d.ts` for declaration-only
exports or provide a real implementation.

### SOUND1031

The `// #[variance(...)]` contract is malformed, incomplete, duplicated, or otherwise invalid.

### SOUND1032

The checked `// #[variance(...)]` contract does not match what the checker can actually prove.

## Compiler diagnostics

### COMPILER2001

The checker accepted the construct, but the compiler backend does not support it yet.

### COMPILER2002

The compiler needs additional heap-runtime generalization or fallback lowering before this construct
can compile honestly.

### COMPILER2003

`// #[value]` classes currently lower only on JS emit paths. Non-JS backends reject them until
there is explicit lowering support.

## Numeric diagnostics

### SOUNDSCRIPT_NUMERIC_MIXED_LEAF

Mixed arithmetic between different concrete machine numeric leaves requires an explicit coercion.

### SOUNDSCRIPT_NUMERIC_ABSTRACT_FAMILY

Arithmetic on abstract numeric families is not allowed until the value is narrowed to a concrete
carrier such as `number` or `bigint`, or explicitly coerced first.

### SOUNDSCRIPT_SORT_COMPARE_REQUIRED

In `.sts`, `sort()` and `toSorted()` require an explicit comparator instead of JavaScript's default
ordering.

## Expansion and analysis diagnostics

### SOUNDSCRIPT_EXPANSION_DISABLED

The current analysis run has expansion-based features turned off. Enable expansion for that run, or
remove the expansion-only syntax from the source.

### SOUNDSCRIPT_ANALYSIS_ERROR

The language service hit an unexpected analysis failure for the file. Check the project
configuration, then restart the language server if the error persists.

## Package and build diagnostics

### SOUNDSCRIPT_BUILD_INVALID_EXPORT

One of the `package.json#soundscript.exports` entries is malformed or points to a missing source
file.

### SOUNDSCRIPT_BUILD_NO_PACKAGE_JSON

`soundscript build` packages a library surface and therefore requires a nearby `package.json`.

### SOUNDSCRIPT_BUILD_NO_EXPORTS

`soundscript build` requires `package.json#soundscript.exports` metadata so it knows which
soundscript source files belong to the package surface.

## CLI diagnostics

### SOUNDSCRIPT_CLI_EXPAND_FILE_NOT_FOUND

The file passed to `soundscript expand --file` is not part of the selected project.

### SOUNDSCRIPT_NO_PROJECT

The CLI could not find the requested `tsconfig.json`. Run `soundscript init` for a new project or
pass `--project` explicitly.

### SOUNDSCRIPT_INIT_CONFLICT

`soundscript init` refused to overwrite existing soundscript-managed files.

### SOUNDSCRIPT_INIT_BASE_PROJECT_MISSING

`soundscript init --mode existing` requires a base `tsconfig.json` in the current directory.

### SOUNDSCRIPT_INVALID_COMMAND

The CLI invocation was invalid. Usage and parse failures exit with code `2`.

### SOUNDSCRIPT_INTERNAL_ERROR

soundscript encountered an unexpected internal failure. Internal tool failures also exit with code
`2`.

## Runtime diagnostics

### SOUNDSCRIPT_RUNTIME_NO_ENTRY

The runtime wrappers were asked to materialize and run without an entry file.

### SOUNDSCRIPT_RUNTIME_NO_PROJECT

The runtime wrappers could not find a `tsconfig.soundscript.json` or `tsconfig.json` for the chosen
entry file.

### SOUNDSCRIPT_RUNTIME_PACKAGE_MISSING

The runtime wrappers could not find an installed `soundscript` package in the current workspace or
an ancestor workspace.

## Macro diagnostics

### SOUNDSCRIPT_MACRO_PARSE

The macro frontend could not parse a macro invocation or branch-block form in the source file.

### SOUNDSCRIPT_MACRO_EXPANSION

Macro expansion failed after parsing. Inspect the diagnostic message and source span for the macro
that produced the error.

### SOUNDSCRIPT_MACRO_UNSUPPORTED_SOURCE_KIND

A user-authored macro import resolved to a non-`.macro.sts` source file.

### SOUNDSCRIPT_MACRO_NON_SOUNDSCRIPT_DEPENDENCY

A macro module dependency escaped into a non-soundscript source file.

### SOUNDSCRIPT_MACRO_INTEROP_GRAPH

A user-authored macro dependency graph crossed an interop boundary that is not allowed for macro
authoring modules.

## When to use this page

Use this reference when you are:

- reading CLI or editor output
- integrating soundscript into CI or automation
- deciding whether a failure is a project finding or a tool/runtime problem
- documenting expected failure modes for your team

## See also

- [CLI Reference](./cli.md)
- [Annotation Spec](./annotation-spec.md)
- [Banned and Restricted Surface](./banned-and-restricted.md)
