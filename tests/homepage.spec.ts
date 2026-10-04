import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const [name, width, height] of [
  ['small phone', 320, 740], ['phone', 390, 844], ['tablet', 768, 1024],
  ['laptop', 1280, 800], ['desktop', 1440, 1000],
] as const) {
  test(`${name}: complete content, working assets, no overflow or runtime errors`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto('/');
    await page.waitForTimeout(2200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.hero-line').first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    for (const section of ['#idea', '#current', '#momentum', '#work', '#impact']) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await expect(page.locator('.project-image img')).toHaveCount(2);
    for (const img of await page.locator('.project-image img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await expect.poll(() => page.locator('img').evaluateAll(elements => elements.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    await expect(page.locator('.impact-cta')).toHaveAttribute('href', 'mailto:dive@b7r.agency');
    expect(errors).toEqual([]);
  });
}

test('service index works with keyboard and keeps one service expanded', async ({ page }) => {
  await page.goto('/');
  const ai = page.locator('.current-item').nth(1);
  await ai.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(ai).toHaveAttribute('open', '');
  await expect(page.locator('.current-item[open]')).toHaveCount(1);
  await expect(page.locator('#current-number')).toHaveText('02 / 03');
  await expect(ai.locator('.current-description')).toBeVisible();
  const apps = page.locator('.current-item').nth(2);
  await apps.locator('summary').click();
  await expect(page.locator('.current-item[open]')).toHaveCount(1);
  await expect(page.locator('#current-number')).toHaveText('03 / 03');
});

test('mobile menu traps focus, closes with Escape and navigates to visible targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await toggle.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Expertise/ }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#current')).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('reduced motion is readable and the ripple stays still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reduced motion' })).toBeDisabled();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  const first = await page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.waitForTimeout(500);
  expect(await page.locator('canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(first);
  await page.locator('.impact').scrollIntoViewIfNeeded();
  await expect(page.locator('.impact-cta')).toBeVisible();
});

test('motion toggle restores a static page and does not accumulate pinned elements', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Pause motion' }).click();
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await page.getByRole('button', { name: 'Resume motion' }).click();
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
  }
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

test('ripple field responds and runs without changing layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.waitForTimeout(2200);
  const canvas = page.locator('canvas');
  const before = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.mouse.move(1050, 350);
  await page.waitForTimeout(500);
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
});

for (const width of [390, 1440]) {
  test(`accessibility audit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('content and service controls remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('.current-item').nth(1).locator('summary').click();
  await expect(page.locator('.current-item').nth(1).locator('.current-description')).toBeVisible();
  await expect(page.locator('.desktop-nav')).toBeVisible();
  await expect(page.locator('.impact-cta')).toHaveAttribute('href', 'mailto:dive@b7r.agency');
  await context.close();
});
