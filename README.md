# soundscript Website

This repository hosts the public soundscript website with a single Docusaurus stack:

- `/` for the marketing homepage
- `/docs` for developer-facing documentation
- future product surfaces like `/playground` as custom pages in the same site

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run build
npm run lint:docs
npm run spellcheck
npm run test:smoke
```

`test:smoke` builds the site, serves the production output locally, and runs Playwright smoke plus
accessibility checks.

## Search

The site is wired for Algolia DocSearch through environment variables:

```bash
cp .env.example .env.local
```

Then set:

- `DOCSEARCH_APP_ID`
- `DOCSEARCH_API_KEY`
- `DOCSEARCH_INDEX_NAME`

If those variables are absent, the site still builds and runs, but the DocSearch UI is not shown.

For GitHub Pages deploys, add the same values as GitHub Actions secrets on the
`website` repo:

- `DOCSEARCH_APP_ID`
- `DOCSEARCH_API_KEY`
- `DOCSEARCH_INDEX_NAME`

## Crawlers and LLMs

The published site also ships crawler-friendly files from `static/`:

- `robots.txt`
- `llms.txt`
- `llms-full.txt`

Those files are meant to make indexing and LLM ingestion more predictable without changing the main
docs content model.

## Docs ownership

The website repo owns:

- homepage content
- onboarding and adoption docs
- task-oriented guides

The soundscript repo remains the canonical source for normative language and tooling references such
as annotations, diagnostics, builtin contracts, machine numerics, and macro semantics. The website
mirrors those references with a canonical-source note at the top of each relevant page.

## Versioning

Docs versioning is prepared in the site configuration, but the first frozen version should be cut
only at the real v1 tag:

```bash
npm run docs:version:v1
```

Run that at the actual `1.0.0` release point, then rebuild and deploy the site.
