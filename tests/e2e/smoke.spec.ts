import { test, expect, type Page } from '@playwright/test';

/**
 * T0 e2e smoke suite for the vandenit-website factory verify foundation
 * (task NEXT16-CONTENT-PIPELINE).
 *
 * FROZEN from the T0 baseline commit: any change escalates via the ./verify
 * path-assertion-guard. Every selection uses data-testid anchors ONLY
 * ( getByTestId ) — never visible text, user language or text-based roles —
 * with zero console errors and zero page errors per route.
 */

const BLOG_SLUGS = [
  'openlingo-dark-factory',
  'blind-coder-sighted-reviewer',
  'automated-wiki-generation-hermes-chatgpt',
];

function observe(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  return { consoleErrors, pageErrors };
}

async function expectNoErrors(obs: { consoleErrors: string[]; pageErrors: string[] }) {
  expect(
    obs.pageErrors,
    `uncaught page errors: ${obs.pageErrors.join(' | ').slice(0, 500)}`,
  ).toEqual([]);
  expect(
    obs.consoleErrors,
    `console errors: ${obs.consoleErrors.join(' | ').slice(0, 500)}`,
  ).toEqual([]);
}

async function expectShell(page: Page) {
  await expect(page.getByTestId('site-header')).toBeVisible();
  await expect(page.getByTestId('site-footer')).toBeVisible();
}

test('home renders the hero block', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/');
  await expect(page.getByTestId('hero-section')).toBeVisible();
  await expect(page.getByTestId('hero-title')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});

test('about renders the about header', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/about');
  await expect(page.getByTestId('about-header')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});

test('how-i-work renders the engagement process', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/how-i-work');
  await expect(page.getByTestId('engagement-process')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});

test('contact renders the contact hero', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/contact');
  await expect(page.getByTestId('contact-hero')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});

test('posts index lists the blog with tag filters', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/posts');
  await expect(page.getByTestId('posts-heading')).toBeVisible();
  await expect(page.getByTestId('featured-post-card')).toBeVisible();
  await expect(page.getByTestId('tag-filter-panel')).toBeVisible();
  await expect(page.getByTestId('tag-filter-all')).toBeVisible();
  await expect(page.getByTestId('tag-filter-ai')).toBeVisible();
  const cards = page.getByTestId('post-list-card');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(3);
  await expectShell(page);
  await expectNoErrors(obs);
});

test('posts tag filter keeps the featured card', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/posts?tag=ai');
  await expect(page.getByTestId('posts-heading')).toBeVisible();
  await expect(page.getByTestId('featured-post-card')).toBeVisible();
  await expectNoErrors(obs);
});

for (const slug of BLOG_SLUGS) {
  test(`blog post ${slug} renders the article`, async ({ page }) => {
    const obs = observe(page);
    await page.goto(`/posts/${slug}`);
    await expect(page.getByTestId('post-article')).toBeVisible();
    const title = page.getByTestId('post-title');
    await expect(title).toBeVisible();
    expect((await title.textContent())?.trim() ?? '').not.toBe('');
    await expect(page.getByTestId('post-author')).toHaveText('Filip Van den Broeck');
    await expect(page.getByTestId('post-content')).toBeVisible();
    await expectShell(page);
    await expectNoErrors(obs);
  });
}

test('skills index lists the collections', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/skills');
  await expect(page.getByTestId('skills-heading')).toBeVisible();
  await expect(page.getByTestId('skill-collection-wiki-generator')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});

test('skills doc page renders the article', async ({ page }) => {
  const obs = observe(page);
  await page.goto('/skills/wiki-generator/README');
  await expect(page.getByTestId('skill-doc-article')).toBeVisible();
  await expect(page.getByTestId('skill-doc-title')).toBeVisible();
  await expect(page.getByTestId('skill-doc-content')).toBeVisible();
  await expectShell(page);
  await expectNoErrors(obs);
});