---
title: Variance Contracts
description: Checked variance annotations for advanced generic interfaces and type aliases.
---

:::note Canonical source
This page mirrors the checked variance contract in the soundscript repo, primarily through
[`docs/annotation-spec.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/annotation-spec.md)
and the checker diagnostics reference in
[`docs/diagnostics.md`](https://github.com/soundscript-lang/soundscript/blob/main/docs/diagnostics.md).
:::

Most teams can skip this page at first. It matters when you are publishing reusable generic APIs and
need to say, precisely, whether a type produces values, consumes them, or both.

In plain English:

- `out` means "I only give you `T` values"
- `in` means "I only accept `T` values"
- `inout` means "I do both"
- `independent` means "the type parameter is just a marker"

## The annotation

```ts
// #[variance(T: out)]
export interface Reader<T> {
  readonly current: T;
}
```

Supported values are:

- `out`
- `in`
- `inout`
- `independent`

## Why variance matters

Variance is about assignability of generics. The classic example is the Animal/Dog callback
problem.

```ts
class Animal {
  feed() {}
}

class Dog extends Animal {
  bark() {}
}

// #[variance(T: in)]
type Handler<T> = (value: T) => void;
```

A handler that accepts any `Animal` can safely be used where a `Dog` handler is expected. The other
direction is unsound, because a `Dog`-only callback cannot safely handle every `Animal`.

That is what `in` means: the type parameter is consumed, so assignability runs in the opposite
direction from a simple "Dog extends Animal" intuition.

If you have only ever used generics in app code, the easiest way to think about it is:

- if a type gives you `T`, it usually wants `out`
- if a type accepts `T`, it usually wants `in`
- if it does both, it usually wants `inout`
- if `T` is just a marker, it may be `independent`

That mental model is simple on purpose. Variance is easier once you stop thinking “what extends
what?” and start thinking “does this API read `T`, write `T`, or both?”

## The four cases

### `out`

Use `out` for producer-style APIs:

```ts
// #[variance(T: out)]
interface Box<T> {
  readonly current: T;
}

declare const dogs: Box<Dog>;
const animals: Box<Animal> = dogs;
```

`Box<Dog>` can stand in for `Box<Animal>` because every `Dog` is still an `Animal`, and the API is
only producing values.

### `in`

Use `in` for consumer-style APIs:

```ts
// #[variance(T: in)]
interface Sink<T> {
  write(value: T): void;
}

declare const animalSink: Sink<Animal>;
const dogSink: Sink<Dog> = animalSink;
```

`Sink<Animal>` can stand in for `Sink<Dog>` because anything that knows how to consume any animal
can certainly consume a dog.

### `inout`

Use `inout` when the same API both reads and writes `T`:

```ts
// #[variance(T: inout)]
interface Cell<T> {
  get(): T;
  set(value: T): void;
}
```

This is the "do not pretend variance is helping here" case. Once an API both accepts and produces
`T`, the checker treats it as invariant.

### `independent`

Use `independent` when a type parameter is a phantom marker rather than stored or consumed data:

```ts
// #[variance(Tag: independent)]
interface Token<Tag> {
  readonly key: string;
}
```

This is useful for brand-like markers where the parameter matters to the type system, but not to the
runtime shape.

## Checked, not trusted

The important part is that `#[variance(...)]` is not just documentation.

If the declaration surface does not actually match the claimed variance, soundscript rejects it.
Overclaiming is a type error.

That gives you two things at once:

- a readable contract for humans
- a checked contract the compiler enforces

If the annotation says `out`, but the declaration also consumes `T`, soundscript rejects it. The
annotation is not a hint. It is part of the checked generic contract.

For example, this overclaims:

```ts
// #[variance(T: out)]
interface BadBox<T> {
  get(): T;
  set(value: T): void; // error
}
```

That annotation says “producer only,” but the declaration clearly consumes `T` too, so the checker
rejects it.

## Where it applies

This currently applies to:

- generic `interface` declarations
- generic `type alias` declarations

Generic classes do not use `#[variance(...)]`. Classes follow the nominal class rules instead.

## When to care

You usually care about variance when you are:

- publishing libraries
- building readers, sinks, codecs, event handlers, or transformer-style APIs
- working with HKT and typeclass-style abstractions
- trying to explain why one generic surface is assignable and another is not

If you are writing ordinary application modules, you can usually ignore this until much later.

## See also

- [Annotation Spec](./annotation-spec.md)
- [Diagnostics](./diagnostics.md)
- [Macros](./macros.md)
- [Newtypes and Value Classes](./newtypes-and-value-classes.md)
