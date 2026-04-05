import type {ReactNode} from 'react'
import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import CodeBlock from '@theme/CodeBlock'
import Heading from '@theme/Heading'
import type {PrismTheme} from 'prism-react-renderer'
import {Highlight} from 'prism-react-renderer'

import styles from './index.module.css'

const heroFacts = [
  'A subset of TypeScript',
  'Adopt it one file at a time',
  'Keep your editor, linter, and formatter',
]

const whyCards = [
  {
    title: 'Fewer production surprises',
    body:
      'soundscript blocks a few common shortcuts that tend to hide bugs until the code is already in production.',
  },
  {
    title: 'Clearer code review',
    body:
      'If a checked file depends on ordinary TypeScript or JavaScript, that dependency stays visible instead of blending into the import list.',
  },
  {
    title: 'No big rewrite',
    body:
      'Start with auth, parsing, background jobs, and other files where one bad assumption can do real damage. Expand from there only if it pays off.',
  },
]

const changeRows = [
  {
    title: 'Mutable assignment gets stricter',
    body:
      'soundscript rejects writable type widenings that let one part of the program change data in a way another part is not prepared for.',
    ts: `const ids: string[] = ['a'];
const values: (string | number)[] = ids;
values.push(1);`,
    ss: `const ids: string[] = ['a'];
const values: (string | number)[] = [...ids];
values.push(1);`,
  },
  {
    title: 'Function parameters stay honest',
    body:
      'The classic Animal/Dog callback problem does not get to hide inside assignability. If a function needs a Dog, soundscript does not let it pretend it handles every Animal.',
    ts: `type Animal = {name: string};
type Dog = Animal & {bark(): void};

const trainDog = (dog: Dog) => dog.bark();
let onAnimal: (animal: Animal) => void;
onAnimal = trainDog;`,
    ss: `type Animal = {name: string};
type Dog = Animal & {bark(): void};

declare function isDog(
  animal: Animal,
): animal is Dog;

const trainDog = (dog: Dog) => dog.bark();
const onAnimal = (animal: Animal) => {
  if (isDog(animal)) {
    trainDog(animal);
  }
};`,
  },
  {
    title: 'Regular TypeScript stays marked',
    body:
      'When a checked file depends on ordinary TypeScript or JavaScript, you mark it so the boundary is obvious in review.',
    ts: `import { loadLegacy } from './legacy.ts';`,
    ss: `// #[interop]
import { loadLegacy } from './legacy.ts';`,
  },
  {
    title: 'Unchecked shortcuts are gone',
    body:
      'If a value might be wrong, you have to prove it instead of asserting it away with `as`, `!`, or `any`.',
    ts: `const user = raw as User;
const id = maybeId!;`,
    ss: `const user = parseUser(raw);
const id = user.id;`,
  },
  {
    title: 'Conditions stop guessing',
    body:
      'A checked file cannot quietly treat truthy and falsy values as proof. The condition has to say what is actually being ruled out.',
    ts: `if (maybeId) {
  loadUser(maybeId);
}`,
    ss: `if (maybeId !== undefined) {
  loadUser(maybeId);
}`,
  },
]

const adoptionSteps = [
  {
    step: 'Start with one important file',
    body: 'Pick auth checks, request parsing, workflow code, or a background job where a mistake is costly.',
  },
  {
    step: 'Rename it to `.sts`',
    body: 'Run the checker and fix the places where the file relied on unchecked assumptions.',
  },
  {
    step: 'Mark imports from regular TS',
    body: 'Use `// #[interop]` when a checked file depends on ordinary TypeScript or JavaScript, then shrink those imports over time.',
  },
]

const adoptionExample = `// src/refund-order.sts
// #[interop]
import { loadCharge, refundCharge } from '../legacy/payments.ts';

export async function refundOrder(orderId: string): Promise<Refund | undefined> {
  const charge = await loadCharge(orderId);

  if (charge === undefined) {
    return undefined;
  }

  return refundCharge(charge.id, charge.capturedCents);
}`

const advancedCards = [
  {
    title: 'Fixed-width numeric types',
    body:
      'Useful mainly for Wasm-oriented work, binary formats, and explicit data modeling where plain JavaScript numbers are too loose.',
    href: '/docs/reference/machine-numerics',
  },
  {
    title: 'Safer domain types',
    body:
      'Use `#[newtype]` when IDs and domain values should be harder to mix up by accident.',
    href: '/docs/reference/newtypes-and-value-classes',
  },
  {
    title: 'Macros',
    body:
      'Use macros when a repeated pattern should become a checked tool instead of another pile of copy-pasted code.',
    href: '/docs/reference/macros',
  },
]

const evaluationCards = [
  {
    title: 'Compare to TypeScript',
    body: 'Start with what changes in `.sts`: unchecked shortcuts, condition checks, imports, error handling, and assignment rules.',
    href: '/docs/getting-started/soundscript-vs-typescript',
  },
  {
    title: 'Read the adoption guide',
    body: 'See where to start in a real codebase and how to roll it out without rewriting the app.',
    href: '/docs/getting-started/adopt-in-existing-typescript-apps',
  },
  {
    title: 'Quick start',
    body: 'Install it, initialize a project, and check your first `.sts` file locally.',
    href: '/docs/getting-started/quick-start',
  },
]

const homepageSnippetTheme: PrismTheme = {
  plain: {
    color: '#1f2937',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#475569',
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'builtin', 'changed'],
      style: {
        color: '#7c2d12',
      },
    },
    {
      types: ['string', 'char', 'attr-value', 'inserted'],
      style: {
        color: '#166534',
      },
    },
    {
      types: ['function', 'class-name', 'operator', 'entity', 'url'],
      style: {
        color: '#1d4ed8',
      },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: {
        color: '#9a3412',
      },
    },
    {
      types: ['attr-name', 'regex', 'important', 'variable'],
      style: {
        color: '#6d28d9',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#334155',
      },
    },
  ],
}

function HighlightedSnippet({code}: {code: string}) {
  return (
    <Highlight code={code.trimEnd()} language="ts" theme={homepageSnippetTheme}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre
          data-home-snippet="true"
          className={`${styles.compactSnippet} ${className}`.trim()}
          style={{...style, background: 'transparent'}}
          tabIndex={0}>
          {tokens.map((line, lineIndex) => (
            <div key={lineIndex} {...getLineProps({line})}>
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} {...getTokenProps({token})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className="container">
        <div className={styles.heroLayout}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>For TypeScript teams shipping critical code</div>
            <Heading as="h1" className={styles.heroWordmark}>
              <span>sound</span>
              <span className={styles.heroWordmarkAccent}>script</span>
            </Heading>
            <p className={styles.heroTagline}>
              A stricter subset of TypeScript for the parts of your app where bugs are expensive.
            </p>
            <p className={styles.heroText}>
              soundscript is a subset of TypeScript, so your existing editor, linter, formatter,
              and workflow still work. Use <code>.sts</code> files for auth, request parsing,
              background jobs, workflow logic, and other code where a bad assumption becomes a real
              incident.
            </p>
          </div>

          <aside className={styles.heroPanel}>
            <Link className={styles.heroPrimaryAction} to="/docs/getting-started/soundscript-vs-typescript">
              soundscript vs TypeScript
            </Link>
            <div className={styles.heroPanelLinks}>
              <Link className={styles.heroPanelLink} to="/docs/getting-started/quick-start">
                Quick start
              </Link>
              <Link
                className={styles.heroPanelLink}
                to="/docs/getting-started/adopt-in-existing-typescript-apps">
                Adoption guide
              </Link>
            </div>
            <ul className={styles.heroFacts}>
              {heroFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <p className={styles.heroPanelNote}>
              The checker, macros, VS Code extension, and standard library packages all fit into a
              normal TypeScript workflow.
            </p>
          </aside>
        </div>
      </div>
    </header>
  )
}

function HomepageSections() {
  return (
    <main>
      <section className={styles.valueSection}>
        <div className="container">
          <div className={styles.valueIntro}>
            <Heading as="h2" className={styles.valueTitle}>
              Why soundscript?
            </Heading>
            <p className={styles.valueText}>
              It gives TypeScript teams a stricter way to write the code where bugs are painful,
              without making them abandon the stack they already know.
            </p>
            <p className={styles.valueText}>
              In plain English, “sound” means the checker stops you from claiming something is safe
              unless the program has actually proved it.
            </p>
          </div>

          <div className={styles.valueGrid}>
            {whyCards.map((card) => (
              <article key={card.title} className={styles.valueCard}>
                <p className={styles.cardTitle}>{card.title}</p>
                <p className={styles.cardText}>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>What changes in practice</div>
            <Heading as="h2" className={styles.sectionTitle}>
              Here are a few places where <code>.sts</code> is stricter than ordinary TypeScript.
            </Heading>
            <p className={styles.sectionText}>
              soundscript is a subset of TypeScript, but `.sts` is stricter about imports,
              assignments, and local guarantees. These are places where TypeScript code often still
              looks fine right up until it fails at runtime.
            </p>
          </div>

          <div className={styles.changeStack}>
            {changeRows.map((row) => (
              <article key={row.title} className={styles.changeRow}>
                <div className={styles.changeIntro}>
                  <Heading as="h3" className={styles.changeTitle}>
                    {row.title}
                  </Heading>
                  <p className={styles.cardText}>{row.body}</p>
                </div>
                <div className={styles.changeDiff}>
                  <div className={styles.diffPanel}>
                    <div className={styles.diffLabel}>TypeScript</div>
                    <HighlightedSnippet code={row.ts} />
                  </div>
                  <div className={styles.diffPanelPrimary}>
                    <div className={styles.diffLabel}>soundscript</div>
                    <HighlightedSnippet code={row.ss} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className={styles.sectionNote}>
            Linters can catch some of this. soundscript makes these rules part of `.sts` itself and
            checks them together with types, imports, and assignment rules.
          </p>

          <p className={styles.sectionNote}>
            <Link className={styles.inlineLink} to="/docs/getting-started/soundscript-vs-typescript">
              Read the full comparison
            </Link>{' '}
            for the exact rules in `.sts`, including error handling, narrowing, assignment, and
            banned constructs.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>How it fits</div>
            <Heading as="h2" className={styles.sectionTitle}>
              Start with one file, not a rewrite.
            </Heading>
            <p className={styles.sectionText}>
              Keep the TypeScript and npm setup you already use. Because soundscript is a subset of
              TypeScript, your editor support, linting, and existing project tooling continue to
              work while you tighten the files that need extra care.
            </p>
          </div>

          <div className={styles.adoptionLayout}>
            <div className={styles.stepStack}>
              {adoptionSteps.map((item, index) => (
                <article key={item.step} className={styles.stepCard}>
                  <div className={styles.stepNumber}>0{index + 1}</div>
                  <div>
                    <p className={styles.cardTitle}>{item.step}</p>
                    <p className={styles.cardText}>{item.body}</p>
                  </div>
                </article>
              ))}
              <Link
                className={styles.inlineLink}
                to="/docs/getting-started/adopt-in-existing-typescript-apps">
                Read the adoption guide
              </Link>
            </div>

            <div className={styles.boundaryCard}>
              <p className={styles.diffLabel}>A checked file around existing payments code</p>
              <CodeBlock language="ts" title="refund-order.sts">
                {adoptionExample}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>When you need more depth</div>
            <Heading as="h2" className={styles.sectionTitle}>
              Start simple. Go deeper only when the problem calls for it.
            </Heading>
            <p className={styles.sectionText}>
              Most teams should begin with stricter `.sts` files. When you need more, soundscript
              also has tools for fixed-width numbers, safer domain models, and repeated patterns.
            </p>
          </div>

          <div className={styles.advancedGrid}>
            {advancedCards.map((card) => (
              <Link key={card.title} className={styles.advancedCard} to={card.href}>
                <p className={styles.cardTitle}>{card.title}</p>
                <p className={styles.cardText}>{card.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBand}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionEyebrow}>Evaluate it</div>
              <Heading as="h2" className={styles.sectionTitle}>
                Start with the path that matches how your team evaluates tools.
              </Heading>
              <p className={styles.sectionText}>
                Compare it to TypeScript first, read the adoption guide if rollout is the question,
                or jump into the quick start if you already know what you want to try.
              </p>
            </div>

            <div className={styles.ctaGrid}>
              {evaluationCards.map((card) => (
                <Link key={card.title} className={styles.ctaCard} to={card.href}>
                  <p className={styles.cardTitle}>{card.title}</p>
                  <p className={styles.cardText}>{card.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function Home(): ReactNode {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'soundscript',
        url: 'https://soundscript-lang.github.io/website/',
        description:
          'soundscript helps TypeScript teams tighten the contract in critical modules without abandoning the TS ecosystem.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'soundscript',
        url: 'https://soundscript-lang.github.io/website/',
        codeRepository: 'https://github.com/soundscript-lang/soundscript',
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'JavaScript',
        description:
          'A stricter subset of TypeScript for the parts of your app where bugs are expensive.',
        license: 'https://github.com/soundscript-lang/soundscript/blob/main/LICENSE',
      },
    ],
  }

  return (
    <Layout
      title="Make critical TypeScript code easier to trust"
      description="soundscript helps TypeScript teams tighten the contract in critical modules without abandoning the TS ecosystem.">
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <HomepageHeader />
      <HomepageSections />
    </Layout>
  )
}
