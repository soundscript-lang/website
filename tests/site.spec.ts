import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function seriousViolationsOnly(violations: {impact?: string | null}[]) {
  return violations.filter((violation) =>
    violation.impact === 'serious' || violation.impact === 'critical'
  );
}

test('homepage renders key adoption CTAs', async ({page}) => {
  await page.goto('');

  await expect(
    page.getByRole('heading', {
      name: 'soundscript',
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByText('A stricter subset of TypeScript for the parts of your app where bugs are expensive.'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {name: 'soundscript vs TypeScript', exact: true}),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {name: 'Adoption guide', exact: true}),
  ).toBeVisible();
  await expect(page.getByRole('link', {name: 'Quick start', exact: true})).toBeVisible();
  await expect(page.getByText('A subset of TypeScript', {exact: true})).toBeVisible();
  await expect(page.getByText('Adopt it one file at a time', {exact: true})).toBeVisible();
  await expect(
    page.getByText('Keep your editor, linter, and formatter', {exact: true}),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {name: 'Function parameters stay honest'}),
  ).toBeVisible();
  await expect(
    page.getByText('The classic Animal/Dog callback problem does not get to hide inside assignability.'),
  ).toBeVisible();
  await expect(page.locator('[data-home-snippet="true"] .token').first()).toBeVisible();
});

test('docs landing renders sidebar and toc', async ({page}) => {
  await page.goto('docs/');

  await expect(page.getByRole('heading', {name: 'Introduction'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Getting Started'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Reference'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'The core idea', exact: true})).toBeVisible();
});

test('reference page renders canonical source note and code block', async ({page}) => {
  await page.goto('docs/reference/machine-numerics');

  await expect(page.getByRole('heading', {name: 'Fixed-Width Numeric Types'})).toBeVisible();
  await expect(page.getByText('Canonical source')).toBeVisible();
  await expect(
    page.getByText("import { I16, U8, type u8 } from 'sts:numerics';", {exact: true}),
  ).toBeVisible();
});

test('macro reference page shows the current user-space macro model', async ({page}) => {
  await page.goto('docs/reference/macros');

  await expect(page.getByRole('heading', {name: 'Macros', level: 1})).toBeVisible();
  await expect(page.getByRole('code').filter({hasText: '// #[macro(call)]'}).first()).toBeVisible();
  await expect(
    page.getByText("import { macroSignature } from 'sts:macros';", {exact: true}).first(),
  ).toBeVisible();
  await expect(page.getByText('Match, Try, Defer')).toBeVisible();
  await expect(page.getByText('100% user-space')).toBeVisible();
  await expect(page.getByText('Higher-kinded types in soundscript are still a library-level pattern')).toBeVisible();
});

test('advanced reference pages explain concrete runtime semantics', async ({page}) => {
  await page.goto('docs/reference/newtypes-and-value-classes');

  await expect(page.getByRole('heading', {name: 'Newtypes and Value Classes'})).toBeVisible();
  await expect(page.getByText('soundscript treats classes as nominal across the board')).toBeVisible();
  await expect(page.getByText('new Point(1, 2) === new Point(1, 2)')).toBeVisible();
  await expect(page.getByText("id === '123'; // allowed and can be true at runtime")).toBeVisible();

  await page.goto('docs/reference/machine-numerics');
  await expect(page.getByText('a === b; // true')).toBeVisible();
  await expect(page.getByText('String(U8(1)); // "u8:1"')).toBeVisible();
});

test('homepage passes serious accessibility checks', async ({page}) => {
  await page.goto('');
  const results = await new AxeBuilder({page}).analyze();
  expect(seriousViolationsOnly(results.violations)).toEqual([]);
});

test('docs page passes serious accessibility checks', async ({page}) => {
  await page.goto('docs/');
  const results = await new AxeBuilder({page}).analyze();
  expect(seriousViolationsOnly(results.violations)).toEqual([]);
});
