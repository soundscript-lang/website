---
title: Macros
description: The supported macro system in soundscript, including authoring, shipped macros, and declaration macros.
---

:::note Canonical source
This page mirrors the public macro docs in the soundscript repo:
[`docs/macro-authoring.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/macro-authoring.md),
[`docs/derive-macros.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/derive-macros.md),
and the execution model reference in
[`docs/reference/2026-03-31-macro-execution-model.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/reference/2026-03-31-macro-execution-model.md).
:::

Macros are an advanced part of soundscript, but they are not a privileged compiler-only escape
hatch. They are regular imported features with a public authoring model.

Most teams should learn `.sts` first. Come back to this page when you want to reduce repeated
control-flow boilerplate, build declaration helpers, or make library-heavy patterns such as higher
kinded types easier to use.

If you only want the short version:

- call macros rewrite calls such as `Try(...)`, `Match(...)`, `Defer(...)`, and `Do(...)`
- tag macros rewrite tagged templates such as `` sql`...` `` and `` graphql`...` ``
- declaration macros attach through annotations such as `// #[eq]`, `// #[codec]`, and `// #[hkt]`

## The mental model

Macros in soundscript are:

- explicit imports, not ambient global syntax
- authored in `.macro.sts` modules
- expanded through the normal tooling pipeline
- run in a restricted compile-time environment

The important part: the standard library macros are **100% user-space**. `Match`, `Try`, `Defer`,
`Do`, `sql`, `css`, `graphql`, `hkt`, and the derive macros are all built on the same macro system
users can author against. They are shipped with soundscript, but they are not special parser syntax
or hidden compiler forms.

## The three macro forms

Macro definitions are zero-argument exported functions annotated with `// #[macro(...)]`.

The supported forms are:

- `// #[macro(call)]` for call-like macros such as `Try(...)` or `Match(...)`
- `// #[macro(tag)]` for template-tag macros such as `sql\`...\`` or `graphql\`...\``
- `// #[macro(decl)]` for declaration macros used through annotations such as `// #[eq]`

## Writing a user macro

The public authoring import is:

```ts
import { macroSignature } from 'sts:macros';
```

User-authored macro modules are `.macro.sts` files. A minimal call macro looks like this:

```ts
import { macroSignature } from 'sts:macros';

// #[macro(call)]
export function twice() {
  return {
    signature: macroSignature.of(macroSignature.expr('value')),
    expand(ctx: any, signature: any) {
      return ctx.output.expr(
        ctx.quote.expr`(${signature.args.value}) * 2`,
      );
    },
  };
}
```

Usage:

```ts
import { twice } from './twice.macro.sts';

const doubled = twice(21);
```

The descriptor is the macro:

- `signature` tells the editor and expander what shapes the macro accepts
- `expand(...)` returns expression, statement, or control-flow output
- optional hooks such as `hover`, `format`, `bindings`, and `fragments` let a macro participate in
  editor tooling

Macro authors work with `ctx.syntax`, `ctx.quote`, `ctx.output`, `ctx.controlFlow`, `ctx.reflect`,
and `ctx.runtime`, not raw TypeScript AST nodes.

## What shipped macros prove

The shipped macros are the clearest proof that the user-space model is real.

### `Try` handles `Result`/`Option` control flow

```ts
import { Try, ok, type Result } from 'sts:prelude';

declare function fetchUser(): Result<User, Error>;

function loadName(): Result<string, Error> {
  const user = Try(fetchUser());
  return ok(user.name);
}
```

`Try(...)` is a macro, not special parser syntax. It rewrites the local control flow so an `err`
returns early from the enclosing function. That means the familiar “do notation” / “try this
result-like value and return on failure” behavior is library-defined, not compiler magic.

### `Match` does typed pattern-style branching

```ts
import { Match, where, type Err, type Ok } from 'sts:prelude';

const label = Match(result, [
  where(({ value }: Ok<number>) => value, ({ value }) => value > 0),
  ({ error }: Err<Error>) => error.message.length,
]);
```

This is still user-space. The macro expands into ordinary code using the scrutinee type, the arm
signatures, and any guards provided through `where(...)`.

### `Defer` rewrites cleanup

```ts
import { Defer } from 'sts:prelude';

function run(handle: Handle) {
  Defer(() => {
    handle.close();
  });

  handle.write('ok');
}
```

Again, this is a normal macro call. It expands into explicit cleanup logic around the surrounding
function body.

### Tag macros stay in user space too

Tag macros use the same macro system. They are useful when you want a DSL that still stays explicit
in imports and expansions.

```ts
import { sql } from 'sts:prelude';

const query = sql`
  select *
  from users
  where id = ${userId}
`;
```

The important part is not the SQL itself. It is that `sql` is still just an imported macro. It is
not a compiler-only language extension.

### `Do` and `hkt` make library-heavy typing practical

Higher-kinded types in soundscript are still a library-level pattern built on top of existing
TypeScript type machinery. They are not a second hidden type system.

What macros do is make that pattern less painful to write and use.

The `hkt` declaration macro from `sts:hkt` rewrites interface declarations into the library
encoding used by the HKT helpers:

```ts
import { hkt, type TypeLambda } from 'sts:hkt';
import type { Option } from 'sts:result';

// #[hkt]
interface OptionF extends TypeLambda {
  readonly type: Option<this['Args'][0]>;
}
```

The `Do` macro from `sts:typeclasses` then gives you a readable way to use that machinery:

```ts
import { Do } from 'sts:typeclasses';
import { ok, resultMonad } from 'sts:result';

const out = Do(resultMonad<string>(), (bind) => {
  const left = bind(ok(1));
  const right = bind(ok(2));
  return left + right;
});
```

That is still library code. The macros improve ergonomics, but the underlying idea remains an
ordinary TypeScript-level encoding.

## Declaration macros

Declaration macros are imported and then attached through annotations.

The main shipped family today is `sts:derive`:

```ts
import { codec, eq, tagged } from 'sts:derive';

// #[tagged]
// #[eq]
// #[codec]
type Expr =
  | { tag: 'lit'; value: number }
  | { tag: 'add'; left: Expr; right: Expr };
```

Those macros generate companion values such as:

- `ExprTagged`
- `ExprEq`
- `ExprCodec`

This is how soundscript handles a lot of "derive helper" functionality without growing new compiler
syntax for every case.

That is also why declaration macros matter even if you never write one yourself: a lot of the
“generated helper” story in soundscript is built this way instead of through special compiler
keywords.

## Macro module rules

Macro modules are a separate compile-time target.

That means:

- macro authoring modules must be `.macro.sts`
- macro dependency graphs stay inside soundscript source and builtin `sts:*` surfaces
- macro graphs may not cross `#[interop]`, projected `.d.ts`, or foreign `.ts` / `.js` files
- macro modules do not recursively use macro syntax themselves in v1
- compile-time host access is explicit through `ctx.host`

The supported host surface is intentionally small and deterministic:

- `ctx.host.env.get(...)`
- `ctx.host.env.require(...)`
- `ctx.host.fs.readText(...)`
- `ctx.host.fs.readBytes(...)`
- `ctx.host.fs.exists(...)`

Ambient `Deno`, `process`, timers, network access, and other general-purpose runtime globals are
not part of the macro contract.

## What macros are good for

Use macros when you want one of these:

- a reusable control-flow pattern such as `Try`, `Match`, or `Defer`
- a declaration helper that generates companion values next to a type or class
- a tagged DSL such as `sql`, `css`, or `graphql`
- a cleaner authoring story for advanced library patterns such as HKT and typeclasses

If what you want is “make this regular application code safer,” macros are usually not the first
tool to reach for. Start with `.sts`. Reach for macros when the base language is already working and
you want a stronger abstraction layer on top.

## When to care

If you are still deciding whether `.sts` fits your app at all, you can ignore macros until later.

## Related docs

- [Annotation Spec](./annotation-spec.md)
- [CLI Reference](./cli.md)
- [Builtin Modules](./builtin-modules.md)
- [Newtypes and Value Classes](./newtypes-and-value-classes.md)
- [Tooling and Workflow](../guides/tooling-and-js-target.md)
