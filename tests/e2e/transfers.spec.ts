

import { test, expect } from '@playwright/test';

test.describe('LedgerFlow Transfer Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate and load mock tenant
    await page.goto('/acme-corp/transactions');
  });

  test('successfully triggers optimistic transfer creation', async ({ page }) => {
    await page.click('button:has-text("New Transfer")');

    await page.fill('input[name="recipientName"]', 'Global Cloud Services Inc');
    await page.fill('input[name="recipientAccount"]', 'US1092830192830192');
    await page.fill('input[name="amount"]', '450.00');

    await page.click('button:has-text("Send Payment")');

    // Assert optimistic appearance on the UI
    const targetRow = page.locator('tr:has-text("Global Cloud Services Inc")');
    await expect(targetRow).toBeVisible();
    await expect(targetRow).toContainText('-$450.00');
    await expect(targetRow).toContainText('pending');
  });
});