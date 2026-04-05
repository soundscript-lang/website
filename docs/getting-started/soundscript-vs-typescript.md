---
title: soundscript vs TypeScript
slug: /getting-started/soundscript-vs-typescript
description: The practical differences between ordinary TypeScript and the soundscript subset used in .sts files.
---

soundscript is a stricter subset of TypeScript. `.sts` rejects or tightens the parts of the
language that break soundness.

The goal is simple: if a program is fully `.sts`, the checked type story should be sound. If the
checker accepts an unsound `.sts` program, that is a soundscript bug. Interop is the explicit place
where that closed-world guarantee stops.

## What stays the same

soundscript does **not** introduce parser-level syntax extensions. You still write ordinary
TypeScript and JavaScript syntax, and your existing TypeScript editor, lint, and formatting tooling
can keep working.

Some teams already lint for a few of the patterns below. soundscript makes them part of `.sts`
itself and checks them together with types, import boundaries, and assignability rules. The goal is
not "fewer common pitfalls." The goal is a sound checked language inside `.sts`.

The biggest practical differences are:

- `.sts` as the checked file extension
- comment-attached annotations like `// #[interop]`
- stricter checking rules
- compiler-owned `sts:*` modules for the builtin surface

## The first differences most teams notice

### Some writable assignments stop being “probably fine”

```ts title="TypeScript"
const ids: string[] = ['a'];
const values: (string | number)[] = ids;
values.push(1);
```

```ts title="soundscript"
const ids: string[] = ['a'];
const values: Array<string | number> = [...ids];
values.push(1);
```

This matters when shared mutable data can be widened through one alias and then mutated somewhere
else.

### Interop stays visible

```ts title="TypeScript"
import { readLegacySession } from './legacy.ts';
```

```ts title="soundscript"
// #[interop]
import { readLegacySession } from './legacy.ts';
```

This matters anytime an `.sts` file imports regular `.ts`, `.js`, or declaration-only code.

### Unchecked escapes are gone

```ts title="TypeScript"
const user = raw as User;
const id = maybeId!;
let cache: any = value;
```

```ts title="soundscript"
const user = parseUser(raw);

if (user === undefined) {
  throw new Error('Invalid user.');
}
const id = user.id;
```

This matters in any module where “I know this is fine” becomes a real bug if the assumption is
wrong.

### Throws are disciplined locally

```ts title="TypeScript"
throw 'bad session';
```

```ts title="soundscript"
throw new Error('Bad session.');
```

Local `.sts` code throws `Error` values. If regular TS or JS throws something stranger, the runtime
normalizes it automatically when that error keeps propagating.

## Banned or restricted surfaces

The biggest restrictions are:

- `any`
- unchecked `as` assertions
- non-null assertions
- numeric enums
- implicit truthiness checks where explicit checks are required
- silent interop with ordinary `.ts`, `.js`, or `.d.ts`
- non-`Error` throws in local `.sts` code
- several hazard-prone reflection and meta-programming surfaces

See [Banned and Restricted Surface](../reference/banned-and-restricted.md) for the grouped
reference list.

## Assignment and mutability rules are tighter

soundscript treats some assignability relations as unsound even if TypeScript accepts them. You see
that most clearly around:

- mutable variance
- callable parameter extraction
- aliasing that invalidates earlier narrowing
- widening to unrelated structural targets that do not preserve runtime meaning

These rules are there because `.sts` is trying to be sound, not just a little stricter than
TypeScript.

## See also

- [Quick Start](../getting-started/quick-start.md)
- [Adopt in Existing TypeScript Apps](./adopt-in-existing-typescript-apps.md)
- [Banned and Restricted Surface](../reference/banned-and-restricted.md)
