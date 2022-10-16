import { test, expect } from '@playwright/test';

test('test1', async ({ page }) => {
  await page.goto('./tests/xtal-editor-test1.html');
  // wait for 1 second
  await page.waitForTimeout(12000);
  const editor = page.locator('xtal-editor');
  await expect(editor).toHaveAttribute('mark', 'good');
});